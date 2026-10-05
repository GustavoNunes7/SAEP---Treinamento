let usuario = null;
const $ = (id) => document.getElementById(id);
const api = async (url, opcoes = {}) => {
  const r = await fetch("/api" + url, {
    headers: { "Content-Type": "application/json" },
    ...opcoes,
  });
  const d = await r.json();
  if (!r.ok) throw Error(d.erro);
  return d;
};
function mensagem(texto) {
  $("mensagem").textContent = texto;
}
$("formLogin").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    usuario = await api("/login", {
      method: "POST",
      body: JSON.stringify({
        email: $("email").value,
        senha: $("senha").value,
      }),
    });
    $("login").hidden = true;
    $("sistema").hidden = false;
    $("usuario").textContent = "Usuário: " + usuario.nome;
    carregarProdutos();
  } catch (e) {
    mensagem(e.message);
  }
});
$("sair").onclick = () => location.reload();
document.querySelectorAll("nav button").forEach(
  (b) =>
    (b.onclick = () => {
      document.querySelectorAll(".tela").forEach((t) => (t.hidden = true));
      $(b.dataset.tela).hidden = false;
      if (b.dataset.tela === "estoque") carregarSelect();
      if (b.dataset.tela === "historico") carregarHistorico();
    }),
);
async function carregarProdutos() {
  const rows = await api(
    "/produtos?busca=" + encodeURIComponent($("busca").value),
  );
  $("listaProdutos").innerHTML = rows
    .map(
      (p) =>
        `<tr><td>${p.nome}</td><td>${p.categoria}</td><td>${p.quantidade}</td><td>${p.minimo}</td><td><button onclick="editar(${p.id},'${p.nome}','${p.categoria}',${p.quantidade},${p.minimo})">Editar</button><button onclick="excluir(${p.id})">Excluir</button></td></tr>`,
    )
    .join("");
}
$("busca").oninput = carregarProdutos;
$("formProduto").onsubmit = async (e) => {
  e.preventDefault();
  try {
    await api("/produtos", {
      method: "POST",
      body: JSON.stringify({
        nome: $("nome").value,
        categoria: $("categoria").value,
        quantidade: Number($("quantidade").value),
        minimo: Number($("minimo").value),
      }),
    });
    e.target.reset();
    carregarProdutos();
  } catch (e) {
    alert(e.message);
  }
};
window.editar = async (id, nome, categoria, quantidade, minimo) => {
  const novoNome = prompt("Nome:", nome);
  if (novoNome === null) return;
  await api("/produtos/" + id, {
    method: "PUT",
    body: JSON.stringify({ nome: novoNome, categoria, quantidade, minimo }),
  });
  carregarProdutos();
};
window.excluir = async (id) => {
  if (confirm("Excluir produto?")) {
    try {
      await api("/produtos/" + id, { method: "DELETE" });
      carregarProdutos();
    } catch (e) {
      alert(e.message);
    }
  }
};
async function carregarSelect() {
  const rows = await api("/produtos");
  $("produto").innerHTML = rows
    .map(
      (p) =>
        `<option value="${p.id}">${p.nome} — estoque ${p.quantidade}</option>`,
    )
    .join("");
}
$("formMov").onsubmit = async (e) => {
  e.preventDefault();
  try {
    const d = await api("/movimentacoes", {
      method: "POST",
      body: JSON.stringify({
        produto_id: Number($("produto").value),
        usuario_id: usuario.id,
        tipo: $("tipo").value,
        quantidade: Number($("qtdMov").value),
      }),
    });
    $("alerta").textContent =
      d.alerta || d.mensagem + " Estoque atual: " + d.estoque_atual;
    e.target.reset();
    carregarSelect();
  } catch (e) {
    $("alerta").textContent = e.message;
  }
};
async function carregarHistorico() {
  const rows = await api("/movimentacoes");
  $("listaHistorico").innerHTML = rows
    .map(
      (r) =>
        `<tr><td>${r.produto}</td><td>${r.usuario}</td><td>${r.tipo}</td><td>${r.quantidade}</td><td>${r.data}</td></tr>`,
    )
    .join("");
}
