"use strict";
const router = require("express").Router();

//main page
router.get('', (req, res, next) => {
    let styles = ["custom.css"];
    let js = [];
    res.render(__dirname + "/../views/pages/index", { styles: styles, js: js });
});

module.exports = router;