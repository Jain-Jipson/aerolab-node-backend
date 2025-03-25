// 🚀 Entry Point: server.js
const express = require('express');
const mongoose = require('mongoose');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const http = require('http');

// ✅ Load Environment Variables
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 5054;

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB (if used)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('✅ MongoDB Connected');

        // ✅ Log database and collections for debug
        const db = mongoose.connection.db;
        db.listCollections().toArray().then(collections => {
            console.log("📂 Using DB:", db.databaseName);
            console.log("📚 Collections:", collections.map(c => c.name));
        });
    })
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ✅ SQLite setup (if used)
const path = require('path');
const dbPath = path.join(__dirname, 'db.sqlite');

const sqliteDb = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) return console.error('❌ SQLite Error:', err.message);
  console.log('✅ SQLite Connected');
});

// ✅ Models
const Employee = require('./models/employee.model');
const AttendanceLog = require('./models/attendance.model');
const Faq = require('./models/faq.model');

// ✅ Routes
app.use('/api/employees', require('./routes/employee.routes'));
app.use('/api/attendancelogs', require('./routes/attendance.routes'));
app.use('/api/faqs', require('./routes/faq.routes'));

// ✅ WebSocket Setup
let webSocketClients = [];

wss.on('connection', function connection(ws) {
    console.log('🔗 WebSocket Client Connected!');
    webSocketClients.push(ws);

    ws.on('close', () => {
        console.log('❌ WebSocket Client Disconnected');
        webSocketClients = webSocketClients.filter(client => client !== ws);
    });
});

// ✅ Notify WebSocket Clients (example usage)
function notifyWebSockets(message) {
    webSocketClients.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(message);
        }
    });
}

app.get('/', (req, res) => {
    res.send('🌐 Aerolab API is running...');
});

// ✅ Swagger Setup can be added with swagger-ui-express if needed

server.listen(PORT, () => {
    console.log(`🚀 Server started at http://localhost:${PORT}`);
});