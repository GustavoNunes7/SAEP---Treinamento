# Entrega 9 — Lista de Requisitos de Infraestrutura

## 1. Hardware mínimo recomendado

| Recurso | Requisito |
|---|---|
| Processador | CPU de 64 bits, 2 núcleos ou superior |
| Memória RAM | 4 GB mínimo; 8 GB recomendado |
| Armazenamento | Pelo menos 1 GB livre para aplicação, dependências e banco |
| Rede | Não é obrigatória para executar localmente após a instalação das dependências; necessária para instalar pacotes e clonar o repositório |
| Monitor | Resolução mínima recomendada de 1280 × 720 |
| Periféricos | Teclado e mouse |

## 2. Software

| Item | Requisito |
|---|---|
| Sistema operacional | Windows, Linux ou macOS com suporte ao Node.js |
| Node.js | Versão compatível com o projeto e com o `npm` |
| npm | Incluído na instalação do Node.js |
| Banco de dados | SQLite, utilizado pela dependência `sqlite3` |
| Navegador | Navegador moderno com suporte a JavaScript |
| Git | Recomendado para clonar e versionar o projeto |

## 3. Dependências do projeto

O `package.json` define o projeto como `sistema-gestao`, com script de inicialização `node index.js` e dependências `express` e `sqlite3`. fileciteturn3file0L2-L6

### Dependências principais

- **Express 4.21.2** — servidor web e API.
- **SQLite3 5.1.7** — acesso ao banco SQLite.

## 4. Porta de execução

A aplicação utiliza a porta **3000** por padrão. O servidor disponibiliza os arquivos estáticos da pasta `public` e registra as rotas da API sob o prefixo `/api`. fileciteturn4file0L2-L6

Acesso local:

```text
http://localhost:3000
```

## 5. Procedimento básico de instalação

1. Instalar o Node.js e o npm.
2. Clonar o repositório.
3. Abrir o terminal na pasta do projeto.
4. Instalar as dependências:

```bash
npm install
```

5. Iniciar o sistema:

```bash
npm start
```

6. Abrir `http://localhost:3000` em um navegador.

## 6. Banco de dados

O sistema utiliza o arquivo `almoxarifado.db` como banco SQLite. A conexão é criada pelo módulo `src/database/sqlite.js`, que também garante a criação das tabelas necessárias durante a inicialização. fileciteturn8file0L2-L6

## 7. Requisitos de ambiente

- Permissão para leitura e escrita na pasta do projeto, pois o SQLite precisa acessar o arquivo do banco.
- Porta 3000 disponível no computador local.
- Permissão para instalar as dependências npm.
- Navegador habilitado para JavaScript.

> Os requisitos acima são adequados para a execução local do projeto e podem ser ampliados caso o sistema seja posteriormente implantado em um servidor de produção.
