
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

const botaoTema = document.querySelector("#tema");
const formulario = document.querySelector("#formulario");

const botaoAbrirCarrinho = document.querySelector("#abrir-carrinho");
const botaoFecharCarrinho = document.querySelector("#fechar-carrinho");
const contadorCarrinho = document.querySelector("#contador-carrinho");
const areaCarrinho = document.querySelector("#carrinho");
const itensCarrinho = document.querySelector("#itens-carrinho");
const subtotalCarrinho = document.querySelector("#subtotal-carrinho");
const botaoLimparCarrinho = document.querySelector("#limpar-carrinho");
const botaoFinalizarCompra = document.querySelector("#finalizar-compra");
const mensagemCarrinho = document.querySelector("#mensagem-carrinho");
const fundoCarrinho = document.querySelector("#fundo-carrinho");

let filtro = "Todos";
let quantidade = 6;

const CHAVE_ARMAZENAMENTO = "portalGamerCarrinho";

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

let carrinho = carregarCarrinho();

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

function mostrarProdutos() {
  const texto = campoBusca.value.trim().toLowerCase();

  const resultado = produtos
    .map((produto, id) => ({ produto, id }))
    .filter(({ produto }) => {
      const categoriaOK =
        filtro === "Todos" || produto[0] === filtro;

      const buscaOK = produto[1].toLowerCase().includes(texto);

      return categoriaOK && buscaOK;
    });

  lista.innerHTML = resultado
    .slice(0, quantidade)
    .map(({ produto, id }) => `
      <article class="card">
        <img
          src="${produto[3]}"
          alt="Imagem do produto ${produto[1]}"
          loading="lazy"
        >

        <div class="card-conteudo">
          <small>${produto[0]}</small>
          <h3>${produto[1]}</h3>
          <p>Por ${formatarPreco(
            Number(produto[2].replace(",", "."))
          )}</p>

          <button
            class="adicionar-produto"
            type="button"
            data-id="${id}"
          >
            🛒 Adicionar ao carrinho
          </button>
        </div>
      </article>
    `)
    .join("");

  nenhuma.hidden = resultado.length > 0;
  botaoMais.hidden = quantidade >= resultado.length;
}

// Filtros por categoria
botoes.forEach(botao => {
  botao.addEventListener("click", () => {
    botoes.forEach(b => b.classList.remove("ativo"));

    botao.classList.add("ativo");
    filtro = botao.dataset.filtro;
    quantidade = 6;

    mostrarProdutos();
  });
});

// Busca de produtos
campoBusca.addEventListener("input", () => {
  quantidade = 6;
  mostrarProdutos();
});

// Mostrar mais produtos
botaoMais.addEventListener("click", () => {
  quantidade += 3;
  mostrarProdutos();
});

// Adicionar produtos ao carrinho usando delegação de eventos
lista.addEventListener("click", event => {
  const botao = event.target.closest(".adicionar-produto");

  if (!botao) return;

  const id = Number(botao.dataset.id);
  const produto = produtos[id];

  if (!produto) return;

  const preco = Number(produto[2].replace(",", "."));

  const existente = carrinho.find(item => item.id === id);

  if (existente) {
    carrinho = carrinho.map(item =>
      item.id === id
        ? { ...item, quantidade: item.quantidade + 1 }
        : item
    );
  } else {
    carrinho = [
      ...carrinho,
      {
        id,
        nome: produto[1],
        preco,
        imagem: produto[3],
        quantidade: 1
      }
    ];
  }

  mensagemCarrinho.textContent =
    `${produto[1]} adicionado ao carrinho.`;

  salvarCarrinho();
  atualizarCarrinho();
  abrirCarrinho();
});

// Atualizar contador, itens e subtotal
function atualizarCarrinho() {
  const totalItens = carrinho.reduce(
    (total, item) => total + item.quantidade,
    0
  );

  const subtotal = carrinho.reduce(
    (total, item) => total + item.preco * item.quantidade,
    0
  );

  contadorCarrinho.textContent = totalItens;
  subtotalCarrinho.textContent = formatarPreco(subtotal);

  if (carrinho.length === 0) {
    itensCarrinho.innerHTML = "<p>Seu carrinho está vazio.</p>";
    botaoFinalizarCompra.disabled = true;
  } else {
    botaoFinalizarCompra.disabled = false;

    itensCarrinho.innerHTML = carrinho.map(item => `
      <article class="item-carrinho">
        <img
          src="${item.imagem}"
          alt=""
          width="80"
          loading="lazy"
        >

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
            Total: <strong>${formatarPreco(
              item.preco * item.quantidade
            )}</strong>
          </p>

          <button
            type="button"
            data-acao="remover"
            data-id="${item.id}"
            class="botao-remover"
          >
            🗑 Remover
          </button>
        </div>
      </article>
    `).join("");
  }
}

// Aumentar, diminuir ou remover itens
itensCarrinho.addEventListener("click", event => {
  const botao = event.target.closest("button[data-acao]");

  if (!botao) return;

  const id = Number(botao.dataset.id);
  const acao = botao.dataset.acao;

  if (acao === "remover") {
    carrinho = carrinho.filter(item => item.id !== id);
  } else {
    carrinho = carrinho
      .map(item => {
        if (item.id !== id) return item;

        const novaQuantidade =
          acao === "aumentar"
            ? item.quantidade + 1
            : item.quantidade - 1;

        return { ...item, quantidade: novaQuantidade };
      })
      .filter(item => item.quantidade > 0);
  }

  mensagemCarrinho.textContent = "";
  salvarCarrinho();
  atualizarCarrinho();
});


