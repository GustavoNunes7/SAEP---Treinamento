// Express cria e controla o servidor da aplicação.
const express = require('express');

// Path ajuda a montar caminhos de arquivos de forma segura.
const path = require('path');

// Importa a conexão com o banco SQLite.
const db = require('./src/database/sqlite');

// Importa as rotas da API.
const routes = require('./src/routes');

// Cria o servidor Express.
const app = express();

// Permite que o servidor receba dados em JSON.
app.use(express.json());

// Permite acessar os arquivos HTML, CSS e JavaScript da pasta public.
app.use(express.static(path.join(__dirname, 'public')));

// Tudo que começar com /api será enviado para as rotas da API.
app.use('/api', routes);

// Se a página não for uma rota da API, abre o index.html.
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
);

// Inicia o servidor na porta 3000.
app.listen(3000, () =>
  console.log('Sistema aberto em http://localhost:3000')
);
