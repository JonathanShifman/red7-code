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
const socketsMap = {};
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
            id: i,
            capacity: 2,
            enteredPlayers: [],
            seatedPlayers: []
        });
    }
}

let diskData;
fs.readFile('data.json', (err, data) => {
    diskData = JSON.parse(data);
});

app.use(cors());
app.use(bodyParser.json());
app.post('/status/', (req, res) => getStatus(req, res));
app.post('/login/', (req, res) => login(req, res));
app.post('/register/', (req, res) => register(req, res));
app.post('/enter-room/', (req, res) => enterRoom(req, res));
app.post('/exit-room/', (req, res) => exitRoom(req, res));
app.post('/sit-down/', (req, res) => sitDown(req, res));
app.post('/stand-up/', (req, res) => standUp(req, res));

io.on('connection', function(socket){
    console.log('A user connected');

    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });

    socket.on('auth',  token => {
        console.log('Got auth');
        const userInfo = jwt.decode(token);
        if (userInfo == null) {
            console.log('Unauthorized');
        } else {
            let userId = userInfo.id.toString();
            if (userMap[userId] == null) {
                console.log("User not in map");
            } else {
                let userInfo = userMap[userId];
                if (socketsMap[userId] == null) {
                    socketsMap[userId] = [];
                }
                socketsMap[userId].push(socket);
                console.log(socketsMap[userId].length);
                emitRoomPlayers(userInfo.gameId, userInfo.roomId);
            }
        }
    });

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
            let room = gameMap[gameId].rooms[roomId - 1];
            room.enteredPlayers.push(userId);
        }
    }

    let status = generateStatus(userInfo);
    res.json(status);
}


function exitRoom(req, res) {
    console.log("Got exit room message");
    const userInfo = jwt.decode(req.body.token);
    if (userInfo == null) {
        console.log('Unauthorized');
    } else {
        let userId = userInfo.id.toString();
        if (userMap[userId] == null) {
            console.log("User not in map");
        } else {
            let gameId = userMap[userId].gameId;
            let roomId = userMap[userId].roomId;
            let room = gameMap[gameId].rooms[roomId - 1];
            let index = 0;
            let indexToSplice = -1;
            for (let playerId of room.enteredPlayers) {
                if (playerId == userId) {
                    indexToSplice = index;
                    break;
                }
            }
            if (indexToSplice >= 0) {
                room.enteredPlayers.splice(indexToSplice, 1);
            }
            index = 0;
            indexToSplice = -1;
            for (let playerId of room.seatedPlayers) {
                if (playerId == userId) {
                    indexToSplice = index;
                    break;
                }
            }
            if (indexToSplice >= 0) {
                room.seatedPlayers.splice(indexToSplice, 1);
                emitRoomPlayers(gameId, roomId);
            }
            userMap[userId] = null;
        }
    }

    let status = generateStatus(userInfo);
    res.json(status);
}


function sitDown(req, res) {
    console.log("Got sit down message");
    const userInfo = jwt.decode(req.body.token);
    if (userInfo == null) {
        console.log('Unauthorized');
    } else {
        let userId = userInfo.id.toString();
        if (userMap[userId] == null) {
            console.log("User not in map");
        } else {
            let userInfo = userMap[userId];
            let room = gameMap[userInfo.gameId].rooms[userInfo.roomId - 1];
            let alreadySitting = false;
            for (let player of room.seatedPlayers) {
                if(player === userId) {
                    alreadySitting = true;
                    break;
                }
            }

            if (!alreadySitting && room.seatedPlayers.length < room.capacity) {
                room.seatedPlayers.push(userId);
                emitRoomPlayers(userInfo.gameId, userInfo.roomId);
            }
        }
    }

    let status = generateStatus(userInfo);
    res.json(status);

}


function standUp(req, res) {
    console.log("Got stand up message");
    const userInfo = jwt.decode(req.body.token);
    if (userInfo == null) {
        console.log('Unauthorized');
    } else {
        let userId = userInfo.id.toString();
        if (userMap[userId] == null) {
            console.log("User not in map");
        } else {
            let userInfo = userMap[userId];
            let room = gameMap[userInfo.gameId].rooms[userInfo.roomId - 1];
            let alreadySitting = false;
            let index = 0;
            for (let player of room.seatedPlayers) {
                if(player === userId) {
                    alreadySitting = true;
                    break;
                }
                index++;
            }

            if (alreadySitting) {
                console.log("Standing up");
                room.seatedPlayers.splice(index, 1);
                emitRoomPlayers(userInfo.gameId, userInfo.roomId);
            }
        }
    }

    let status = generateStatus(userInfo);
    res.json(status);
}

function emitRoomPlayers(gameId, roomId) {
    let room = gameMap[gameId].rooms[roomId - 1];
    for (let playerId of room.enteredPlayers) {
        for (let socket of socketsMap[playerId]) {
            socket.emit('room-players', room.seatedPlayers);
        }
    }
}
