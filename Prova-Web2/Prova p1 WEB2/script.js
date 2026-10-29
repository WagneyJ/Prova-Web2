
const produtos = [
["Games","GTA6","399,00","https://picsum.photos/seed/gta6-game/600/350","4.3"],
["Hardware","Monitor 29' Acer","899,00","https://picsum.photos/seed/ultrawide-monitor/600/350","4.2"],
["Emuladores","Licença emulador Switch 2","1499,00","https://picsum.photos/seed/nintendo-console/600/350","3.9"],
["Manuais","Guia todos os achievements de Hollow Knight","99,00","https://picsum.photos/seed/indie-adventure/600/350","4.7"],
["Games","Resident Evil 9","299,00","https://picsum.photos/seed/survival-horror/600/350","3.7"],
["Hardware","Teclado Mecânico","399,00","https://picsum.photos/seed/mechanical-keyboard/600/350","4.1"],
["Emuladores","Licença emulador PS5","1799,00","https://picsum.photos/seed/playstation-console/600/350","4.4"],
["Manuais","Guia todos os achievements Minecraft","29,00","https://picsum.photos/seed/minecraft-blocks/600/350","4.8"],
["Games","FIFA 27","499,00","https://picsum.photos/seed/football-stadium/600/350","4.6"],
["Hardware","Placa de vídeo RTX 7090","4999,00","https://picsum.photos/seed/graphics-card/600/350","4.9"]
];


const selecionar = seletor => document.querySelector(seletor);
const CHAVE_ARMAZENAMENTO = "portalGamerCarrinho";

const lista = selecionar("#lista");
const botoes = document.querySelectorAll(".filtros button");
const campoBusca = selecionar("#busca");
const botaoMais = selecionar("#mais");
const nenhuma = selecionar("#nenhuma");
const botaoTema = selecionar("#tema");
const formulario = selecionar("#formulario");

const botaoAbrirCarrinho = selecionar("#abrir-carrinho");
const botaoFecharCarrinho = selecionar("#fechar-carrinho");
const contadorCarrinho = selecionar("#contador-carrinho");
const areaCarrinho = selecionar("#carrinho");
const itensCarrinho = selecionar("#itens-carrinho");
const subtotalCarrinho = selecionar("#subtotal-carrinho");
const botaoLimparCarrinho = selecionar("#limpar-carrinho");
const botaoFinalizarCompra = selecionar("#finalizar-compra");
const mensagemCarrinho = selecionar("#mensagem-carrinho");
const fundoCarrinho = selecionar("#fundo-carrinho");

let filtro = "Todos";
let quantidade = 6;
let carrinho = carregarCarrinho();

function carregarCarrinho() {
  try {
    const dados = JSON.parse(
      localStorage.getItem(CHAVE_ARMAZENAMENTO) || "[]"
    );

    if (!Array.isArray(dados)) return [];

    return dados.filter(item =>
      item &&
      Number.isInteger(item.id) &&
      Number.isInteger(item.quantidade) &&
      item.quantidade > 0 &&
      typeof item.nome === "string" &&
      Number.isFinite(item.preco) &&
      item.preco >= 0
    );
  } catch {
    return [];
  }
}

function salvarCarrinho() {
  try {
    localStorage.setItem(
      CHAVE_ARMAZENAMENTO,
      JSON.stringify(carrinho)
    );
  } catch {
    mensagemCarrinho.textContent =
      "Não foi possível salvar o carrinho neste navegador.";
  }
}

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function precoProduto(produto) {
  return Number(produto[2].replace(",", "."));
}

function totalCarrinho() {
  return carrinho.reduce(
    (total, item) => total + item.preco * item.quantidade,
    0
  );
}

// Catálogo, filtros e pesquisa

