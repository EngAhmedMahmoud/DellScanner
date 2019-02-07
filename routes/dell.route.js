"use strict";
const router = require("express").Router();
const DellController = require('./../controllers/DellCtrl');

//main page
router.get('', DellController.devices);
router.post('/scan', DellController.scan);
router.post('/save_config', DellController.save_config);

module.exports = router;