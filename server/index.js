const express = require('express');
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const lobbyPlayers = [];
const sockets = [];
let diskData;
fs.readFile('data.json', (err, data) => {
    diskData = JSON.parse(data);
});

app.use(cors());
app.use(bodyParser.json());
app.get('/lobby-players/', (req, res) => res.json(lobbyPlayers));
app.post('/register/', (req, res) => register(req, res));
app.post('/enter-game/', (req, res) => enterGame(req, res));

io.on('connection', function(socket){
    console.log('a user connected');
    sockets.push(socket);

    socket.on('disconnect', function () {
        console.log('a user disconnected');
    });

    socket.on('auth',  storageData => {
        // console.log(storageData);
    });

    socket.emit('lobby-players', lobbyPlayers);
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
        name: req.body.name,
        token: jwt.sign(object, 'secretkey')
    };
    res.json(responseObject);
}

function enterGame(req, res) {
    const userInfo = jwt.decode(req.body.token);
    console.log('Attempting to add lobby player');

    if (lobbyPlayers.length >= 4) {
        console.log('Lobby is full');
        res.status(200);
        return;
    }
    for (let lobbyPlayer of lobbyPlayers) {
        if (lobbyPlayer.id === userInfo.id) {
            console.log('The player is already in the lobby');
            res.status(200);
            return;
        }
    }
    lobbyPlayers.push(userInfo);
    for (const socket of sockets) {
        socket.emit('lobby-players', lobbyPlayers);
    }
    res.status(200);
}

function setReady(req, res) {
    const object = {
        id: 1,
        name: req.body.name
    };
    const responseObject = {
        name: req.body.name,
        token: jwt.sign(object, 'secretkey')
    };
    res.json(responseObject);
}