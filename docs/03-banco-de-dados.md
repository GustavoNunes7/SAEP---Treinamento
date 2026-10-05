# Entrega 3 — Script de Criação e População do Banco de Dados

## Banco utilizado

O projeto utiliza **SQLite**, por meio do pacote `sqlite3`. A aplicação abre o arquivo `almoxarifado.db` e cria as tabelas necessárias quando elas ainda não existem.

A aplicação utiliza três tabelas: `usuarios`, `produtos` e `movimentacoes`. A estrutura também está disponível no arquivo `schema.sql` na raiz do repositório. fileciteturn2file0L2-L5

## Estrutura

### Tabela `usuarios`

| Campo | Tipo | Restrições |
|---|---|---|
| id | INTEGER | PK, AUTOINCREMENT |
| nome | TEXT | NOT NULL |
| email | TEXT | UNIQUE, NOT NULL |
| senha | TEXT | NOT NULL |

### Tabela `produtos`

| Campo | Tipo | Restrições |
|---|---|---|
| id | INTEGER | PK, AUTOINCREMENT |
| nome | TEXT | UNIQUE, NOT NULL |
| categoria | TEXT | NOT NULL |
| quantidade | INTEGER | NOT NULL, DEFAULT 0 |
| minimo | INTEGER | NOT NULL, DEFAULT 0 |

### Tabela `movimentacoes`

| Campo | Tipo | Restrições |
|---|---|---|
| id | INTEGER | PK, AUTOINCREMENT |
| produto_id | INTEGER | NOT NULL, FK |
| usuario_id | INTEGER | NOT NULL, FK |
| tipo | TEXT | NOT NULL |
| quantidade | INTEGER | NOT NULL |
| data | TEXT | NOT NULL |

## População inicial

A inicialização do banco cadastra um usuário administrativo padrão caso ele ainda não exista:

- Nome: `Administrador`
- E-mail: `admin@teste.com`
- Senha: `123456`

Esse registro é criado com `INSERT OR IGNORE`, portanto não é duplicado em novas inicializações. A lógica está implementada em `src/database/sqlite.js`. fileciteturn8file0L2-L6

## Script oficial

O arquivo `schema.sql` contém o script de criação das tabelas do banco. fileciteturn2file0L2-L5

Para executar a estrutura manualmente em um ambiente SQLite, utilize o conteúdo de `schema.sql`.

> Observação: o arquivo `almoxarifado.db` também está presente na raiz do repositório e representa a base SQLite utilizada pela aplicação.
