
let serial;                             // variable to hold an instance of the serialport library
let portName = '/dev/tty.usbmodem101';  // fill in your serial port name here
let inData;                             // for incoming serial data
let outByte = 0;
let voteSerial;

let dataLow = 120;
let dataHigh = 170;

let burnButton = document.getElementById('button1');
let dontBurnButton = document.getElementById('button2');

burnButton.addEventListener('click', function() {
    console.log('sending data')

    let data = {
        message: 'burn it down'
    }
    socket.emit('message', data);
})

dontBurnButton.addEventListener('click', function() {
    console.log('sending data')

    let data = {
        message: 'save that poor pumpkin'
    }
    socket.emit('message', data);
})

let pumpkin = document.getElementById("pumpkinID");
// let body = document.getElementById("bodyID");
let counter = 0;

function setup() {
    // createCanvas(400, 300);
    // createHTML();                       // make some HTML to place incoming data into
    serial = new p5.SerialPort();       // make a new instance of the serialport library
    serial.on('list', printList);       // set a callback function for the serialport list event
    serial.on('connected', serverConnected); // callback for connecting to the server
    serial.on('open', portOpen);        // callback for the port opening
    serial.on('data', serialEvent);     // callback for when new data arrives
    serial.on('error', serialError);    // callback for errors
    serial.on('close', portClose);      // callback for the port closing

    serial.list();                      // list the serial ports
    serial.open(portName);              // open a serial port

    document.body.style.background = "rgb(255, 0, 0)";
    socket.on('message', voteFeed);
}

function voteFeed(data) {
    // console.log(data);
    // + means burn, - means save
    voteSerial = data.For - data.Against;
    // console.log(voteSerial);
    if (voteSerial > 0) {
      serial.write("0");
    }
    if (voteSerial < 0) {
      serial.write("1");
    }

}

function draw() {
  
    let animationRatio = map(inData, dataLow, dataHigh, 2, 0);
    
    // console.log(animationRatio);
    let backgroundRatio = map(inData, dataLow, dataHigh, 0, 255);
    console.log(backgroundRatio);
    if (counter % 250 == 0) {
      pumpkin.style.animation = "float " + animationRatio + "s infinite";
      document.body.style.background = "rgb(" + backgroundRatio + ", 0, 0)";
    }
    counter++;
    // console.log(counter);
}


// get the list of ports:
function printList(portList) {
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
    console.log(i + " " + portList[i]);
  }
}

function serverConnected() {
  console.log('connected to server.');
}

function portOpen() {
  console.log('the serial port opened.')
}

function serialEvent() {
  // read a byte from the serial port, convert it to a number:
  inData = serial.readLine();
}

function serialError(err) {
  console.log('Something went wrong with the serial port. ' + err);
}

function portClose() {
  console.log('The serial port closed.');
}

// create some HTML elements in the sketch:
function createHTML() {
  serialDiv = createElement('p', 'incoming data goes here');
  serialDiv.attribute('aria-label', 'incoming data');
  serialDiv.attribute('aria-role', 'alert');
  serialDiv.attribute('aria-live', 'polite');
  serialDiv.style('color', 'white');
  serialDiv.position(10, 40);
}
