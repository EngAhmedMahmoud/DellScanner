"use strict";
const Alarm = require("./../models/Alarm");

function RepeaterCheck() {
    //compare the fack alarm time with the current time
    Alarm.find().then((devices) => {
        for (let index = 0; index < devices.length; index++) {
            var date = new Date();
            var oldDate = devices[index].created_at.toLocaleDateString();
            console.log(new Date(date.getTime() - oldDate.getTime()));
            var oldTime = devices[index].created_at.toLocaleTimeString();
            if (oldTime == "5:35:30 PM") {
                console.log("+++++++++++++++++++++++++++++")
            }
            console.log(oldDate);
            console.log(oldTime);
        }
    }).catch(error => { console.log(error) });
}
//calling function every 
exports.init = setInterval(RepeaterCheck, 10000);