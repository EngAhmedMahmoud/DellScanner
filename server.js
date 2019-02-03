"use strict";
require("dotenv/config");
const express = require("express");
const bodyParser = require("body-parser");

//create the app
const app = express();

//listen to server
app.listen(3000, () => {
    console.log("server is running");
})