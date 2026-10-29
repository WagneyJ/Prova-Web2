# Portal Gamer

Loja virtual demonstrativa desenvolvida como projeto acadêmico de Desenvolvimento Web 2. O site reúne um catálogo de produtos relacionados a games e tecnologia, busca e filtros, carrinho de compras, avaliações, alternância de tema e uma etapa de checkout ilustrativa.

## Tecnologias utilizadas

- **HTML5:** estrutura e conteúdo das páginas e dos componentes.
- **CSS3:** identidade visual, cartões de produtos, layout responsivo, temas claro e escuro, carrinho lateral e janelas de diálogo.
- **JavaScript puro (Vanilla JavaScript):** renderização do catálogo, pesquisa, filtros, avaliações, carrinho, formulário do Clube Gamer e fluxo de pagamento demonstrativo.
- **Google Fonts:** fontes Inter e Space Grotesk.
- **Lorem Picsum:** imagens ilustrativas dos produtos e do banner.
- **QR Server API:** geração da imagem de QR Code exibida na simulação de pagamento via Pix.

Não é necessário instalar dependências ou executar um processo de compilação.

## Como executar

1. Baixe e extraia o projeto.
2. Mantenha `index.html`, `style.css`, `script.js` e `README.md` na mesma pasta.
3. Abra `index.html` em um navegador atualizado.
4. Para carregar as fontes, as imagens e o QR Code, mantenha uma conexão com a internet.

## Funcionalidades

### Catálogo de produtos

- Lista de produtos organizada nas categorias **Games**, **Hardware**, **Emuladores** e **Manuais**.
- Busca por nome do produto.
- Filtros por categoria, incluindo a opção **Todos**.
- Botão **Mostrar mais** para exibir outros itens do catálogo.
- Etiquetas coloridas para facilitar a identificação das categorias.
- Preços formatados em reais (BRL).
- Avaliações numéricas de 0 a 5, com estrelas preenchidas e vazias de acordo com a nota cadastrada para cada produto.

Os produtos, preços, imagens e notas são dados de demonstração definidos no início de `script.js`.

### Carrinho de compras

- Adição de produtos e incremento da quantidade de itens já adicionados.
- Painel lateral para consultar os produtos selecionados.
- Atualização do contador de itens e do valor total.
- Remoção de itens e opção para limpar o carrinho.
- Armazenamento local do carrinho no navegador usando `localStorage`, para manter os itens entre recargas da página no mesmo navegador.

### Tema visual

- Alternância entre modo claro e modo escuro.
- Cores e contrastes adaptados aos dois temas.
- Layout responsivo para diferentes larguras de tela.

### Clube Gamer

- Seção de apresentação do Clube Gamer.
- Formulário de cadastro de e-mail com validação básica no navegador.
- Mensagem de retorno após o envio do formulário.
- Divulgação demonstrativa de cupom de boas-vindas e ofertas.

O formulário não envia os dados para um servidor; a confirmação é apenas visual.

### Checkout e Pix demonstrativo

1. Clique em **Finalizar compra** no carrinho.
2. Selecione Pix, cartão de crédito ou boleto bancário.
3. Clique em **Confirmar pedido demonstrativo**.
4. Se Pix for selecionado, o site solicita à QR Server API uma imagem de QR Code e a exibe em destaque. A confirmação demonstrativa ocorre após cinco segundos, quando é apresentado o pop-up de conclusão.
5. Para cartão ou boleto, o pop-up de confirmação é exibido sem a etapa do QR Code.

**Importante:** o checkout é uma simulação acadêmica. O conteúdo codificado no QR Code é texto demonstrativo, não é um código Pix de cobrança válido. Não há integração com banco, gateway de pagamento ou confirmação real de transação. A contagem de cinco segundos não comprova que houve pagamento.

## Estrutura dos arquivos

```text
Portal_Gamer_original_atualizado/
├── index.html   # Estrutura da página e componentes principais
├── style.css    # Estilos, temas, responsividade e componentes visuais
├── script.js    # Produtos, filtros, carrinho, Clube Gamer e checkout demonstrativo
└── README.md    # Documentação do projeto
```

## Personalização

- **Produtos, preços, categorias e notas:** edite a lista `produtos` no início de `script.js`.
- **Cores, fontes e responsividade:** altere as regras em `style.css`.
- **Textos e estrutura:** edite os elementos de `index.html`.
- **Pagamento real:** seria necessário integrar um provedor de pagamentos, gerar uma cobrança Pix válida e confirmar seu status por um mecanismo confiável no servidor. A implementação atual não faz isso.

## Observações

- As imagens são ilustrativas e carregadas do Lorem Picsum.
- A fonte depende do Google Fonts.
- A geração da imagem do QR Code depende de acesso à QR Server API.
- O projeto foi criado para fins didáticos e não deve ser usado para receber pagamentos reais.
