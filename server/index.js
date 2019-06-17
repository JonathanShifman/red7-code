const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const lobbyPlayers = [];
const sockets = [];

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
        console.log(storageData);
    });
});

const port = 5000;
http.listen(port, () => console.log(`Example app listening on port ${port}!`));

function register(req, res) {
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

function enterGame(req, res) {
    const userInfo = jwt.decode(req.body.token);
    lobbyPlayers.push(userInfo.name);
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