function mostrarProdutos() {
  const texto = campoBusca.value.trim().toLowerCase();

  const resultado = produtos
    .map((produto, id) => ({ produto, id }))
    .filter(({ produto }) =>
      (filtro === "Todos" || produto[0] === filtro) &&
      produto[1].toLowerCase().includes(texto)
    );

  lista.innerHTML = resultado.slice(0, quantidade).map(({ produto, id }) => {
    const estrelas = Math.floor(Number(produto[4]));

    return `
      <article class="card">
        <img
          src="${produto[3]}"
          alt="Imagem do produto ${produto[1]}"
          loading="lazy"
        >
        <div class="card-conteudo">
          <span class="categoria-produto categoria-${produto[0].toLowerCase()}">
            ${produto[0]}
          </span>
          <h3>${produto[1]}</h3>
          <div class="avaliacao" aria-label="Avaliação ${produto[4]} de 5 estrelas">
            <span class="estrelas" aria-hidden="true">
              ${"★".repeat(estrelas)}${"☆".repeat(5 - estrelas)}
            </span>
            <span>${produto[4]} / 5</span>
          </div>
          <p class="preco-produto">
            ${formatarPreco(precoProduto(produto))}
          </p>
          <button class="adicionar-produto" type="button" data-id="${id}">
            <span aria-hidden="true">🛒</span>
            Adicionar ao carrinho
          </button>
        </div>
      </article>`;
  }).join("");

  nenhuma.hidden = resultado.length > 0;
  botaoMais.hidden = quantidade >= resultado.length;
}

