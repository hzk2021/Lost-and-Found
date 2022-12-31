const express = require("express");
const app = express();

app.get("/login", (req,res) => {
    res.render("login", { title: "Login"});
});

app.post("/login", (req,res) => {
    if (req.body.email = "admin@nyp.edu.sg" && req.body.password == "password") {
        req.session.user = req.body.email;

        return res.redirect("/item/list");
    }

    return res.render("login", {error: "Wrong credential(s)!"})

});


module.exports = app;