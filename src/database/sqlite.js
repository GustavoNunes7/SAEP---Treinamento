// Importa o SQLite para criar e acessar o banco de dados.
const sqlite3 = require('sqlite3').verbose();

// Path é usado para montar o caminho do arquivo do banco.
const path = require('path');

// Abre o banco SQLite que fica na raiz do projeto.
const db = new sqlite3.Database(
  path.join(__dirname, '../../almoxarifado.db')
);

// Executa várias operações no banco em sequência.
db.serialize(() => {
  // Cria a tabela de usuários caso ela ainda não exista.
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL, email TEXT UNIQUE NOT NULL, senha TEXT NOT NULL)`);

  // Cria a tabela de produtos caso ela ainda não exista.
  db.run(`CREATE TABLE IF NOT EXISTS produtos (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT UNIQUE NOT NULL, categoria TEXT NOT NULL, quantidade INTEGER NOT NULL DEFAULT 0, minimo INTEGER NOT NULL DEFAULT 0)`);

  // Cria a tabela de movimentações e relaciona produto e usuário.
  db.run(`CREATE TABLE IF NOT EXISTS movimentacoes (id INTEGER PRIMARY KEY AUTOINCREMENT, produto_id INTEGER NOT NULL, usuario_id INTEGER NOT NULL, tipo TEXT NOT NULL, quantidade INTEGER NOT NULL, data TEXT NOT NULL, FOREIGN KEY(produto_id) REFERENCES produtos(id), FOREIGN KEY(usuario_id) REFERENCES usuarios(id))`);

  // Cria um usuário de teste se ele ainda não existir.
  db.run(`INSERT OR IGNORE INTO usuarios (nome,email,senha) VALUES ('Administrador','admin@teste.com','123456')`);
});

// Exporta o banco para que outros arquivos possam executar SQL.
module.exports = db;
