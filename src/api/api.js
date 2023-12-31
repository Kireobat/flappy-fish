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
        const {name, score} = req.body;

        if (!name) {
            return res.status(400).send('Missing name');
        }

        if (name.length > 3) {
            return res.status(400).send('Name must be no more than 3 characters long');
        }

        if (!score) {
            return res.status(400).send('Missing score');
        }

        if (score < 0) {
            return res.status(400).send('Score must be a positive number');
        }

        let stmt = db.prepare('SELECT id FROM users WHERE name = ?;');

        const userExists = stmt.get(name);

        if (userExists) {

            stmt = db.prepare('SELECT score FROM scores WHERE user_id = ?;');

            const userScore = stmt.get(userExists.id);

            if (userScore.score >= score) {
                return res.status(200);
            } else if (userScore.score < score) {

                console.log("UPDATING SCORE TO " + score + " FOR USER " + userExists.id)

                stmt = db.prepare('UPDATE scores SET score = ? WHERE user_id = ?;');

                stmt.run(score, userExists.id);

                return res.status(200);
            }

        }

            


        


        stmt = db.prepare('INSERT INTO users (name) VALUES (?);');

        stmt.run(name);

        const user = db.prepare('SELECT id FROM users WHERE name = ?;').get(name);

        console.log("INSERTING SCORE " + score + " FOR USER " + user.id)

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