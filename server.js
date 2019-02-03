"use strict";
require("dotenv/config");
const express = require("express");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const URL = process.env.URL;

//create the app
const app = express();

//configure app
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//listen to server
app.listen(PORT, () => {
    console.log(`Server is running${URL}:${PORT}`);
});