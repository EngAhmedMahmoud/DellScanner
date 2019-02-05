"use strict";
require("dotenv");
const tcp = require("net");
var socketData = [];
var notFound = false;
exports.start = (ip, port) => {
    const API_PATH = process.env.API_PATH;
    const SCANNER_ACTION = process.env.SCANNER_ACTION;
    const SCANNER_TOOL = process.env.SCANNER_TOOL;

    //client to create connection between client and dell server
    let client = new tcp.Socket();
    client.connect(port, `${ip}`, () => {
        console.log('Connected');
        let msg = { action: `${SCANNER_ACTION}`, tool: `${SCANNER_TOOL}`, mode: API_PATH };
        client.write(JSON.stringify(msg));
        client.end();
    });
    client.on('data', (data) => {
        socketData.push(Buffer.from(data).toString());
        console.log(Buffer.from(data).toString());
    });
    client.on('error', function (ex) {
        socketData = [];
        if (ex) {
            notFound = true;
        }
    });
    client.on("close", () => {
        console.log("Bay");
        socketData = [];
        client.destroy();

    });
}
exports.data = socketData;
exports.notFound = notFound;
