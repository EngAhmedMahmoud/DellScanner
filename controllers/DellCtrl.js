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
    //check if device not exist
    let not_founrd = tcp.notFound;
    if (not_founrd == true) {
        return res.redirect('/');
    }
    let ip = req.body.ip;
    let port = req.body.port;
    tcp.start(ip, port);
    data = JSON.parse(tcp.data);
    console.log(data);
    console.log(data.length);
    res.render(__dirname + '/../views/pages/config', { data: data, port: port });
}