let express = require('express');
let app = express();
let server = app.listen(3000);
let socket = require('socket.io');
let io = socket(server);

let votesFor = 0;
let votesAgainst = 0;

io.sockets.on('connection', newConnection);

app.use('/', express.static('public'));

console.log('My socket server is running')

// app.listen(3000, () => {
//     console.log('listening at local host 3000');
// });

function newConnection(socket) {
    console.log('new connection ' + socket.id);
    socket.on('message', burnMessage);
    function burnMessage(data) {
        console.log(data.message);
        if (data.message === "burn it down") {
            votesFor += 1;
        }
        if (data.message === "save that poor pumpkin") {
            votesAgainst += 1;
        }
        console.log(votesFor, votesAgainst);

        let voteData = {
            For: votesFor,
            Against: votesAgainst
        }
        io.sockets.emit('message', voteData);
    }
}