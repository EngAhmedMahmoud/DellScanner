"use strict";
const tcp = require("net");
var socketData = [];
var notFound = false;


exports.startScan = (ip, port, msg) => {
    return new Promise((resolve, reject) => {
        //client to create connection between client and dell server
        let client = new tcp.Socket();
        client.setTimeout(1000);
        client.connect(port, `${ip}`, () => {
            console.log('Connected');
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
        client.on('timeout', function () {
            console.log('Client request time out. ');
            reject("ex");
        })

    })
}
exports.data = socketData;
exports.notFound = notFound;
