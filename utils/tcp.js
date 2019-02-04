"use strict";
const tcp = require("net");

exports.start = (ip, port) => {
    let client = new tcp.Socket();
    client.connect(port, `${ip}`, () => {
        console.log('Connected');
        let msg = { action: "config", tool: "scan" };
        client.write(JSON.stringify(msg));
        client.destroy();
    });
}
/*
 client.on('data', function (data) {
            console.log('Received: ' + data);
        });
        client.on('close', function () {
            console.log('Connection closed');
        });
*/
