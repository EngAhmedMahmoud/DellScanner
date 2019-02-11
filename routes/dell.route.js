"use strict";
const router = require("express").Router();
const DellController = require('./../controllers/DellCtrl');
const fs = require('fs');
const dell_config_file = fs.readFileSync(__dirname + "/../config/dell.config.json");
const dell_config_data = JSON.parse(dell_config_file);


router.get('', DellController.devices);
router.post('/scan', DellController.scan);
router.post('/save_config', DellController.save_config);
router.get("/delete/:id", DellController.delete);
router.get("/edit/:id", DellController.edit);
router.post("/edit_config", DellController.update);
router.post(`${dell_config_data.API_PATH}`, DellController.dell_alarm)
module.exports = router;