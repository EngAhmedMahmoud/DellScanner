"use strict";
const tcp = require("net");
var socketData = [];
var notFound = false;
const fs = require("fs");
const dell_config_file = fs.readFileSync(__dirname + "/../config/dell.config.json");
const dell_config_data = JSON.parse(dell_config_file);

exports.startScan = (ip, port) => {
    return new Promise((resolve, reject) => {
        const API_PATH = dell_config_data.API_PATH;
        const SCANNER_ACTION = dell_config_data.SCANNER_ACTION;
        const SCANNER_TOOL = dell_config_data.SCANNER_TOOL;
        //client to create connection between client and dell server
        let client = new tcp.Socket();
        client.connect(port, `${ip}`, () => {
            console.log('Connected');
            let msg = { action: `${SCANNER_ACTION}`, tool: `${SCANNER_TOOL}`, mode: API_PATH };
            client.write(JSON.stringify(msg));
            client.end();
        });
        client.on('data', (data) => {
            socketData.push(JSON.parse(Buffer.from(data).toString()));
            resolve(socketData);
        });
        client.on('error', function (ex) {
            reject(ex);
            client.destroy();
        });
        client.on("close", () => {
            socketData = [];
            client.destroy();
        });

    })
}
exports.data = socketData;
exports.notFound = notFound;
