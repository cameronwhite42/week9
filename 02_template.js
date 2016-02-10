//In this folder, run sudo npm install wiring-pi
var wpi = require('wiring-pi');

wpi.setup('gpio');
var pin = (process.argv[2] ? Number(process.argv[2]) : 17);

wpi.pinMode(pin, wpi.OUTPUT);

value = 1;

setInterval(function() {
  wpi.digitalWrite(pin, value);
  value = +!value;
}, 500);