var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

var wpi = require('wiring-pi');
wpi.setup('gpio');
var pin = (process.argv[3] ? Number(process.argv[3]) : 17);

wpi.pinMode(pin, wpi.OUTPUT);
value = wpi.digitalRead(pin);

function toggleBulb() {
    wpi.digitalWrite(pin, value);
    value = +!value;
}

pageName = process.argv[1];
var n = pageName.lastIndexOf('/');
var pageName = pageName.substring(n + 1);
pageName = pageName.replace(".js", ".html");

var port = (process.argv[2] ? Number(process.argv[2]) : 3000);
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

    function doServer(data) {
        toggleBulb();
        sendPinStatus();
        console.log(data);
    }
});