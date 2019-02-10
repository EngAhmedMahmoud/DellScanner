"use strict";
const router = require("express").Router();
const DellController = require('./../controllers/DellCtrl');

//main page
router.get('', DellController.devices);
router.post('/scan', DellController.scan);
router.post('/save_config', DellController.save_config);
router.get("/delete/:id", DellController.delete);
router.get("/edit/:id", DellController.edit);
router.post("/edit_config", DellController.update);

module.exports = router;