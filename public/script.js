// Guarda o usuário que fez login para usar seu ID nas movimentações.
let usuario = null;

// Atalho para buscar um elemento HTML pelo ID.
const $ = (id) => document.getElementById(id);

// Função usada para conversar com a API do servidor.
const api = async (url, opcoes = {}) => {
  // Faz uma requisição para /api e envia os dados em JSON.
  const r = await fetch("/api" + url, {
    headers: { "Content-Type": "application/json" },
    ...opcoes,
  });

  // Converte a resposta do servidor de JSON para objeto JavaScript.
  const d = await r.json();

  // Se a API retornar erro, interrompe a função e mostra a mensagem.
  if (!r.ok) throw Error(d.erro);

  // Retorna os dados recebidos da API.
  return d;
};

// Mostra uma mensagem na tela de login.
function mensagem(texto) {
  $("mensagem").textContent = texto;
}

// Executa quando o formulário de login é enviado.
$("formLogin").addEventListener("submit", async (e) => {
  // Impede o navegador de recarregar a página.
  e.preventDefault();

  try {
    // Envia e-mail e senha para a rota de login.
    usuario = await api("/login", {
      method: "POST",
      body: JSON.stringify({
        email: $("email").value,
        senha: $("senha").value,
      }),
    });

    // Esconde o login e mostra o sistema.
    $("login").hidden = true;
    $("sistema").hidden = false;

    // Mostra o nome do usuário logado.
    $("usuario").textContent = "Usuário: " + usuario.nome;

    // Carrega os produtos do banco.
    carregarProdutos();
  } catch (e) {
    // Mostra o erro caso o login falhe.
    mensagem(e.message);
  }
});

// Recarrega a página quando o usuário clica em sair.
$("sair").onclick = () => location.reload();

// Adiciona o comportamento aos botões do menu.
document.querySelectorAll("nav button").forEach(
  (b) =>
    (b.onclick = () => {
      // Esconde todas as telas.
      document.querySelectorAll(".tela").forEach((t) => (t.hidden = true));

      // Mostra somente a tela escolhida.
      $(b.dataset.tela).hidden = false;

      // Carrega os dados necessários para cada tela.
      if (b.dataset.tela === "estoque") carregarSelect();
      if (b.dataset.tela === "historico") carregarHistorico();
    }),
);

// Busca produtos na API e coloca os resultados na tabela.
async function carregarProdutos() {
  const rows = await api(
    "/produtos?busca=" + encodeURIComponent($("busca").value),
  );

  // Transforma cada produto em uma linha HTML.
  $("listaProdutos").innerHTML = rows
    .map(
      (p) =>
        `<tr><td>${p.nome}</td><td>${p.categoria}</td><td>${p.quantidade}</td><td>${p.minimo}</td><td><button onclick="editar(${p.id},'${p.nome}','${p.categoria}',${p.quantidade},${p.minimo})">Editar</button><button onclick="excluir(${p.id})">Excluir</button></td></tr>`,
    )
    .join("");
}

// Atualiza a lista quando o usuário digita na busca.
$("busca").oninput = carregarProdutos;

// Cadastra um novo produto.
$("formProduto").onsubmit = async (e) => {
  e.preventDefault();

  try {
    // Envia os dados do formulário para a API.
    await api("/produtos", {
      method: "POST",
      body: JSON.stringify({
        nome: $("nome").value,
        categoria: $("categoria").value,
        quantidade: Number($("quantidade").value),
        minimo: Number($("minimo").value),
      }),
    });

    // Limpa o formulário e atualiza a tabela.
    e.target.reset();
    carregarProdutos();
  } catch (e) {
    alert(e.message);
  }
};

// Edita um produto pelo ID.
window.editar = async (id, nome, categoria, quantidade, minimo) => {
  const novoNome = prompt("Nome:", nome);

  // Cancela a edição se o usuário fechar o prompt.
  if (novoNome === null) return;

  // Envia os dados atualizados para a API.
  await api("/produtos/" + id, {
    method: "PUT",
    body: JSON.stringify({ nome: novoNome, categoria, quantidade, minimo }),
  });

  carregarProdutos();
};

// Exclui um produto pelo ID.
window.excluir = async (id) => {
  if (confirm("Excluir produto?")) {
    try {
      // DELETE remove o produto no banco.
      await api("/produtos/" + id, { method: "DELETE" });
      carregarProdutos();
    } catch (e) {
      alert(e.message);
    }
  }
};

// Carrega os produtos no campo de seleção da tela de estoque.
async function carregarSelect() {
  const rows = await api("/produtos");

  // Cria uma opção para cada produto.
  $("produto").innerHTML = rows
    .map(
      (p) =>
        `<option value="${p.id}">${p.nome} — estoque ${p.quantidade}</option>`,
    )
    .join("");
}

// Registra uma entrada ou saída de estoque.
$("formMov").onsubmit = async (e) => {
  e.preventDefault();

  try {
    // Envia produto, usuário, tipo e quantidade para a API.
    const d = await api("/movimentacoes", {
      method: "POST",
      body: JSON.stringify({
        produto_id: Number($("produto").value),
        usuario_id: usuario.id,
        tipo: $("tipo").value,
        quantidade: Number($("qtdMov").value),
      }),
    });

    // Mostra a mensagem ou o alerta de estoque mínimo.
    $("alerta").textContent =
      d.alerta || d.mensagem + " Estoque atual: " + d.estoque_atual;

    // Limpa o formulário e atualiza o estoque.
    e.target.reset();
    carregarSelect();
  } catch (e) {
    $("alerta").textContent = e.message;
  }
};

// Busca o histórico de movimentações.
async function carregarHistorico() {
  const rows = await api("/movimentacoes");

  // Coloca cada movimentação em uma linha da tabela.
  $("listaHistorico").innerHTML = rows
    .map(
      (r) =>
        `<tr><td>${r.produto}</td><td>${r.usuario}</td><td>${r.tipo}</td><td>${r.quantidade}</td><td>${r.data}</td></tr>`,
    )
    .join("");
}
