const express = require("express");
const {Item} = require('../models/Item');

const app = express();

app.get("/create", (req,res) => {
    res.render("create-item", {title: "Create Item"})
});

app.post("/create", async (req,res) => {
    const createItem = await Item.create({
        Name: req.body.itemName,
        Description: req.body.itemDescription,
        ImageS3Url: "url1",

    })
    if (createItem)
        console.log("item uploaded");

    const allItems = await Item.findAll();
    console.log(allItems);

    return res.render("item-list-admin", { title: "Reported Items", items: allItems});
});

app.post("/delete/:uuid", async (req, res) => {
    const item_uuid = req.params.uuid;

    const foundItem = await Item.findByPk(item_uuid);

    if (foundItem)
        foundItem.destroy();
        console.log("item uploaded");

    const allItems = await Item.findAll();
    console.log(allItems);

    return res.render("item-list-admin", { title: "Reported Items", items: allItems});
});

app.get("/list", async (req,res) => {
    if (req.session.user) {
        const allItems = await Item.findAll();
        console.log(allItems);
        res.render("item-list-admin", { title: "Reported Items", items: allItems});
    }
    else {
        const allItems = await Item.findAll();
        console.log(allItems);
        return res.render("item-list-public", { title: "Reported Items", items: allItems});
    }
});

app.get("/lost", (req,res) => {
    res.status(200).send("lost");
});

module.exports = app;