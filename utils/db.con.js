"use strict";
require("dotenv/config");
const mongoose = require("mongoose");
const DB_URL = process.env.DB_URL;
//create connection
mongoose.connect(DB_URL, { useNewUrlParser: true })
    .then(() => {
        console.log("Connecting to database sucessfully");
    })
    .catch((error) => {
        console.log("=========== DB-Error ==========");
        console.log(error);
        console.log("===============================")
    })
