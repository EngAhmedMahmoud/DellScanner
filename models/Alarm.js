"use strict";
const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Alarm = new schema({
    ip: {
        type: String,
        required: true
    },
    is_alarm: {
        type: String,
        required: true
    },
    alarm_msg: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
    updated_at: {
        type: Date,
        default: Date.now()
    }
});
module.exports = mongoose.model("Alarm", Alarm, 'alarms');