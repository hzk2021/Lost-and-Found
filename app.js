// app.js

/**
 * Required External Modules
 */

const express = require("express");
const path = require("path");

const item = require("./routes/item.js");
const account = require("./routes/account.js");
const bodyParser = require('body-parser');
const session = require('express-session');
const sqlDB = require('./configs/dbConnection')

/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || 8002

/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: true}))
app.use(session({
    secret: 'IT3122SecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: (1000 * 60 * 60 * 24)}
}));

sqlDB.InitSchema(false);

/**
 * Routes Definitions
 */

app.use((req,res,next) => {
    res.locals.user = req.session.user
    console.log(res.locals)
    next();
})

app.get("/", (req, res) => {
    res.render("home", { title: "Home"});
});

app.use("/item", item);
app.use("/account", account);
/**
 * Server Activation
 */

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`)
});