const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, '../../almoxarifado.db'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL, email TEXT UNIQUE NOT NULL, senha TEXT NOT NULL)`);
  db.run(`CREATE TABLE IF NOT EXISTS produtos (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT UNIQUE NOT NULL, categoria TEXT NOT NULL, quantidade INTEGER NOT NULL DEFAULT 0, minimo INTEGER NOT NULL DEFAULT 0)`);
  db.run(`CREATE TABLE IF NOT EXISTS movimentacoes (id INTEGER PRIMARY KEY AUTOINCREMENT, produto_id INTEGER NOT NULL, usuario_id INTEGER NOT NULL, tipo TEXT NOT NULL, quantidade INTEGER NOT NULL, data TEXT NOT NULL, FOREIGN KEY(produto_id) REFERENCES produtos(id), FOREIGN KEY(usuario_id) REFERENCES usuarios(id))`);
  db.run(`INSERT OR IGNORE INTO usuarios (nome,email,senha) VALUES ('Administrador','admin@teste.com','123456')`);
});

module.exports = db;
