// Importa o Express para criar as rotas da API.
const express = require('express');

// Importa a conexão com o banco de dados SQLite.
const db = require('../database/sqlite');

// Cria um objeto de rotas do Express.
const router = express.Router();


// ==================== LOGIN ====================

// POST é usado para enviar dados ao servidor.
// Aqui, a rota recebe o e-mail e a senha do usuário.
router.post('/login', (req,res) => {
  // Pega os dados enviados pelo formulário.
  const {email, senha} = req.body;

  // Verifica se o usuário informou os dois campos.
  if (!email || !senha) return res.status(400).json({erro:'Preencha e-mail e senha.'});

  // Procura no banco um usuário com o e-mail e a senha informados.
  db.get('SELECT id,nome,email FROM usuarios WHERE email=? AND senha=?',[email,senha],(err,row)=>{
    // 500 = erro interno no servidor ou banco.
    if (err) return res.status(500).json({erro:err.message});

    // Se nenhum usuário for encontrado, o login é inválido.
    // 401 = usuário não autorizado.
    if (!row) return res.status(401).json({erro:'E-mail ou senha inválidos.'});

    // Envia os dados do usuário encontrado de volta para o navegador.
    res.json(row);
  });
});


// ==================== LISTAR PRODUTOS ====================

// GET é usado para buscar informações.
// Esta rota lista os produtos cadastrados.
router.get('/produtos',(req,res)=>{
  // Pega o texto digitado na busca.
  // Se não houver busca, usa uma string vazia.
  const busca = `%${req.query.busca || ''}%`;

  // Busca produtos cujo nome ou categoria contenha o texto pesquisado.
  // ORDER BY nome coloca os produtos em ordem alfabética.
  db.all('SELECT * FROM produtos WHERE nome LIKE ? OR categoria LIKE ? ORDER BY nome',[busca,busca],(err,rows)=>{
    // Se ocorrer erro no banco, retorna erro 500.
    if(err) return res.status(500).json({erro:err.message});

    // Envia a lista de produtos para o frontend.
    res.json(rows);
  });
});


// ==================== CADASTRAR PRODUTO ====================

// POST cria um novo produto no banco.
router.post('/produtos',(req,res)=>{
  // Pega os dados enviados pelo formulário.
  const {nome,categoria,quantidade,minimo}=req.body;

  // Valida os dados antes de tentar salvar.
  if(!nome || !categoria || quantidade < 0 || minimo < 0) return res.status(400).json({erro:'Preencha os dados corretamente.'});

  // INSERT adiciona o novo produto na tabela.
  db.run('INSERT INTO produtos(nome,categoria,quantidade,minimo) VALUES(?,?,?,?)',[nome,categoria,quantidade,minimo],function(err){
    // Trata erros, como tentar cadastrar um produto com nome repetido.
    if(err) return res.status(400).json({erro:err.message.includes('UNIQUE')?'Produto já cadastrado.':err.message});

    // Retorna uma mensagem e o ID criado pelo banco.
    res.json({mensagem:'Produto cadastrado.',id:this.lastID});
  });
});


// ==================== EDITAR PRODUTO ====================

// PUT é usado para atualizar informações existentes.
router.put('/produtos/:id',(req,res)=>{
  // Pega os novos dados enviados pelo frontend.
  const {nome,categoria,quantidade,minimo}=req.body;

  // Atualiza o produto que possui o ID informado na URL.
  db.run('UPDATE produtos SET nome=?,categoria=?,quantidade=?,minimo=? WHERE id=?',[nome,categoria,quantidade,minimo,req.params.id],function(err){
    // Retorna erro se o banco não conseguir fazer a atualização.
    if(err) return res.status(400).json({erro:err.message});

    // Informa que o produto foi atualizado.
    res.json({mensagem:'Produto atualizado.'});
  });
});


// ==================== EXCLUIR PRODUTO ====================

// DELETE é usado para remover um registro.
router.delete('/produtos/:id', (req,res)=>{
  // Remove do banco o produto que possui o ID informado na URL.
  db.run('DELETE FROM produtos WHERE id=?',[req.params.id],function(err){
    // Retorna erro caso a exclusão falhe.
    if(err) return res.status(400).json({erro:err.message});

    // Confirma que o produto foi excluído.
    res.json({mensagem:'Produto excluído.'});
  });
});


// ==================== MOVIMENTAÇÃO DE ESTOQUE ====================

// Registra uma entrada ou saída de produtos.
router.post('/movimentacoes',(req,res)=>{
  // Pega os dados enviados pelo formulário.
  const {produto_id,usuario_id,tipo,quantidade}=req.body;

  // Verifica se os dados da movimentação são válidos.
  // O tipo só pode ser "entrada" ou "saida".
  if(!produto_id || !usuario_id || !['entrada','saida'].includes(tipo) || quantidade<=0) return res.status(400).json({erro:'Dados da movimentação inválidos.'});

  // Procura o produto no banco pelo ID.
  db.get('SELECT * FROM produtos WHERE id=?',[produto_id],(err,p)=>{
    // Se o produto não existir, retorna erro 404.
    if(err || !p) return res.status(404).json({erro:'Produto não encontrado.'});

    // Calcula a nova quantidade:
    // entrada soma e saída diminui.
    const nova = tipo === 'entrada' ? p.quantidade + quantidade : p.quantidade - quantidade;

    // Impede que o estoque fique negativo.
    if(nova < 0) return res.status(400).json({erro:'Estoque insuficiente.'});

    // Atualiza a quantidade atual do produto.
    db.run('UPDATE produtos SET quantidade=? WHERE id=?',[nova,produto_id],(e)=>{
      // Se houver erro na atualização, retorna erro 500.
      if(e) return res.status(500).json({erro:e.message});

      // Registra a movimentação no histórico.
      db.run('INSERT INTO movimentacoes(produto_id,usuario_id,tipo,quantidade,data) VALUES(?,?,?,?,datetime("now","localtime"))',[produto_id,usuario_id,tipo,quantidade],(e2)=>{
        // Se não conseguir salvar o histórico, retorna erro 500.
        if(e2) return res.status(500).json({erro:e2.message});

        // Retorna o resultado da movimentação.
        // Também avisa se o estoque chegou ao mínimo.
        res.json({mensagem:'Movimentação registrada.',estoque_atual:nova,alerta:nova<=p.minimo?'Atenção: estoque mínimo atingido.':''});
      });
    });
  });
});


// ==================== HISTÓRICO ====================

// GET busca todas as movimentações registradas.
router.get('/movimentacoes',(req,res)=>{
  // JOIN junta movimentações com os dados do produto e do usuário.
  // ORDER BY m.id DESC mostra as movimentações mais recentes primeiro.
  db.all(`SELECT m.*,p.nome produto,u.nome usuario FROM movimentacoes m JOIN produtos p ON p.id=m.produto_id JOIN usuarios u ON u.id=m.usuario_id ORDER BY m.id DESC`,(err,rows)=>{
    // Retorna erro caso a consulta falhe.
    if(err) return res.status(500).json({erro:err.message});

    // Envia o histórico para o frontend.
    res.json(rows);
  });
});


// Exporta as rotas para que o arquivo principal do servidor possa utilizá-las.
module.exports = router;
