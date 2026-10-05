# Entrega 8 — Descritivo de Casos de Teste de Software

## Objetivo

Validar as principais funcionalidades do sistema de estoque, incluindo autenticação, cadastro e manutenção de produtos, movimentações e consultas.

## Casos de teste

| ID | Funcionalidade | Pré-condição | Procedimento | Resultado esperado |
|---|---|---|---|---|
| CT01 | Login válido | Usuário cadastrado | Informar `admin@teste.com` e a senha cadastrada | Usuário é autenticado e o acesso ao sistema é liberado. |
| CT02 | Login sem dados | Tela de login aberta | Enviar o formulário sem e-mail ou senha | Sistema informa que e-mail e senha devem ser preenchidos. |
| CT03 | Login inválido | Tela de login aberta | Informar credenciais incorretas | Sistema retorna mensagem de e-mail ou senha inválidos. |
| CT04 | Listagem de produtos | Usuário autenticado | Acessar a listagem de produtos | Sistema retorna os produtos cadastrados. |
| CT05 | Pesquisa de produto | Existir produto cadastrado | Pesquisar por nome ou categoria | Sistema retorna produtos compatíveis com a busca. |
| CT06 | Cadastro válido | Usuário autenticado | Informar nome, categoria, quantidade e mínimo válidos | Produto é cadastrado e recebe um identificador. |
| CT07 | Cadastro com valores inválidos | Tela de cadastro disponível | Informar quantidade ou mínimo negativo | Sistema rejeita o cadastro e informa erro. |
| CT08 | Produto duplicado | Já existir produto com o mesmo nome | Cadastrar outro produto com o mesmo nome | Sistema rejeita o cadastro por duplicidade. |
| CT09 | Alteração de produto | Existir produto cadastrado | Alterar dados de um produto | Sistema atualiza o registro. |
| CT10 | Exclusão de produto | Existir produto cadastrado | Solicitar exclusão pelo ID | Sistema exclui o produto. |
| CT11 | Entrada de estoque | Produto e usuário existentes | Registrar movimentação do tipo `entrada` | Quantidade do estoque aumenta e movimentação é registrada. |
| CT12 | Saída de estoque | Produto com saldo suficiente | Registrar movimentação do tipo `saida` | Quantidade do estoque diminui e movimentação é registrada. |
| CT13 | Saída acima do estoque | Produto com saldo insuficiente | Registrar saída maior que o saldo disponível | Sistema rejeita a operação e informa estoque insuficiente. |
| CT14 | Tipo de movimentação inválido | Produto e usuário existentes | Enviar tipo diferente de `entrada` ou `saida` | Sistema rejeita a movimentação. |
| CT15 | Quantidade inválida na movimentação | Produto e usuário existentes | Informar quantidade igual ou menor que zero | Sistema rejeita a movimentação. |
| CT16 | Alerta de estoque mínimo | Produto possui limite mínimo | Fazer movimentação que deixe estoque no mínimo ou abaixo | Sistema retorna alerta de estoque mínimo. |
| CT17 | Histórico | Existirem movimentações | Consultar histórico | Sistema exibe produto, usuário, tipo, quantidade e data. |

## Critérios de aprovação

Um caso é considerado aprovado quando o comportamento observado corresponde ao resultado esperado, sem gerar erro inesperado ou alterar dados de forma indevida.

## Cobertura

Os testes cobrem os principais endpoints implementados na API: login, consulta/cadastro/alteração/exclusão de produtos e registro/consulta de movimentações. A implementação atual dessas operações está concentrada em `src/routes/index.js`. fileciteturn5file0L2-L6
