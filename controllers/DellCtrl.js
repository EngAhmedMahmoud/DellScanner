"use strict";
const Device = require("./../models/Dell");
const tcp = require("./../utils/tcp");
const net = require("net");

//all devices 
exports.devices = async (req, res, next) => {
    let devices = await Device.find();
    res.render(__dirname + '/../views/pages/index', { devices: devices });
}
//scan device
exports.scan = async (req, res, next) => {

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
    tcp.startScan(ip, port).then((data) => {
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
                req.flash("save_device", "Device Added Successfully");
                res.redirect('/');
            })
            .catch((err) => {
                if (err) {
                    res.locals.save_error = error;
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
    })
}