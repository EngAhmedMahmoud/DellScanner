"use strict";
const Device = require("./../models/Dell");
const Alarm = require("./../models/Alarm");
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
    let FromIP = req.body.FromIP;
    let ToIP = req.body.ToIP;
    let port = req.body.port;
    let error = [];
    if (FromIP == undefined || FromIP == '') {
        error.push("Enter From IP Address");
    }
    if (ToIP == undefined || ToIP == '') {
        error.push("Enter From To IP Address");
    }
    if (port == undefined || port == '') {
        error.push("Enter Port Address");
    }
    //check ip vlidation 
    let ipValidation = compareIp(FromIP, ToIP);
    if (ipValidation == true) {
        //start scanning process
        return res.json(ipValidation);
    } else {
        //return error
        return res.json(ipValidation);
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
//get alarms
exports.dell_alarm = (req, res, next) => {
    let ip = req.body.ip;
    let is_alarm = req.body.isAlarm;
    let alarmMsg = req.body.alarmMsg;
    let type = req.body.type;
    if (is_alarm == "false") {
        //check if fake alarms exists or not 
        Alarm.find({
            ip: ip,
            is_alarm: is_alarm,
        }).then((alarm) => {
            if (alarm && alarm.length != 0) {

                Alarm.findByIdAndUpdate(alarm[0]._id, { created_at: Date.now(), updated_at: Date.now() }, { new: true })
                    .then((updated) => {
                        res.status(200).json(updated);
                    }).catch((err) => {
                        res.status(500).json(err);
                    })
            } else {
                //saving alarm in db
                let newAlarm = new Alarm({
                    ip: ip,
                    is_alarm: is_alarm,
                    alarm_msg: alarmMsg,
                    type: type
                });
                newAlarm.save()
                    .then((alarm) => {
                        res.status(200).json({
                            alarm
                        });
                    })
                    .catch((error) => {
                        res.status(500).json({
                            error
                        });
                    });
            }
        }).catch((error) => {
            res.status(500).json(error);
        })
    } else {
        //saving it as areal alarm
        let newAlarm = new Alarm({
            ip: ip,
            is_alarm: is_alarm,
            alarm_msg: alarmMsg,
            type: type
        });
        newAlarm.save()
            .then((alarm) => {
                res.status(200).json({
                    alarm
                });
            })
            .catch((error) => {
                res.status(500).json({
                    error
                });
            });
    }
}
//compare two ips 
function compareIp(FromIP, ToIP) {

    let errors = [];
    let ipFromSplited = FromIP.split(".");
    let ipToSplited = ToIP.split(".");
    //compare length 
    let ip_length_compare = ipLength(ipFromSplited, ipToSplited);
    if (ip_length_compare == false) {
        errors.push("IP Length Not Correct");
    }
    //compare first part equality
    let ip_three_parts_compare = ThreePartCompare(ipFromSplited, ipToSplited);
    if (ip_three_parts_compare == false) {
        errors.push("The Range Not valid");
    }
    if (errors.length != 0) {
        return errors;
    } else {
        return true;
    }


}
function ipLength(from_ip, to_ip) {
    if (from_ip.length != 4 || to.length != 4) {
        return false;
    }
}
function ThreePartCompare(ipFrom, ipTo) {
    //ip from parts
    let firstFromPart = ipFromSplited[0];
    let secondFromPart = ipFromSplited[1];
    let thirdFromPart = ipFromSplited[2];
    let forthFromPart = ipFromSplited[3];
    //ip to parts
    let firstToPart = ipToSplited[0];
    let secondToPart = ipToSplited[1];
    let thirdToPart = ipToSplited[2];
    let forthToPart = ipToSplited[3];

    if ((firstFromPart == firstToPart) && (secondFromPart == secondToPart) && (thirdFromPart == thirdToPart)) {
        if (firstFromPart <= 255 && secondFromPart <= 255 && thirdFromPart <= 255 && forthFromPart <= 255 && forthToPart <= 255) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }

}