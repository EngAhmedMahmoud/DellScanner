"use strict";
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const Device = new schema({
    ip: {
        type: String,
        unique: true,
        required: true,
        dropDups: true
    },
    port: {
        type: Number,
        unique: true,
        required: true,
        dropDups: true
    },
    name: {
        type: String,
        unique: true,
        required: true,
        dropDups: true
    },
    branch: {
        type: String
    },
    sensors: {
        type: Number
    },
    lat: {
        type: String
    },
    lng: {
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