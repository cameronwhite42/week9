var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
//pageName is the same as fileName but with .html instead of .js
pageName = process.argv[1];
var n = pageName.lastIndexOf('/');
var pageName = pageName.substring(n + 1);
pageName = pageName.replace(".js",".html");

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

io.on('connection', function(socket) {
    payload = {};
    payload.greetings = "hello world";
    socket.emit('news', payload);

    socket.on('doServer', doServer);
    function doServer(data) {
        console.log(data);
    }
});
