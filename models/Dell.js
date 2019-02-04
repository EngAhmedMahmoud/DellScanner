"use strict";
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const Device = new schema({
    ip: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    branch: {
        type: String
    },
    sensors: {
        type: Number
    },
    location: {
        type: String
    },
    source: {
        type: String
    },
    group: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Device', Device, 'devices');