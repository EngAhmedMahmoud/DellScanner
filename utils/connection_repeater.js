"use strict";
const Alarm = require("./../models/Alarm");

function RepeaterCheck() {
    //compare the fack alarm time with the current time
    Alarm.find().then((devices) => {
        for (let index = 0; index < devices.length; index++) {
            console.log(devices[index].created_at);

        }
    }).catch(error => { console.log(error) });

}
//calling function every 
exports.init = setInterval(RepeaterCheck, 1000 * 60);