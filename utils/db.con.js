"use strict";
const mongoose = require("mongoose");
const fs = require("fs");
const db_config_file = fs.readFileSync("./config/db.config.json");
const db_config_data = JSON.parse(db_config_file);

const DB_URL = db_config_data.DB_URL;
//create connection
mongoose.connect(DB_URL, { useNewUrlParser: true, useCreateIndex: true, })
    .then(() => {
        console.log("Connecting to database sucessfully");
    })
    .catch((error) => {
        console.log("=========== DB-Error ==========");
        console.log(error);
        console.log("===============================")
    });
