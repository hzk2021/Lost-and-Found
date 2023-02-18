const express = require("express");
const {Item} = require('../models/Item');

const app = express();
const multer = require('multer');
const upload = multer();
const s3Bucket = require('../configs/s3bucket');
const { v4: uuidv4 } = require('uuid');
const {Op, Model, where} = require('sequelize');

const snsService = require('../configs/snsService');
const rekognitionService = require('../configs/rekognitionModeration');

app.get("/create", (req,res) => {
    res.render("create-item", {title: "Create Item"})
});

app.post("/create", upload.single('itemImage'), async (req,res) => {
    const itemUUID = uuidv4();
    const objectKey = itemUUID.toString() + req.body.itemName;

    const itemName = req.body.itemName;
    const itemDescription = req.body.itemDescription;

    let isInappropriate = await rekognitionService.isInappropriate(Buffer.from(req.file.buffer, "binary"));

    if (isInappropriate) {
        return res.render("create-item", {title: "Create Item", error: "Image contains inappropriate contain!" })
    }

    await s3Bucket.uploadObject(`${objectKey}.png`, Buffer.from(req.file.buffer, "binary"), {
        ItemID: itemUUID,
        ItemName: itemName,
        ItemDescription: itemDescription
    });
    
    const createItem = await Item.create({
        ItemID: itemUUID,
        Name: itemName,
        Description: itemDescription,
        ImageS3Url: `${s3Bucket.bucketParams.Bucket}/${objectKey}.png`,
    })
    
    if (createItem)
        console.log("item uploaded");
        snsService.sendEmailToSubscribers(`Hello! This is a notification informing you that an item was recently reported! \n\n Item Name: ${itemName} \n\n Item Description: ${itemDescription}`)

    return res.redirect("/item/list");
});

app.post("/delete/:uuid", async (req, res) => {
    const item_uuid = req.params.uuid;

    const foundItem = await Item.findByPk(item_uuid);

    if (foundItem)
        s3Bucket.deleteImageObject(foundItem.ItemID + foundItem.Name + ".png");
        foundItem.destroy();
        console.log("item uploaded");

    return res.redirect("/item/list");
});

app.get("/list", async (req,res) => {
    let allItems = await Item.findAll();

    // console.log(allItems);

    if (allItems.length > 0){
        for (let i = 0; i < allItems.length; i++) {
            // console.log(i);
            let imageBase64 = await s3Bucket.getImageObject(`${allItems[i].ItemID}${allItems[i].Name}.png`).then(data => {
                return Buffer.from(data).toString('base64');  
            });

            allItems[i].imageBase64 = imageBase64;


            if (i + 1 == allItems.length) {
                if (req.session.user) return res.render("item-list-admin", { title: "Reported Items", items: allItems});
                else return res.render("item-list-public", { title: "Reported Items", items: allItems});
            }  
        }
    }else {
        if (req.session.user) return res.render("item-list-admin", { title: "Reported Items", items: allItems});
        else return res.render("item-list-public", { title: "Reported Items", items: allItems});
    }

});

app.get("/search", async (req,res, next) => {

    var search = req.query.search;

    const condition = {
        [Op.or]: {
            "Name": {[Op.substring]: search},
            "Description": {[Op.substring]: search},
            "DateReported": {[Op.substring]: search}
        }
    }
    let allItems = await Item.findAll({
        where: condition
    });

    console.log(allItems);

    if (allItems.length > 0){
        for (let i = 0; i < allItems.length; i++) {
            let imageBase64 = await s3Bucket.getImageObject(`${allItems[i].ItemID}${allItems[i].Name}.png`).then(data => {
                return Buffer.from(data).toString('base64');  
            });

            allItems[i].imageBase64 = imageBase64;


            if (i + 1 == allItems.length) {
                if (req.session.user) return res.render("item-list-admin", { title: "Reported Items", items: allItems});
                else return res.render("item-list-public", { title: "Reported Items", items: allItems});
            }  
        }
    }else {
        if (req.session.user) return res.render("item-list-admin", { title: "Reported Items", items: allItems});
        else return res.render("item-list-public", { title: "Reported Items", items: allItems});
    }

});
module.exports = app;