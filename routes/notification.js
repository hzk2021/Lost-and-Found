const express = require("express");

const app = express();

const snsService = require('../configs/snsService');

app.get("/subscribe", (req,res) => {
    res.render("subscribe", {title: "Email Subscription"})
});

app.post("/subscribe", (req,res) => {
    const userEmail = req.body.email;
    snsService.subscribeToTopic(userEmail);

    return res.render("subscribe", {message: "A verification email has been sent to you!"});
});

module.exports = app;