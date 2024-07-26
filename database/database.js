const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../contacts.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    db.run('CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, number TEXT, email TEXT, group_name TEXT)', (err) => {
      if (err) {
        console.error('Error creating table', err);
      }
    });
  }
});

module.exports = db;
