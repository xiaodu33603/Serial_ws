let WebSocketServer = require('ws').Server;
let https = require("https");
let SerialPort = require("serialport");
let fs = require("fs");
let config = JSON.parse(fs.readFileSync('profile.json').toString()).devices;
let pfxpath = 'C:/socket/api.xiaodu33603.com.pfx'; //这里是你的网站证书
let passpath = 'C:/socket/keystorePass.txt'; //这里是你的网站秘钥
let options = {
    pfx: fs.readFileSync(pfxpath),
    passphrase: fs.readFileSync(passpath),
};
let server = https.createServer(options, (req, res) => {
    res.writeHead(200);
    res.end("this is a websocket server \n");
}).listen(9999);

let wss = new WebSocketServer({ server: server });

wss.on("connection",connection => {
        console.log("连接成功");
		const serialPort = new SerialPort(config.scanningGun.portName, config.scanningGun.portConfig, false);
        serialPort.on('data', function (data) {
		//console.log('Data', data.toString('utf8'));
        wss.clients.forEach(function each(client) {
        var msg = data.toString(); //上位机传回来的数据是68,549这样的
		var msgs = msg.substr(msg.length-5);
		var mss = msg.substring(0,3);
		const dats = { //这里转成json，类似 {"key":"2021-02-04T06:23:58.816Z","value":"549\r\n","bpm":",68"}
          key: new Date(),
          value: msgs,
		  bpm: mss
        }
		client.send(JSON.stringify(dats)); //发送数据
    });
    })
    }
);