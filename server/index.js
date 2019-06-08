const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 5000;


app.post('/register/', (req, res) => register(req, res));

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