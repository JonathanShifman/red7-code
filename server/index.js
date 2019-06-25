const express = require('express');
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const secretKey = 'secretkey';

const roomPlayers = [];
const sockets = [];
let diskData;
fs.readFile('data.json', (err, data) => {
    diskData = JSON.parse(data);
});

app.use(cors());
app.use(bodyParser.json());
app.get('/room-players/', (req, res) => res.json(roomPlayers));
app.post('/register/', (req, res) => register(req, res));
app.post('/enter-game/', (req, res) => enterGame(req, res));
app.post('/leave-game/', (req, res) => leaveGame(req, res));

io.on('connection', function(socket){
    console.log('A user connected');
    sockets.push(socket);

    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });

    socket.on('auth',  storageData => {
        // console.log(storageData);
    });

    socket.emit('room-players', roomPlayers);
});

const port = 5000;
http.listen(port, () => console.log(`Example app listening on port ${port}!`));

function register(req, res) {
    const object = {
        id: diskData['nextId'],
        name: req.body.name
    };

    diskData['nextId'] = diskData['nextId'] + 1;
    fs.writeFile('data.json', JSON.stringify(diskData), () => {});

    const responseObject = {
        id: object.id,
        name: object.name,
        token: jwt.sign(object, secretKey)
    };
    res.json(responseObject);
}

function enterGame(req, res) {
    console.log("Got enter game message");
    const userInfo = jwt.decode(req.body.token);
    console.log('Attempting to add room player');

    if (roomPlayers.length >= 4) {
        console.log('Room is full');
    } else {
        let shouldAddPlayer = true;
        for (let roomPlayer of roomPlayers) {
            if (roomPlayer.id === userInfo.id) {
                console.log('The player is already in the room');
                shouldAddPlayer = false;
                break;
            }
        }
        if (shouldAddPlayer) {
            roomPlayers.push(userInfo);
            for (const socket of sockets) {
                socket.emit('room-players', roomPlayers);
            }
        }
    }
    res.json({});
}

function leaveGame(req, res) {
    const userInfo = jwt.decode(req.body.token);
    console.log('Attempting to remove room player');

    let playerToRemoveIndex = -1;
    for (let index = 0; index < roomPlayers.length; index++) {
        const roomPlayer = roomPlayers[index];
        if (roomPlayer.id === userInfo.id) {
            playerToRemoveIndex = index;
        }
    }
    if (playerToRemoveIndex >= 0) {
        console.log('Removing player');
        roomPlayers.splice(playerToRemoveIndex, 1)
        for (const socket of sockets) {
            socket.emit('room-players', roomPlayers);
        }
    } else {
        console.log('Player not found');
    }
    res.json({});
}

function setReady(req, res) {
    const object = {
        id: 1,
        name: req.body.name
    };
    const responseObject = {
        name: req.body.name,
        token: jwt.sign(object, secretKey)
    };
    res.json(responseObject);
}