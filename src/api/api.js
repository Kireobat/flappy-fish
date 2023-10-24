// Imports
import express from 'express';
import Database from 'better-sqlite3';

// Setup

const app = express();
const port = 3001;
const db = new Database('./src/data/db.sqlite');

// VERY IMPORTANT
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const setupSQL = 
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT);" +
    "CREATE TABLE IF NOT EXISTS scores (id INTEGER PRIMARY KEY, user_id INTEGER, score INTEGER, FOREIGN KEY(user_id) REFERENCES users(id));";

db.exec(setupSQL);

app.get('/api', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/data', (req, res) => {
    const data = {
        "name": "John Doe",
        "age": 30
    }

    res.send(data);
});

app.post('/api/saveScore', (req, res) => {
    try {

        console.log(req.body);

        const {name, score} = req.body;

        console.log(name);

        if (!name) {
            return res.status(400).send('Missing name');
        }

        if (name.length > 3) {
            return res.status(400).send('Name must be no more than 3 characters long');
        }

        let stmt = db.prepare('INSERT INTO users (name) VALUES (?);');

        stmt.run(name);

        const user = db.prepare('SELECT id FROM users WHERE name = ?;').get(name);

        stmt = db.prepare('INSERT INTO scores (user_id, score) VALUES (?, ?);');

        stmt.run(user.id, score);

        return res.status(200);
    } catch (error) {
        return res.status(500).send(error.message);
    }
    

});


app.get('/api/getScores', (req, res) => {
    const {amount} = req.query;

    if (!amount) {
        return res.status(400).send('Missing amount');
    }

    const scores = db.prepare('SELECT users.name, scores.score FROM users INNER JOIN scores ON users.id = scores.user_id ORDER BY scores.score DESC LIMIT ?;').all(amount);

    return res.status(200).send(scores);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    });