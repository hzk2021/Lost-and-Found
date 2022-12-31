const express = require("express");

const app = express();

app.get("/list", (req,res) => {
    res.render("item-list-public", { title: "Reported Items"});
});

app.get("/lost", (req,res) => {
    res.status(200).send("lost");
});

module.exports = app;