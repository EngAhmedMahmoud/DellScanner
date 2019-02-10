"use strict";
const Device = require("./../models/Dell");
const tcp = require("./../utils/tcp");
const net = require("net");
const fs = require("fs");
const dell_config_file = fs.readFileSync(__dirname + "/../config/dell.config.json");
const dell_config_data = JSON.parse(dell_config_file);
const API_PATH = dell_config_data.API_PATH;
const SCANNER_ACTION = dell_config_data.SCANNER_ACTION;
const SCANNER_TOOL = dell_config_data.SCANNER_TOOL;

//all devices 
exports.devices = async (req, res, next) => {
    let devices = await Device.find();
    res.render(__dirname + '/../views/pages/index', { devices: devices });
}
//scan device
exports.scan = async (req, res, next) => {
    let msg = { action: `${SCANNER_ACTION}`, tool: `${SCANNER_TOOL}`, mode: API_PATH };

    let ip = req.body.ip;
    let port = req.body.port;
    let error = [];
    if (ip == undefined || ip == '') {
        error.push("Enter IP Address");
    }
    if (port == undefined || port == '') {
        error.push("Enter Port Address");
    }
    //check if this ip exists in data
    let device = await Device.find({ ip: ip });
    let devices = await Device.find();
    tcp.startScan(ip, port, msg).then((data) => {
        if (device.length != 0) {
            error.push("This IP Reserved");
            res.render(__dirname + '/../views/pages/index', { error: error, port: port, ip: ip, devices })
        } else {
            res.render(__dirname + '/../views/pages/config', { data: data, port: port, ip: ip });
        }

    }).catch((err) => {
        error.push("Device Not Exist");
        if (err) {
            res.render(__dirname + '/../views/pages/index', { error: error, port: port, ip: ip, devices });
        }

    });
}
//save device
exports.save_config = (req, res, next) => {
    let ip = req.body.ip;
    let port = req.body.port;
    let name = req.body.name;
    let branch = req.body.branch;
    let sensors = req.body.sensors;
    let lat = req.body.lat;
    let lng = req.body.lng;
    let source = req.body.source;
    let group = req.body.group;

    let error = [];
    //check all data required
    if (ip == undefined || ip == '') {
        error.push("Enter IP Address");
    }
    if (port == undefined || port == '') {
        error.push("Enter Port Number");
    }
    if (name == undefined || name == '') {
        error.push("Enter Name");
    }
    if (branch == undefined || branch == '') {
        error.push("Enter Branch");

    }
    if (sensors == undefined || sensors == '') {
        error.push("Enter Sensors");
    }
    if (lat == undefined || lat == '') {
        error.push("Enter Latitude");
    }
    if (lng == undefined || lng == '') {
        error.push("Enter Longitude");
    }
    if (!net.isIP(ip)) {
        error.push("Enter Valid IP");
    }
    if (error.length != 0) {
        res.render(__dirname + '/../views/pages/config', { error: error, data: req.body });
    } else {
        //save device in database
        let savedDevice = new Device({
            ip: ip,
            port: port,
            name: name,
            branch: branch,
            sensors: sensors,
            lat: lat,
            lng: lng,
            source: source,
            group: group
        });
        savedDevice.save()
            .then((data) => {
                let msg = {
                    action: `${SCANNER_ACTION}`, tool: `ayhaga`, source: source,
                    group: group, location: lat + "," + lng
                };
                tcp.startScan(ip, port, msg).then((data) => {
                    res.redirect('/');
                });
            })
            .catch((err) => {
                console.log(err);
                if (err) {
                    res.redirect('/');
                }
            });

    }




}
//delete device 
exports.delete = (req, res, next) => {
    let device = req.params.id;
    Device.findByIdAndDelete(device)
        .then((deleted) => {
            res.redirect("/");
        })
        .catch(async (error) => {
            res.redirect("/");
        });
}
//edit device
exports.edit = (req, res, next) => {
    let device = req.params.id;
    Device.findById(device).then((data) => {
        res.render(__dirname + '/../views/pages/edit', { data: data });
    }).catch((err) => {
        res.redirect('/');
    });
}
//update device
exports.update = async (req, res, next) => {
    let updatedDevice = {
        ip: req.body.ip,
        port: req.body.port,
        name: req.body.name,
        branch: req.body.branch,
        sensors: req.body.sensors,
        lat: req.body.lat,
        lng: req.body.lng,
        source: req.body.source,
        group: req.body.group,
    }
    let devices = await Device.find();
    let msg = {
        action: `${SCANNER_ACTION}`, tool: `ayhaga`, source: updatedDevice.source,
        group: updatedDevice.group, location: updatedDevice.lat + "," + updatedDevice.lng
    };
    //check if this ip exists in data
    let device = await Device.find({ ip: updatedDevice.ip });
    tcp.startScan(updatedDevice.ip, updatedDevice.port, msg).then((data) => {
        Device.findOneAndUpdate({ ip: updatedDevice.ip }, { $set: updatedDevice })
            .then((data) => {
                res.redirect('/');
            })
            .catch((error) => {
                console.log(error);
            });

    }).catch((err) => {

        let error = ["Device Not Exist"];
        if (err) {
            res.render(__dirname + '/../views/pages/index', { error: error, devices });
        }
    });
}
//save edit