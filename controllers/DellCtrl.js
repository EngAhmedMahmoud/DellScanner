"use strict";
const Device = require("./../models/Dell");
const tcp = require("./../utils/tcp");
//all devices 
exports.devices = async (req, res, next) => {
    let devices = await Device.find();
    res.render(__dirname + '/../views/pages/index', { devices: devices });
}
//scan device
exports.scan = (req, res, next) => {
    /*
    do not forget validation
    */
    let ip = req.body.ip;
    let port = req.body.port;
    tcp.start(ip, port);
    res.json({ connect: true });
}