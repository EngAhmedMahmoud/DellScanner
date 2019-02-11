"use strict";
require("./utils/db.con");
const express = require("express");
const bodyParser = require("body-parser");
const DellRouter = require("./routes/dell.route");
const fs = require("fs");
const server_config_file = fs.readFileSync("./config/server.config.json");
const server_config_data = JSON.parse(server_config_file);
//connection repeater
const connectionRepeater = require("./utils/connection_repeater");
const PORT = server_config_data.SERVER_PORT || 3000;
const URL = server_config_data.SERVER_URL;

//init connection repeater
connectionRepeater.init;
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