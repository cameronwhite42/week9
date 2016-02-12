var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var exec = require('child_process').exec;

//pageName is the same as fileName but with .html instead of .js
pageName = process.argv[1];
var n = pageName.lastIndexOf('/');
var pageName = pageName.substring(n + 1);
pageName = pageName.replace(".js", ".html");

//if port not given use this as default
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

io.on('connection', onConnect);

interval = 0;
function onConnect(socket) {
    if(!interval) interval = setInterval(getWifiSignalStrength, 1000);
}

function getWifiSignalStrength() {
    function puts(error, stdout, stderr) {
        data = stdout;
        //console.log(data);
        io.sockets.emit('pushdata', data);
    }
    exec("awk 'NR==3 {print \$3 \"00\"}''' /proc/net/wireless", puts);
}