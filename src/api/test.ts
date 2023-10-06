import Database from 'better-sqlite3'

const db = new Database('src/lib/data/exam.db')

export const deleteUser = () => {

    const createTable = db.prepare('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, password TEXT)')

    alert("User is deleted ")
}