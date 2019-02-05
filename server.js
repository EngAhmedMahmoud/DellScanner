"use strict";
require("dotenv/config");
require("./utils/db.con");
const express = require("express");
const bodyParser = require("body-parser");
const DellRouter = require("./routes/dell.route");
const PORT = process.env.SERVER_PORT || 3000;
const URL = process.env.SERVER_URL;

//create the app
const app = express();

//config view engine
app.set("view engine", "pug");

//serve static files
app.use(express.static("assets"));

//configure app
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//dell router
app.use('', DellRouter);

//handle 404 error
app.use((req, res, next) => {
    let error = new Error;
    if (error) {
        error.code = 404;
        error.msg = "Not Found";
        return next(error);
    }
});
app.use((error, req, res, next) => {
    if (error) {
        res.render('partials/404');
    } else {
        next();
    }
});

//listen to server
app.listen(PORT, () => {
    console.log(`Server is running at ${URL}:${PORT}`);
});