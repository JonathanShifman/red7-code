const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();

const players = [];

app.use(cors());
app.use(bodyParser.json());
app.post('/register/', (req, res) => register(req, res));
app.post('/enter-game/', (req, res) => enterGame(req, res));

const port = 5000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

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
    console.log(jwt.decode(req.body.token));
    res.json({});
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