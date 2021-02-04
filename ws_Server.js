const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const SerialPort = require("serialport");
const fs = require('fs');
const config=JSON.parse(fs.readFileSync('profile.json').toString()).devices;

const app = express();
app.use(express.static(__dirname));
const server = http.createServer(app);
const wss = new WebSocket.Server({server});

wss.on('connection', function connection(ws) {
    console.log('连接成功');
    const serialPort = new SerialPort(
        config.scanningGun.portName, config.scanningGun.portConfig, false);
    serialPort.on('data', function (data) {
        console.log('Data', data.toString('utf8'));
            wss.clients.forEach(function each(client) {
        client.send(data.toString('utf8'));
    });
    })
});

server.listen(9999, function listening() {
    console.log('服务器已启动');
});