const express = require('express');
const app = express();
const port = 5000;

jwt = require('jsonwebtoken');

app.get('/', (req, res) => func(req, res));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

function func(req, res) {
    const object = {
        id: 1,
        name: 'Jonathan'
    };
    const sig = jwt.sign(object, '123456');
    res.send(sig);
}