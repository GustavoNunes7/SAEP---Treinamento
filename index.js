const express = require('express');
const path = require('path');
const db = require('./src/database/sqlite');
const routes = require('./src/routes');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', routes);

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.listen(3000, () => console.log('Sistema aberto em http://localhost:3000'));
