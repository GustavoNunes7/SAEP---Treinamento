const express = require('express');
const db = require('../database/sqlite');
const router = express.Router();

router.post('/login', (req,res) => {
  const {email, senha} = req.body;
  if (!email || !senha) return res.status(400).json({erro:'Preencha e-mail e senha.'});
  db.get('SELECT id,nome,email FROM usuarios WHERE email=? AND senha=?',[email,senha],(err,row)=>{
    if (err) return res.status(500).json({erro:err.message});
    if (!row) return res.status(401).json({erro:'E-mail ou senha inválidos.'});
    res.json(row);
  });
});

router.get('/produtos',(req,res)=>{
  const busca = `%${req.query.busca || ''}%`;
  db.all('SELECT * FROM produtos WHERE nome LIKE ? OR categoria LIKE ? ORDER BY nome',[busca,busca],(err,rows)=>{
    if(err) return res.status(500).json({erro:err.message});
    res.json(rows);
  });
});

router.post('/produtos',(req,res)=>{
  const {nome,categoria,quantidade,minimo}=req.body;
  if(!nome || !categoria || quantidade < 0 || minimo < 0) return res.status(400).json({erro:'Preencha os dados corretamente.'});
  db.run('INSERT INTO produtos(nome,categoria,quantidade,minimo) VALUES(?,?,?,?)',[nome,categoria,quantidade,minimo],function(err){
    if(err) return res.status(400).json({erro:err.message.includes('UNIQUE')?'Produto já cadastrado.':err.message});
    res.json({mensagem:'Produto cadastrado.',id:this.lastID});
  });
});

router.put('/produtos/:id',(req,res)=>{
  const {nome,categoria,quantidade,minimo}=req.body;
  db.run('UPDATE produtos SET nome=?,categoria=?,quantidade=?,minimo=? WHERE id=?',[nome,categoria,quantidade,minimo,req.params.id],function(err){
    if(err) return res.status(400).json({erro:err.message});
    res.json({mensagem:'Produto atualizado.'});
  });
});

router.delete('/produtos/:id',(req,res)=>{
  db.run('DELETE FROM produtos WHERE id=?',[req.params.id],function(err){
    if(err) return res.status(400).json({erro:err.message});
    res.json({mensagem:'Produto excluído.'});
  });
});

router.post('/movimentacoes',(req,res)=>{
  const {produto_id,usuario_id,tipo,quantidade}=req.body;
  if(!produto_id || !usuario_id || !['entrada','saida'].includes(tipo) || quantidade<=0) return res.status(400).json({erro:'Dados da movimentação inválidos.'});
  db.get('SELECT * FROM produtos WHERE id=?',[produto_id],(err,p)=>{
    if(err || !p) return res.status(404).json({erro:'Produto não encontrado.'});
    const nova = tipo === 'entrada' ? p.quantidade + quantidade : p.quantidade - quantidade;
    if(nova < 0) return res.status(400).json({erro:'Estoque insuficiente.'});
    db.run('UPDATE produtos SET quantidade=? WHERE id=?',[nova,produto_id],(e)=>{
      if(e) return res.status(500).json({erro:e.message});
      db.run('INSERT INTO movimentacoes(produto_id,usuario_id,tipo,quantidade,data) VALUES(?,?,?,?,datetime("now","localtime"))',[produto_id,usuario_id,tipo,quantidade],(e2)=>{
        if(e2) return res.status(500).json({erro:e2.message});
        res.json({mensagem:'Movimentação registrada.',estoque_atual:nova,alerta:nova<=p.minimo?'Atenção: estoque mínimo atingido.':''});
      });
    });
  });
});

router.get('/movimentacoes',(req,res)=>{
  db.all(`SELECT m.*,p.nome produto,u.nome usuario FROM movimentacoes m JOIN produtos p ON p.id=m.produto_id JOIN usuarios u ON u.id=m.usuario_id ORDER BY m.id DESC`,(err,rows)=>{
    if(err) return res.status(500).json({erro:err.message});
    res.json(rows);
  });
});

module.exports = router;
