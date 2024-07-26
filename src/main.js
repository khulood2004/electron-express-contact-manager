const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

// Configuración de Express
const expressApp = express();
expressApp.use(bodyParser.json());

const db = new sqlite3.Database(':memory:'); // Usar una base de datos en memoria para simplicidad

// Crear tabla de contactos en la base de datos
db.serialize(() => {
    db.run("CREATE TABLE contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, number TEXT, email TEXT, group_name TEXT)");
});

// Rutas de la API
expressApp.post('/addContact', (req, res) => {
    const { name, number, email, group } = req.body;
    db.run("INSERT INTO contacts (name, number, email, group_name) VALUES (?, ?, ?, ?)", [name, number, email, group], function(err) {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.send({ id: this.lastID });
    });
});

expressApp.get('/contacts', (req, res) => {
    db.all("SELECT * FROM contacts", [], (err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.send(rows);
    });
});

expressApp.post('/updateContact', (req, res) => {
    const { id, group } = req.body;
    db.run("UPDATE contacts SET group_name = ? WHERE id = ?", [group, id], function(err) {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.send({ changes: this.changes });
    });
});

expressApp.post('/removeContact', (req, res) => {
    const { id } = req.body;
    db.run("DELETE FROM contacts WHERE id = ?", [id], function(err) {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.send({ changes: this.changes });
    });
});

const port = 3000;
expressApp.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Función para crear la ventana de Electron
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile(path.join(__dirname, '../public/index.html'));

    // mainWindow.webContents.openDevTools(); // Puedes comentar esta línea si no necesitas DevTools

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Eventos de Electron
app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});







