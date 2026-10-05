-- Cria a tabela de usuários do sistema.
CREATE TABLE
    usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT, -- Identificador único.
        nome TEXT NOT NULL,                   -- Nome do usuário.
        email TEXT UNIQUE NOT NULL,           -- E-mail único usado no login.
        senha TEXT NOT NULL                   -- Senha do usuário.
    );

-- Cria a tabela que guarda os produtos do estoque.
CREATE TABLE
    produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT, -- Identificador único.
        nome TEXT UNIQUE NOT NULL,            -- Nome do produto.
        categoria TEXT NOT NULL,              -- Categoria do produto.
        quantidade INTEGER NOT NULL DEFAULT 0, -- Quantidade atual no estoque.
        minimo INTEGER NOT NULL DEFAULT 0      -- Quantidade mínima permitida.
    );

-- Registra cada entrada ou saída de produto.
CREATE TABLE
    movimentacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT, -- Identificador da movimentação.
        produto_id INTEGER NOT NULL,          -- Produto movimentado.
        usuario_id INTEGER NOT NULL,          -- Usuário responsável.
        tipo TEXT NOT NULL,                   -- Entrada ou saída.
        quantidade INTEGER NOT NULL,          -- Quantidade movimentada.
        data TEXT NOT NULL                    -- Data e hora da movimentação.
    );
