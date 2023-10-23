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

app.post('/api/createUser', (req, res) => {
    try {

        console.log(req.body);

        const {name} = req.body;

        console.log(name);

        if (!name) {
            return res.status(400).send('Missing name');
        }

        if (name.length > 3) {
            return res.status(400).send('Name must be no more than 3 characters long');
        }

        const stmt = db.prepare('INSERT INTO users (name) VALUES (?);');

        const info = stmt.run(name);

        return res.status(200).send(info);
    } catch (error) {
        return res.status(500).send(error.message);
    }
    

});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    });