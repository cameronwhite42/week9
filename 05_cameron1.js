var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

var wpi = require('wiring-pi');
wpi.setup('gpio');
var pin = (process.argv[3] ? Number(process.argv[3]) : 6);
var pin2 = (process.argv[4] ? Number(process.argv[4]) : 17);
console.log("pin2", pin2);

wpi.pinMode(pin, wpi.OUTPUT);
//value = wpi.digitalRead(pin);
value=0;
function toggleBulb() {
    wpi.digitalWrite(pin, value);
        value = +!value;
        console.log("value" , value);
    wpi.digitalWrite(pin2, value);
}
wpi.pinMode(pin2, wpi.OUTPUT);




pageName = process.argv[1];
var n = pageName.lastIndexOf('/');
var pageName = pageName.substring(n + 1);
pageName = pageName.replace(".js", ".html");

var port = (process.argv[2] ? Number(process.argv[2]) : 2001);
app.listen(port);
console.log("listening on port ", port);

function handler(req, res) {
    fs.readFile(__dirname + '/' + pageName, processFile);

    function processFile(err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading ' + pageName);
        }
        res.writeHead(200);
        res.end(data);
    }
}

io.on('connection', function(socket) {
    function sendPinStatus() {
        payload = {};
        payload.pinStatus = wpi.digitalRead(pin);
        socket.emit('status', payload);
    }
    sendPinStatus();
    socket.on('doServer', doServer);
    function sendPin2Status() {
        payload = {};
        payload.pin2Status = wpi.digitalRead(pin2);
        socket.emit('status', payload);
    }
    sendPin2Status();
    socket.on('doServer', doServer);
    function doServer(data) {
        toggleBulb();
        sendPinStatus();
        console.log(data);
    }
});