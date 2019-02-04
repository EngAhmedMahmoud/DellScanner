"use strict";
const router = require("express").Router();

//main page
router.get('', (req, res, next) => {
    res.render(__dirname + "/../views/pages/index");
});

module.exports = router;