function abrirCarrinho() {
  fundoCarrinho.hidden = false;

  areaCarrinho.inert = false;
  areaCarrinho.setAttribute("aria-hidden", "false");

  // Permite que o navegador registre o estado inicial
  // antes de aplicar a animação de entrada.
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

// Fecha ao clicar fora do painel
fundoCarrinho.addEventListener("click", fecharCarrinho);

// Fecha com a tecla Escape
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && areaCarrinho.classList.contains("aberto")) {
    fecharCarrinho();
  }
});


// Limpar todos os itens
botaoLimparCarrinho.addEventListener("click", () => {
  carrinho = [];
  mensagemCarrinho.textContent = "Carrinho esvaziado.";

  salvarCarrinho();
  atualizarCarrinho();
});

// Finalização demonstrativa
botaoFinalizarCompra.addEventListener("click", () => {
  if (carrinho.length === 0) return;

  const total = carrinho.reduce(
    (soma, item) => soma + item.preco * item.quantidade,
    0
  );

  mensagemCarrinho.textContent =
    `Pedido demonstrativo: ${formatarPreco(total)}. ` +
    "Para receber pagamentos, configure um checkout.";

  // Não limpamos o carrinho, pois nenhum pagamento foi realizado.
});

// Modo escuro
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

  const email = document.querySelector("#email").value.trim();
  const mensagem = document.querySelector("#mensagem");

  if (!/^[^ ]+@[^ ]+\.[^ ]+$/.test(email)) {
    mensagem.textContent = "Digite um e-mail válido.";
    return;
  }

  mensagem.textContent = "Cadastro realizado!";
  formulario.reset();
});

// Inicialização
mostrarProdutos();
atualizarCarrinho();

// Etapa de pagamento
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
        <input
          type="radio"
          name="pagamento"
          value="Pix"
          required
        >
        <span>📱 Pix</span>
      </label>

      <label class="opcao-pagamento">
        <input
          type="radio"
          name="pagamento"
          value="Cartão de crédito"
          required
        >
        <span>💳 Cartão de crédito</span>
      </label>

      <label class="opcao-pagamento">
        <input
          type="radio"
          name="pagamento"
          value="Boleto bancário"
          required
        >
        <span>🧾 Boleto bancário</span>
      </label>
    </fieldset>

    <div id="resumo-pagamento"></div>

    <p class="aviso-pagamento">
      Checkout demonstrativo. Nenhum pagamento real será efetuado.
    </p>

    <button type="submit" id="confirmar-pedido">
      Confirmar pedido demonstrativo
    </button>

    <button type="button" id="voltar-carrinho">
      Voltar ao carrinho
    </button>
  </form>
`;

botaoFinalizarCompra.insertAdjacentElement(
  "beforebegin",
  secaoPagamento
);

// Abrir a etapa de pagamento
botaoFinalizarCompra.addEventListener("click", () => {
  if (carrinho.length === 0) return;

  document.querySelector("#resumo-pagamento").textContent =
    "Total do pedido: " +
    formatarPreco(
      carrinho.reduce(
        (total, item) => total + item.preco * item.quantidade,
        0
      )
    );

  secaoPagamento.hidden = false;
  botaoFinalizarCompra.hidden = true;
});

// Voltar para os itens do carrinho
document.querySelector("#voltar-carrinho").addEventListener(
  "click",
  () => {
    secaoPagamento.hidden = true;
    botaoFinalizarCompra.hidden = false;
  }
);

// Confirmar o pedido demonstrativo
document.querySelector("#form-pagamento").addEventListener(
  "submit",
  event => {
    event.preventDefault();

    if (carrinho.length === 0) return;

    const formularioPagamento = event.currentTarget;
    const dados = new FormData(formularioPagamento);
    const metodo = dados.get("pagamento");

    if (!metodo) return;

    const pedido = {
      itens: carrinho.map(item => ({ ...item })),
      total: carrinho.reduce(
        (total, item) => total + item.preco * item.quantidade,
        0
      ),
      metodoPagamento: metodo,
      data: new Date().toISOString()
    };

   // Confirmação demonstrativa
console.log("Pedido demonstrativo:", pedido);

// Preparar as informações do pop-up antes de limpar o carrinho
document.querySelector("#popup-total").textContent =
  "Total: " + formatarPreco(pedido.total);

document.querySelector("#popup-metodo").textContent =
  "Pagamento: " + pedido.metodoPagamento;

document.querySelector("#popup-mensagem").textContent =
  "Seu pedido demonstrativo foi registrado com sucesso!";

// Limpar o carrinho
carrinho = [];
salvarCarrinho();
atualizarCarrinho();

secaoPagamento.hidden = true;
botaoFinalizarCompra.hidden = false;
formularioPagamento.reset();

// Fechar o painel do carrinho e exibir o pop-up
fecharCarrinho();

const popupCompra = document.querySelector("#popup-compra");
popupCompra.hidden = false;

document.querySelector("#fechar-popup").focus();
  }

const popupCompra = document.querySelector("#popup-compra");
const botaoFecharPopup = document.querySelector("#fechar-popup");

function fecharPopupCompra() {
  popupCompra.hidden = true;
  botaoAbrirCarrinho.focus();
}

botaoFecharPopup.addEventListener("click", fecharPopupCompra);

// Fechar ao clicar no fundo escuro
popupCompra.addEventListener("click", event => {
  if (event.target === popupCompra) {
    fecharPopupCompra();
  }
});

// Fechar com Escape
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !popupCompra.hidden) {
    fecharPopupCompra();
  }
});