botoes.forEach(botao => {
  botao.addEventListener("click", () => {
    botoes.forEach(item => item.classList.remove("ativo"));
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

// Adição e atualização do carrinho

lista.addEventListener("click", event => {
  const botao = event.target.closest(".adicionar-produto");
  if (!botao) return;

  const id = Number(botao.dataset.id);
  const produto = produtos[id];
  if (!produto) return;

  const existente = carrinho.find(item => item.id === id);

  if (existente) {
    existente.quantidade++;
  } else {
    carrinho.push({
      id,
      nome: produto[1],
      preco: precoProduto(produto),
      imagem: produto[3],
      quantidade: 1
    });
  }

  mensagemCarrinho.textContent =
    `${produto[1]} adicionado ao carrinho.`;

  salvarCarrinho();
  atualizarCarrinho();
  abrirCarrinho();
});

function atualizarCarrinho() {
  contadorCarrinho.textContent = carrinho.reduce(
    (total, item) => total + item.quantidade,
    0
  );

  subtotalCarrinho.textContent = formatarPreco(totalCarrinho());
  botaoFinalizarCompra.disabled = carrinho.length === 0;

  if (carrinho.length === 0) {
    itensCarrinho.innerHTML = "<p>Seu carrinho está vazio.</p>";
    return;
  }

  itensCarrinho.innerHTML = carrinho.map(item => `
    <article class="item-carrinho">
      <img src="${item.imagem}" alt="" width="80" loading="lazy">
      <div class="item-info">
        <h3>${item.nome}</h3>
        <p>${formatarPreco(item.preco)} cada</p>
        <div class="quantidade-controles">
          <button
            type="button"
            data-acao="diminuir"
            data-id="${item.id}"
            aria-label="Diminuir quantidade de ${item.nome}"
          >−</button>
          <span>${item.quantidade}</span>
          <button
            type="button"
            data-acao="aumentar"
            data-id="${item.id}"
            aria-label="Aumentar quantidade de ${item.nome}"
          >+</button>
        </div>
        <p>
          Total:
          <strong>${formatarPreco(item.preco * item.quantidade)}</strong>
        </p>
        <button
          type="button"
          data-acao="remover"
          data-id="${item.id}"
          class="botao-remover"
        >🗑 Remover</button>
      </div>
    </article>`).join("");
}

itensCarrinho.addEventListener("click", event => {
  const botao = event.target.closest("button[data-acao]");
  if (!botao) return;

  const id = Number(botao.dataset.id);
  const item = carrinho.find(produto => produto.id === id);
  if (!item) return;

  if (botao.dataset.acao === "remover") {
    carrinho = carrinho.filter(produto => produto.id !== id);
  } else if (botao.dataset.acao === "aumentar") {
    item.quantidade++;
  } else {
    item.quantidade--;

    if (item.quantidade <= 0) {
      carrinho = carrinho.filter(produto => produto.id !== id);
    }
  }

  mensagemCarrinho.textContent = "";
  salvarCarrinho();
  atualizarCarrinho();
});

// Abertura e fechamento do carrinho

function abrirCarrinho() {
  fundoCarrinho.hidden = false;
  areaCarrinho.inert = false;
  areaCarrinho.setAttribute("aria-hidden", "false");

  requestAnimationFrame(() => {
    areaCarrinho.classList.add("aberto");
  });

  document.body.style.overflow = "hidden";
  botaoFecharCarrinho.focus();
}

function fecharCarrinho() {
  areaCarrinho.classList.remove("aberto");
  areaCarrinho.setAttribute("aria-hidden", "true");
  areaCarrinho.inert = true;
  fundoCarrinho.hidden = true;

  document.body.style.overflow = "";
  botaoAbrirCarrinho.focus();
}

botaoAbrirCarrinho.addEventListener("click", abrirCarrinho);
botaoFecharCarrinho.addEventListener("click", fecharCarrinho);
fundoCarrinho.addEventListener("click", fecharCarrinho);

document.addEventListener("keydown", event => {
  if (
    event.key === "Escape" &&
    areaCarrinho.classList.contains("aberto")
  ) {
    fecharCarrinho();
  }
});

botaoLimparCarrinho.addEventListener("click", () => {
  carrinho = [];
  mensagemCarrinho.textContent = "Carrinho esvaziado.";

  salvarCarrinho();
  atualizarCarrinho();
});

botaoFinalizarCompra.addEventListener("click", () => {
  if (carrinho.length === 0) return;

  mensagemCarrinho.textContent =
    `Pedido demonstrativo: ${formatarPreco(totalCarrinho())}. ` +
    "Para receber pagamentos, configure um checkout.";
});

// Tema claro e escuro

botaoTema.addEventListener("click", event => {
  document.body.classList.toggle("escuro");

  event.currentTarget.textContent =
    document.body.classList.contains("escuro")
      ? "Modo claro"
      : "Modo escuro";
});

// Cadastro da newsletter

formulario.addEventListener("submit", event => {
  event.preventDefault();

  const email = selecionar("#email").value.trim();
  const mensagem = selecionar("#mensagem");

  if (!/^[^ ]+@[^ ]+\.[^ ]+$/.test(email)) {
    mensagem.textContent = "Digite um e-mail válido.";
    return;
  }

  mensagem.textContent = "Cadastro realizado!";
  formulario.reset();
});

// Inicialização do catálogo e do carrinho

mostrarProdutos();
atualizarCarrinho();

// Formulário de pagamento

const secaoPagamento = document.createElement("section");
secaoPagamento.id = "secao-pagamento";
secaoPagamento.hidden = true;

secaoPagamento.innerHTML = `
  <div class="pagamento-cabecalho">
    <h3>💳 Método de pagamento</h3>
    <p>Escolha como deseja pagar seu pedido.</p>
  </div>
  <form id="form-pagamento">
    <fieldset class="opcoes-pagamento">
      <legend>Forma de pagamento</legend>
      <label class="opcao-pagamento">
        <input type="radio" name="pagamento" value="Pix" required>
        <span>📱 Pix</span>
      </label>
      <label class="opcao-pagamento">
        <input type="radio" name="pagamento" value="Cartão de crédito" required>
        <span>💳 Cartão de crédito</span>
      </label>
      <label class="opcao-pagamento">
        <input type="radio" name="pagamento" value="Boleto bancário" required>
        <span>🧾 Boleto bancário</span>
      </label>
    </fieldset>
    <div id="resumo-pagamento"></div>
    <div id="pix-area" hidden aria-live="polite">
      <div class="pix-modal" role="dialog" aria-modal="true" aria-labelledby="pix-titulo">
        <h4 id="pix-titulo">Pagamento via Pix</h4>
        <p>QR Code demonstrativo gerado pela API.</p>
        <img id="pix-qrcode" alt="QR Code demonstrativo para pagamento via Pix">
        <p>
          Confirmação do pedido em
          <strong id="pix-contagem">5</strong> segundos.
        </p>
        <p class="pix-aviso">
          Este QR Code é apenas uma simulação e não recebe pagamentos reais.
        </p>
      </div>
    </div>
    <p class="aviso-pagamento">
      Checkout demonstrativo. Nenhum pagamento real será efetuado.
    </p>
    <button type="submit" id="confirmar-pedido">
      Confirmar pedido demonstrativo
    </button>
    <button type="button" id="voltar-carrinho">
      Voltar ao carrinho
    </button>
  </form>`;

botaoFinalizarCompra.insertAdjacentElement("beforebegin", secaoPagamento);

botaoFinalizarCompra.addEventListener("click", () => {
  if (carrinho.length === 0) return;

  selecionar("#resumo-pagamento").textContent =
    `Total do pedido: ${formatarPreco(totalCarrinho())}`;

  secaoPagamento.hidden = false;
  botaoFinalizarCompra.hidden = true;
});

let pixTimeout = null;
let pixIntervalo = null;

const formularioPagamento = selecionar("#form-pagamento");
const areaPix = selecionar("#pix-area");
const imagemPix = selecionar("#pix-qrcode");
const contagemPix = selecionar("#pix-contagem");
const botaoConfirmarPedido = selecionar("#confirmar-pedido");

function cancelarContagemPix() {
  clearTimeout(pixTimeout);
  clearInterval(pixIntervalo);

  pixTimeout = null;
  pixIntervalo = null;
  areaPix.hidden = true;

  botaoConfirmarPedido.disabled = false;
  botaoConfirmarPedido.textContent =
    "Confirmar pedido demonstrativo";
}

selecionar("#voltar-carrinho").addEventListener("click", () => {
  cancelarContagemPix();

  secaoPagamento.hidden = true;
  botaoFinalizarCompra.hidden = false;
});

// Confirmação do pedido e simulação de pagamento

function concluirPedido(metodo) {
  if (carrinho.length === 0) return;

  cancelarContagemPix();

  const pedido = {
    itens: carrinho.map(item => ({ ...item })),
    total: totalCarrinho(),
    metodoPagamento: metodo,
    data: new Date().toISOString()
  };

  console.log("Pedido demonstrativo:", pedido);

  selecionar("#popup-total").textContent =
    `Total: ${formatarPreco(pedido.total)}`;

  selecionar("#popup-metodo").textContent =
    `Pagamento: ${pedido.metodoPagamento}`;

  selecionar("#popup-mensagem").textContent =
    metodo === "Pix"
      ? "Pedido demonstrativo confirmado após a exibição do QR Code. Nenhum pagamento real foi realizado."
      : "Seu pedido demonstrativo foi registrado com sucesso!";

  carrinho = [];
  salvarCarrinho();
  atualizarCarrinho();

  secaoPagamento.hidden = true;
  botaoFinalizarCompra.hidden = false;
  formularioPagamento.reset();

  fecharCarrinho();

  const popup = selecionar("#popup-compra");
  popup.hidden = false;
  selecionar("#fechar-popup").focus();
}

function mostrarQRCodePix() {
  const conteudoPix =
    `PORTAL GAMER - PIX DEMONSTRATIVO - TOTAL ${totalCarrinho().toFixed(2)}`;

  imagemPix.src =
    "https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=" +
    encodeURIComponent(conteudoPix);

  areaPix.hidden = false;
  botaoConfirmarPedido.disabled = true;
  botaoConfirmarPedido.textContent = "Aguardando confirmação...";

  let segundos = 5;
  contagemPix.textContent = segundos;

  pixIntervalo = setInterval(() => {
    contagemPix.textContent = --segundos;

    if (segundos <= 0) {
      clearInterval(pixIntervalo);
    }
  }, 1000);

  pixTimeout = setTimeout(() => concluirPedido("Pix"), 5000);
}

formularioPagamento
  .querySelectorAll('input[name="pagamento"]')
  .forEach(opcao => {
    opcao.addEventListener("change", cancelarContagemPix);
  });

formularioPagamento.addEventListener("submit", event => {
  event.preventDefault();

  const metodo = new FormData(formularioPagamento).get("pagamento");
  if (!metodo || carrinho.length === 0) return;

  if (metodo === "Pix") {
    mostrarQRCodePix();
  } else {
    concluirPedido(metodo);
  }
});

// Popup de confirmação da compra

const popupCompra = selecionar("#popup-compra");
const botaoFecharPopup = selecionar("#fechar-popup");

function fecharPopupCompra() {
  popupCompra.hidden = true;
  botaoAbrirCarrinho.focus();
}

botaoFecharPopup.addEventListener("click", fecharPopupCompra);

popupCompra.addEventListener("click", event => {
  if (event.target === popupCompra) {
    fecharPopupCompra();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !popupCompra.hidden) {
    fecharPopupCompra();
  }
});
