const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const MongoClient = require('mongodb').MongoClient;

const app = express();
app.use(bodyParser.json());

const url = 'mongodb://localhost:27017';
const dbName = 'myproject';
let db;

MongoClient.connect(url, function(err, client) {
    if (err) throw err;
    console.log("Connected successfully to server");
    db = client.db(dbName);
});

app.post('/signup', async (req, res) => {
    const { userId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    db.collection('users').insertOne({ userId, password: hashedPassword }, (err, result) => {
        if (err) throw err;
        res.send('User created successfully!');
    });
});

app.post('/login', async (req, res) => {
    const { userId, password } = req.body;
    db.collection('users').findOne({ userId }, async (err, user) => {
        if (err) throw err;
        if (!user) {
            res.status(401).send('Invalid user ID or password');
            return;
        }
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            res.send('Logged in successfully!');
        } else {
            res.status(401).send('Invalid user ID or password');
        }
    });
});

app.listen(8080, () => {
    console.log('Server listening on port 8080');
});
const path = require('path');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
MongoClient.connect(url, function(err, client) {
    console.log('MongoClient.connect callback called');
    if (err) {
        console.error(err);
        throw err;
    }
    console.log("Connected successfully to server");
    db = client.db(dbName);
    console.log('db:', db);
});