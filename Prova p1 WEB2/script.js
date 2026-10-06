const produtos = [
  ["Games", "GTA6", "399,00", "https://picsum.photos/seed/rpg/600/350"],
  ["Hardware", "Monitor 29' Acer", "899,00", "https://picsum.photos/seed/pcgamer/600/350"],
  ["Emuladores", "Licença emulador Switch 2", "1499,00", "https://picsum.photos/seed/esports2/600/350"],
  ["Manuais", "Guia todos os achievements de Hollow Knight", "99,00", "https://picsum.photos/seed/indie2/600/350"],
  ["Games", "Resident Evil 9", "299,00", "https://picsum.photos/seed/gameupdate/600/350"],
  ["Hardware", "Teclado Mecânico", "399,00", "https://picsum.photos/seed/monitor2/600/350"],
  ["Emuladores", "Licença emulador PS5", "1799,00", "https://picsum.photos/seed/team/600/350"],
  ["Manuais", "Guia todos os achievements Minecraft", "29,00", "https://picsum.photos/seed/studio2/600/350"],
  ["Games", "FIFA 27", "499,00", "https://picsum.photos/seed/access/600/350"],
  ["Hardware", "Placa de vídeo RTX 7090", "4999,00", "https://picsum.photos/seed/ssd2/600/350"]
];

const lista = document.querySelector("#lista");
const botoes = document.querySelectorAll(".filtros button");
const campoBusca = document.querySelector("#busca");
const botaoMais = document.querySelector("#mais");
const nenhuma = document.querySelector("#nenhuma");
const adicionar = document.querySelector("#adicionar");
let filtro = "Todos";
let quantidade = 6;
let qtdProduto = 0;

function mostrarProdutos() {
  const texto = campoBusca.value.toLowerCase();

  const resultado = produtos.filter(produtos => {
    const categoriaOK = filtro === "Todos" || produtos[0] === filtro;
    const buscaOK = produtos[1].toLowerCase().includes(texto);
    return categoriaOK && buscaOK;
  });

  lista.innerHTML = resultado.slice(0, quantidade).map(produtos => `
    <article class="card">
      <img src="${produtos[3]}" alt="Imagem relacionada ao Produto: ${produtos[1]}" loading="lazy">
      <div class="card-conteudo">
        <small>${produtos[0]}</small>
        <h3>${produtos[1]}</h3>
        <p>Por ${produtos[2]}</p>
        <h3> Adicionar ao carrinho <h3>
      </div>
    </article>
  `).join("");

  nenhuma.hidden = resultado.length > 0;
  botaoMais.hidden = quantidade >= resultado.length;
}

botoes.forEach(botao => {
  botao.addEventListener("click", () => {
    botoes.forEach(b => b.classList.remove("ativo"));
    botao.classList.add("ativo");
    filtro = botao.dataset.filtro;
    quantidade = 6;
    mostrarProdutos();
  });
});

campoBusca.addEventListener("input", () => {
  quantidade = 6;
  mostrarProdutos();
});

botaoMais.addEventListener("click", () => {
  quantidade += 3;
  mostrarProdutos();
});

document.querySelector("#tema").addEventListener("click", event => {
  document.body.classList.toggle("escuro");
  event.target.textContent =
    document.body.classList.contains("escuro") ? "Modo claro" : "Modo escuro";
});

document.querySelector("#formulario").addEventListener("submit", event => {
  event.preventDefault();

  const email = document.querySelector("#email").value;
  const mensagem = document.querySelector("#mensagem");

  if (!/^[^ ]+@[^ ]+\.[^ ]+$/.test(email)) {
    mensagem.textContent = "Digite um e-mail válido.";
    return;
  }

  mensagem.textContent = "Cadastro realizado!";
  event.target.reset();
});

mostrarProdutos();

function gerarIdItem() {
  const idGerado = proximoIdItem;
  proximoIdItem += 1;
  return String(idGerado);
}

function adicionarItem(itens, novoItem) {
  return [...itens, novoItem];
}

function removerItem(itens, idItem) {
  return itens.filter((item) => item.id !== idItem);
}

function salvarListaNoArmazenamento(itens) {
  localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(itens));
}

function carregarListaDoArmazenamento() {
  const dadosSalvos = localStorage.getItem(CHAVE_ARMAZENAMENTO);
  if (!dadosSalvos) return []; // guard clause — nada salvo ainda

  try {
    return JSON.parse(dadosSalvos).map((item) => Object.freeze(item));
  } catch {
    return []; // guard clause — dado corrompido no armazenamento, começa do zero
  }
}

const botaoRemoverElemento = criarBotaoAcao({
  texto: "🗑 Remover",
  classe: "secondary outline botao-remover",
  ariaLabel: `Remover ${item.nome}`,
});

