const express = require('express');
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const secretKey = 'secretkey';

const games = [
    {
        id: '1',
        name: 'Chess'
    }
];

const userMap = {};
const gameMap = {};
const numOfRooms = 10;
for (let game of games) {
    gameMap[game.id] = {
        id: game.id,
        name: game.name,
        rooms: []
    };
    for (let i = 1; i <= numOfRooms; i++) {
        gameMap[game.id].rooms.push({
            'id': i,
            'taken': 0,
            'capacity': 2
        });
    }
}

const rooms = [
    {
        'id': 1,
        'taken': 3,
        'capacity': 4
    },
    {
        'id': 2,
        'taken': 4,
        'capacity': 4
    },
    {
        'id': 3,
        'taken': 1,
        'capacity': 4
    }
];
const roomPlayers = [];
const sockets = [];
let diskData;
fs.readFile('data.json', (err, data) => {
    diskData = JSON.parse(data);
});

app.use(cors());
app.use(bodyParser.json());
app.get('/roomIds/', (req, res) => getRoomIds(req, res));
app.post('/status/', (req, res) => getStatus(req, res));
app.post('/login/', (req, res) => login(req, res));
app.post('/register/', (req, res) => register(req, res));
app.get('/room-players/', (req, res) => res.json(roomPlayers));
app.post('/enter-room/', (req, res) => enterRoom(req, res));
app.post('/enter-lobby/', (req, res) => enterGame(req, res));
app.post('/leave-lobby/', (req, res) => leaveGame(req, res));
app.get('/rooms/', (req, res) => getRooms(req, res));

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

function getStatus(req, res) {
    let userInfo = jwt.decode(req.body.token);
    let status = generateStatus(userInfo);
    res.json(status);
}

function generateStatus(userInfo) {
    let status;
    if (userInfo == null) {
        status = {
            'status': 0
        };
    } else {
        let userId = userInfo.id.toString();
        if (userMap[userId] == null) {
            status = {
                'status': 1,
                'games': gameMap
            };
        } else {
            status = {
                'status': 2,
                'roomInfo': userMap[userId]
            };
        }
    }
    return status;
}

function getRoomIds(req, res) {
    const roomIds = [];
    let roomIndex = 0;
    while (roomIndex < rooms.length) {
        if (rooms[roomIndex] != null) {
            roomIds.push(roomIndex + 1);
        }
        roomIndex++;
    }
    res.json({'roomIds': roomIds});
}

function login(req, res) {
    fs.readFile('users.json', (err, data) => {
        let users = JSON.parse(data);
        let token = null;
        for (let user of users) {
            if (user.name === req.body.name && user.password === req.body.password) {
                let userObject = {id: user.id};
                token = jwt.sign(userObject, secretKey);
                break;
            }
        }
        if (token != null) {
            res.json({
                success: true,
                token: token
            });
        }
        else {
            res.json({
                success: false,
                message: 'Unregistered user'
            });
        }
    });
}

function register(req, res) {
    fs.readFile('users.json', (err, data) => {
        let users = JSON.parse(data);
        let found = false;
        for (let user of users) {
            if (user.name === req.body.name) {
                found = true;
                break;
            }
        }
        if (!found) {
            let newId;
            if (users.length > 0) {
                newId = users[users.length - 1].id + 1;
            } else {
                newId = 1;
            }
            let userObject = {id: newId};
            let token = jwt.sign(userObject, secretKey);
            let userToSave = {
                id: newId,
                name: req.body.name,
                password: req.body.password
            };
            users.push(userToSave);
            fs.writeFile('users.json', JSON.stringify(users), () => {
                res.json({
                    success: true,
                    token: token
                });
            });
        }
        else {
            res.json({
                success: false,
                message: 'A user with the specified name already exists'
            });
        }
    });
}


function enterRoom(req, res) {
    console.log("Got enter room message");
    const userInfo = jwt.decode(req.body.token);
    if (userInfo == null) {
        console.log('Unauthorized');
    } else {
        let gameId = req.body.gameId;
        let roomId = req.body.roomId;
        let userId = userInfo.id.toString();
        if (userMap[userId] != null) {
            console.log("User already in map");
        } else {
            userMap[userId] = {
                gameId: gameId,
                roomId: roomId
            };
        }
    }

    let status = generateStatus(userInfo);
    res.json(status);
}


function enterGame(req, res) {
    console.log("Got enter lobby message");
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
        roomPlayers.splice(playerToRemoveIndex, 1);
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

function getRooms(req, res) {
    res.json(rooms);
}