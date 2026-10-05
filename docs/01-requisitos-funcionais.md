# Entrega 1 — Lista de Requisitos Funcionais

## Sistema de Estoque / Almoxarifado

### Objetivo
O sistema tem como objetivo controlar produtos de um estoque, permitindo autenticação de usuários, cadastro e manutenção de produtos, registro de entradas e saídas e consulta do histórico de movimentações.

## Requisitos funcionais

| ID | Requisito | Descrição |
|---|---|---|
| RF01 | Autenticação | O sistema deve permitir que o usuário informe e-mail e senha para acessar o sistema. |
| RF02 | Validação de login | O sistema deve informar erro quando e-mail ou senha não forem preenchidos ou forem inválidos. |
| RF03 | Listagem de produtos | O sistema deve exibir os produtos cadastrados no estoque. |
| RF04 | Pesquisa de produtos | O sistema deve permitir pesquisar produtos por nome ou categoria. |
| RF05 | Cadastro de produto | O sistema deve permitir cadastrar produto com nome, categoria, quantidade inicial e estoque mínimo. |
| RF06 | Validação de cadastro | O sistema deve impedir cadastro com dados obrigatórios ausentes ou valores negativos de quantidade/estoque mínimo. |
| RF07 | Unicidade de produto | O sistema não deve permitir dois produtos com o mesmo nome. |
| RF08 | Alteração de produto | O sistema deve permitir atualizar os dados de um produto cadastrado. |
| RF09 | Exclusão de produto | O sistema deve permitir excluir um produto pelo seu identificador. |
| RF10 | Registro de entrada | O sistema deve permitir registrar uma entrada de quantidade para um produto. |
| RF11 | Registro de saída | O sistema deve permitir registrar uma saída de quantidade para um produto. |
| RF12 | Validação de movimentação | O sistema deve rejeitar movimentações sem produto/usuário, com tipo inválido ou quantidade não positiva. |
| RF13 | Controle de estoque | O sistema deve atualizar a quantidade disponível após cada entrada ou saída. |
| RF14 | Controle de saldo | O sistema deve impedir uma saída que resulte em estoque negativo. |
| RF15 | Alerta de estoque mínimo | O sistema deve informar quando a quantidade atual atingir ou ficar abaixo do estoque mínimo. |
| RF16 | Histórico de movimentações | O sistema deve permitir consultar as movimentações realizadas, mostrando produto, usuário, tipo, quantidade e data. |
| RF17 | Persistência | Os usuários, produtos e movimentações devem ser armazenados em banco de dados SQLite. |

## Regras de negócio principais

- O nome do produto deve ser único.
- A quantidade de uma movimentação deve ser maior que zero.
- Os tipos de movimentação aceitos são `entrada` e `saida`.
- Uma saída não pode deixar o estoque abaixo de zero.
- Ao atingir ou ficar abaixo do estoque mínimo, o sistema deve apresentar um alerta.

Os requisitos foram definidos com base na implementação atual do projeto, que utiliza rotas de login, produtos e movimentações e banco SQLite. 
