---
doc: dataset_content_writing
fonte_padrao: deck_padronizacao_v1
precedencia: deck/brandbook > site > derivado
chunking: automatico  # ver src/ai/knowledgeChunker.ts
---
# Dataset de Content Writing — E-commerce Magalu (v2)

Base de conhecimento para padronização textual e tom de voz do e-commerce Magalu. Fontes: **Brandbook Magalu**, deck **Padronização de Textos E-comm** (Content & Writing CX, v1, 02/12/2024) e **observação do site magazineluiza.com.br** (home, listagem de Celulares e PDP, em 24/06/2026).

> **Procedência dos registros.** `site_magalu_observado` = padrão visto no ar. `deck_padronizacao_v1` / `brandbook_magalu` = fontes oficiais. `derivado_da_regra` = exemplos/transformações derivados das regras. Os exemplos ❌ continuam derivados; os ✅ das categorias novas vêm do site.

**Novidades da v2:** 9 categorias novas observadas no site (preço/Pix, marketplace, avaliações, filtros, navegação, conteúdo gerado pela Lu, entrega/devolução, cupom, microcopy de sistema), seção de **inconsistências reais** do site e os **marcadores de linguagem da Lu**.

**Arquivo de dados:** `magalu_content_writing_dataset.jsonl` (221 registros). Este Markdown é o espelho legível.

---

## 1. Tom de voz — os 4 jeitos de falar

Missão: *Digitalizar os brasileiros*. Quatro pilares, cada um com um jeito de falar e sua nuvem de palavras.

### Para todo mundo  ·  _Hub Facilitador_

**Essência:** Acessível + Acolhedora

**Princípios:**

- Ser, sobretudo, humano. É falar de pessoa para pessoa.
- Ser acessível, fugir do excessivamente técnico, frio ou de nichos.
- Estabelecer diálogos amplos e escrever de um jeito que todo mundo entende.
- Quando possível, falar com emoção, sem ser piegas.
- Construir uma narrativa envolvente, com argumentos que se conectem às necessidades comuns do dia a dia, de maneira democrática — ou seja, para todos.

**Nuvem de palavras:** confiança, clareza, humano, diálogo acessível, emoção, narrativa envolvente.

**Quando usar:** Base de tom para toda a comunicação do e-commerce. É o jeito padrão de falar com o cliente.

### Sempre em movimento  ·  _Relações Democráticas_

**Essência:** Empreendedorismo + Agilidade

**Princípios:**

- Indicar, conduzir, explicar, dar o passo a passo, mostrar o quanto tudo é fácil e rápido.
- Ter sempre uma resposta clara e inteligente, provando que tudo faz sentido.
- Acompanhar tendências: estar aberto a novos assuntos e expressões.
- Pensar o texto como um organismo vivo, com flexibilidade e movimento. Ampliar os pontos de visão e, ao mesmo tempo, transmitir veracidade para o conteúdo.

**Nuvem de palavras:** facilitador, agilidade, praticidade, faz sentido, verdadeiro, atento ao novo.

**Quando usar:** Fluxos de ação e orientação: passo a passo de pedido, status, ajuda, onboarding, CTAs que conduzem o usuário.

### Simplesmente incrível  ·  _Experiência Encantadora_

**Essência:** Simplicidade + Eficácia

**Princípios:**

- Fugir do óbvio e ser criativo sem perder a simplicidade; procurar sempre novas maneiras de se expressar para causar mais impacto.
- Olhar especialmente para títulos e chamadas, pensando em abordagens que não estejam desgastadas ou sejam mais do mesmo.
- Ter um tom otimista, mas ao mesmo tempo responsável e confiável.

**Nuvem de palavras:** jeito novo, inesperado, otimista, contemporâneo, fator "uau", magnífico.

**Quando usar:** Títulos de vitrine, chamadas promocionais, banners e momentos em que a marca quer encantar e se destacar.

### Digital que impulsiona  ·  _Impacto Transformador_

**Essência:** Inspiração + Inovação

**Princípios:**

- É o tom de voz utilizado pela Lu. O jeito que a Lu fala, as palavras que usa e os assuntos que escolhe são apenas dela e podem ser usados somente em situações e canais específicos.
- Em sua maneira de falar, a Lu mistura o universo digital com assuntos reais, unindo padrões da internet a emoções extremamente humanas.
- Faz parte do pacote de comunicação e expressão da marca Magalu, mas não é o tom padrão do e-commerce.

**Nuvem de palavras:** inspiração, inovação, universo digital, padrões da internet, emoção humana.

**Quando usar:** Apenas em canais e situações específicos da Lu (redes sociais, campanhas da persona). Não usar como tom padrão do e-commerce.

### A linguagem da Lu (observada no site)

Marcadores de linguagem da Lu observados nas FAQs e textos de apoio do site. Tom conversacional, de pessoa para pessoa, otimista.

**Marcadores:** Olha, ..., ..., viu?, ..., tá?, Gente, ..., Aí sim!, Uau!, Gostei!, vem comigo que eu te ajudo, dá uma olhadinha, A dica da Lu é ..., ..., combinado?, ..., hein?.

**Uso:** Conteúdo educativo/explicativo da persona (FAQ, Blog da Lu, Lu Explica). Não usar como tom padrão de PDP/checkout transacional.

---

## 2. Regras de capitalização por categoria

As 9 primeiras vêm do deck oficial; as 9 seguintes (10–18) foram observadas no site.

| # | Categoria | Padrão | Fonte |
|---|-----------|--------|-------|
| 1 | Categorias de Produtos | Title Case (inicial maiúscula em cada palavra) | deck |
| 2 | Nomes de Produtos | Title Case, exceto preposições | deck |
| 3 | Nomes de Marcas | Grafia oficial da marca | deck |
| 4 | Títulos de Vitrines | Sentence case (só a primeira palavra) | deck |
| 5 | Serviços e Submarcas do Magalu | Title Case (inicial maiúscula em cada palavra) | deck |
| 6 | Botões (CTAs) | Sentence case (só a primeira palavra) | deck |
| 7 | Prazos de Entrega | Sentence case (só a primeira palavra) | deck |
| 8 | Tags e Selos | Sentence case (só a primeira palavra) | deck |
| 9 | Pagamento (Pix) | Apenas a primeira letra maiúscula | deck |
| 10 | Preço, Parcelamento e Pix | Sentence case (só a primeira palavra) | site |
| 11 | Marketplace e Vendedor | Sentence case (só a primeira palavra) | site |
| 12 | Avaliações e Reviews | Sentence case (só a primeira palavra) | site |
| 13 | Filtros e Ordenação | Sentence case (só a primeira palavra) | site |
| 14 | Navegação e Breadcrumb | Sentence case (só a primeira palavra) | site |
| 15 | Conteúdo gerado por IA (Lu) | Sentence case (só a primeira palavra) | site |
| 16 | Entrega e Devolução | Sentence case (só a primeira palavra) | site |
| 17 | Cupom | Sentence case (só a primeira palavra) | site |
| 18 | Microcopy de sistema e cabeçalho | Sentence case (só a primeira palavra) | site |

### Categorias de Produtos

`categoria_produto` · **Padrão:** Title Case (inicial maiúscula em cada palavra) · **Tom:** Para todo mundo

**Prática:** Use letra maiúscula no início de cada palavra, enfatizando o valor e a importância de cada categoria para o cliente. Conjunções e preposições (e, de, com...) permanecem em minúsculas.

**Exceções:**

- Siglas como 'TVs' (Televisores) e abreviações como 'Cameba' (Cama, Mesa e Banho) são permitidas em alguns contextos, desde que atendam ao objetivo da demanda e estejam alinhadas às orientações do PO (Dono do Produto).

| ✅ Recomendado | ❌ Não recomendado | Motivo |
|---|---|---|
| Móveis | móveis | Categoria em minúscula; deveria ter a inicial maiúscula. |
| Eletroportáteis | BELEZA E PERFUMARIA | Caixa alta indevida; use Title Case com 'e' minúsculo. |
| Beleza e Perfumaria | Utilidades domésticas | Só a primeira palavra está maiúscula; cada palavra principal leva inicial maiúscula. |
| Comércio e Indústria | Beleza E Perfumaria | Conjunção 'e' não deve ser maiúscula em Title Case. |
| Utilidades Domésticas |  |  |
| Brinquedos |  |  |

### Nomes de Produtos

`nome_produto` · **Padrão:** Title Case, exceto preposições · **Tom:** Para todo mundo

**Prática:** Use letra maiúscula em cada palavra dos nomes de produtos, exceto em preposições (a, de, até, com, sem, para etc.). Para marcas, siga a grafia oficial definida por elas. A prática melhora a leitura e reforça a confiança na escolha.

**Exceções:**

- Palavras compostas por hífen (Porta-copos, Guarda-chuva): apenas a primeira palavra começa com letra maiúscula, seguindo o novo acordo ortográfico.
- Siglas e modelos de marca seguem a grafia oficial da marca.

| ✅ Recomendado | ❌ Não recomendado | Motivo |
|---|---|---|
| Fone de Ouvido Bluetooth JBL Live Beam 3 | Fone De Ouvido Bluetooth Jbl Live Beam 3 | 'De' não deve ser maiúsculo (preposição) e 'JBL' deve respeitar a grafia oficial em caixa alta. |
| Smartphone Samsung Galaxy S23 Ultra | fritadeira elétrica sem óleo | Nome de produto todo em minúsculo; cada palavra principal leva inicial maiúscula. |
| Fritadeira Elétrica sem Óleo | Fritadeira Elétrica Sem Óleo | Preposição 'sem' não deve ser maiúscula. |
| Porta-copos de Silicone | Porta-Copos de Silicone | Em composto por hífen, apenas a primeira parte leva inicial maiúscula: 'Porta-copos'. |
| Guarda-chuva Automático |  |  |

### Nomes de Marcas

`nome_marca` · **Padrão:** Grafia oficial da marca · **Tom:** Para todo mundo

**Prática:** Em nomes de marcas, use letra maiúscula no início de cada palavra. Quando a marca ou o modelo possuir siglas, represente-as com todas as letras maiúsculas e/ou conforme a grafia oficial definida pela marca. A forma de escrever oficial sempre prevalece.

**Exceções:**

- A grafia oficial da marca prevalece sobre a regra geral (ex.: marcas com grafia estilizada).

| ✅ Recomendado | ❌ Não recomendado | Motivo |
|---|---|---|
| Samsung | samsung | Nome de marca em minúsculo; respeite a grafia oficial. |
| Mondial | Lg | Sigla deve ser em caixa alta: 'LG'. |
| Lenovo | jbl | Sigla deve ser em caixa alta: 'JBL'. |
| LG | Omo | A grafia oficial é em caixa alta: 'OMO'. |
| OMO |  |  |
| JBL |  |  |

### Títulos de Vitrines

`vitrine` · **Padrão:** Sentence case (só a primeira palavra) · **Tom:** Simplesmente incrível

**Prática:** Nos títulos de vitrines, use maiúscula apenas na primeira palavra, com as demais em minúsculas. Quando houver ponto final, de exclamação ou interrogação no meio do título, a palavra seguinte começa com letra maiúscula.

**Exceções:**

- Quando o título incluir o nome de uma categoria, marca ou serviço Magalu, esse nome se inicia com letra maiúscula (ex.: 'As melhores ofertas em Informática', 'Ofertas só pra você, Cliente Ouro!').

| ✅ Recomendado | ❌ Não recomendado | Motivo |
|---|---|---|
| Corre pra finalizar sua compra! | Corre Pra Finalizar Sua Compra! | Title Case indevido; em vitrine use sentence case (só a primeira palavra maiúscula). |
| Lembra das ofertas? Vem aproveitar! | CORRE PRA FINALIZAR SUA COMPRA! | Caixa alta passa tom impessoal; use sentence case. |
| Finaliza a compra! É rapidinho | lembra das ofertas? vem aproveitar! | Após '?' a palavra seguinte deve começar com maiúscula: 'Vem'. E a primeira palavra também. |
| Selecionamos o melhor pra você! | As melhores ofertas em informática | 'Informática' é categoria e deve iniciar com maiúscula. |
| Linha Galaxy recomendada pra você! |  |  |
| As melhores ofertas em Informática |  |  |
| Ofertas só pra você, Cliente Ouro! |  |  |

### Serviços e Submarcas do Magalu

`servico_submarca` · **Padrão:** Title Case (inicial maiúscula em cada palavra) · **Tom:** Para todo mundo

**Prática:** Os nomes dos serviços e submarcas Magalu devem ser escritos com a primeira letra de cada palavra em maiúscula. Isso reflete a importância de cada serviço e reforça a marca Magalu em todas as interações.

**Exceções:**

- Grafias oficiais específicas prevalecem (ex.: 'MagaluPay' em camelCase, 'Magalog').
- Conjunções e preposições internas permanecem minúsculas (ex.: 'Proteção Roubo e Furto com Quebra Acidental').

| ✅ Recomendado | ❌ Não recomendado | Motivo |
|---|---|---|
| Garantia Estendida | garantia estendida | Serviço Magalu deve usar Title Case: 'Garantia Estendida'. |
| Troca Certa | Magalu Pay | Grafia oficial é 'MagaluPay' (junto, em camelCase). |
| Proteção Roubo e Furto com Quebra Acidental | cliente ouro | Serviço deve usar Title Case: 'Cliente Ouro'. |
| Casa Protegida | MAGALOG | Use a grafia oficial 'Magalog', não caixa alta. |
| Proteção Saúde |  |  |
| Cartão Superprotegido |  |  |
| Compra Segura |  |  |
| Favoritos |  |  |
| Magalu Serviços |  |  |
| Magalu Seguros |  |  |
| Magalu Indica |  |  |
| MagaluPay |  |  |
| Compra Internacional |  |  |
| Listas de Casamento |  |  |
| Cliente Ouro |  |  |
| Magalu Entregas |  |  |
| Magalog |  |  |
| Consórcio Magalu |  |  |
| Influenciador Magalu |  |  |

### Botões (CTAs)

`cta` · **Padrão:** Sentence case (só a primeira palavra) · **Tom:** Sempre em movimento

**Prática:** Os textos de botões devem iniciar com a primeira palavra em maiúscula, com o restante em minúsculas. Os CTAs precisam transmitir clareza e incentivar a ação do usuário.

| ✅ Recomendado | ❌ Não recomendado | Motivo |
|---|---|---|
| Adicionar à sacola | Adicionar à Sacola | Title Case indevido em CTA; use sentence case: 'Adicionar à sacola'. |
| Comprar agora | COMPRAR AGORA | Caixa alta indevida; use sentence case: 'Comprar agora'. |
| Retire na loja grátis | adicionar à sacola | Falta a inicial maiúscula na primeira palavra. |

### Prazos de Entrega

`prazo_entrega` · **Padrão:** Sentence case (só a primeira palavra) · **Tom:** Sempre em movimento

**Prática:** Em prazos de entrega, a primeira palavra é maiúscula e o restante permanece em minúsculas.

**Exceções:**

- Para o termo 'Frete Grátis' neste contexto, ambas as palavras ficam em maiúsculas, reforçando o benefício ao cliente. (Atenção: em Tags e Selos o mesmo benefício aparece como 'Frete grátis', em sentence case. A grafia depende do contexto.)

| ✅ Recomendado | ❌ Não recomendado | Motivo |
|---|---|---|
| Chega hoje | Chega Hoje | Title Case indevido; use sentence case: 'Chega hoje'. |
| Chega amanhã | CHEGA AMANHÃ | Caixa alta indevida; use sentence case: 'Chega amanhã'. |
| Retire na loja em 2 horas | frete grátis | No contexto de prazo de entrega, o benefício leva ambas maiúsculas: 'Frete Grátis'. |
| Frete Grátis |  |  |

### Tags e Selos

`tag_selo` · **Padrão:** Sentence case (só a primeira palavra) · **Tom:** Simplesmente incrível

**Prática:** Em tags e selos, use maiúscula apenas na primeira palavra. Devem ser claros, objetivos e destacar condições ou benefícios exclusivos.

**Exceções:**

- Selo 'Magalu Indica': por ser um serviço de recomendação, use maiúscula nas duas palavras.
- Termo 'OFF': use caixa alta na palavra inteira para garantir destaque visual e reforçar a percepção de promoção/desconto.

| ✅ Recomendado | ❌ Não recomendado | Motivo |
|---|---|---|
| Frete grátis | Mais Vendidos | Title Case indevido em selo; use sentence case: 'Mais vendidos'. |
| Restam apenas 6 | até 50% off no pix | 'OFF' deve ser caixa alta, 'Pix' leva inicial maiúscula e a primeira palavra também. |
| Full | FULL | Use sentence case: 'Full'. |
| Mais vendidos | magalu indica | Exceção: selo 'Magalu Indica' leva as duas palavras com inicial maiúscula. |
| Termina em |  |  |
| Até 50% OFF no Pix |  |  |
| Magalu Indica |  |  |

### Pagamento (Pix)

`pix` · **Padrão:** Apenas a primeira letra maiúscula · **Tom:** Para todo mundo

**Prática:** A palavra 'Pix' deve ser escrita com apenas a primeira letra maiúscula, seguindo a orientação do Banco Central (Manual de uso da marca Pix).

| ✅ Recomendado | ❌ Não recomendado | Motivo |
|---|---|---|
| Pix | PIX | Caixa alta indevida; a grafia correta (Banco Central) é 'Pix'. |
| Pague com Pix | pix | Falta a inicial maiúscula: 'Pix'. |
| Até 50% OFF no Pix |  |  |

### Preço, Parcelamento e Pix · _observado no site_

`preco_pagamento` · **Padrão:** Sentence case (só a primeira palavra) · **Tom:** Sempre em movimento

**Prática:** Microcopy de preço e parcelamento em sentence case. Estrutura observada: 'Nx de R$ X,XX sem juros' para parcelas e 'ou R$ X,XX no Pix' para o preço à vista. 'Pix' sempre com inicial maiúscula; 'sem juros' em minúsculas; 'OFF' em caixa alta no percentual de desconto.

**Exceções:**

- 'OFF' em caixa alta.
- 'Pix' com inicial maiúscula (Banco Central).
- Quando inicia frase, 'Ou' leva inicial maiúscula (ex.: 'Ou R$ 1.776,67 em 10x...').

| ✅ Recomendado | ❌ Não recomendado | Motivo |
|---|---|---|
| 10x de R$ 177,67 sem juros | 10X DE R$ 177,67 SEM JUROS | Caixa alta indevida; use sentence case. |
| ou R$ 1.599,00 no Pix | 10x de R$ 177,67 Sem Juros | 'Sem juros' não leva maiúsculas. |
| 10% OFF | 10% de desconto no pix | 'Pix' deve ter inicial maiúscula (erro real observado no site, no texto entre parênteses dos cards). |
| Ver opções de pagamento | R$ 1.599,00 No Pix | 'no' não leva maiúscula. |
| Ou R$ 1.776,67 em 10x de R$ 177,67 sem juros |  |  |

### Marketplace e Vendedor · _observado no site_

`marketplace_vendedor` · **Padrão:** Sentence case (só a primeira palavra) · **Tom:** Para todo mundo

**Prática:** Indicação de quem vende e entrega, em sentence case. Estruturas observadas: 'Vendido e entregue por [Loja]' (venda única) e 'Vendido por [Loja] e entregue por Magalu' (marketplace). O nome da loja segue a grafia oficial do seller.

**Exceções:**

- O nome do seller respeita sua grafia oficial (ex.: 'KaBuM!').

| ✅ Recomendado | ❌ Não recomendado | Motivo |
|---|---|---|
| Vendido e entregue por Magalu | VENDIDO E ENTREGUE POR MAGALU | Caixa alta indevida; use sentence case. |
| Vendido por KaBuM! e entregue por Magalu | Vendido E Entregue Por Magalu | Title Case indevido em frase. |
| Informações da loja | vendido e entregue por magalu | Falta a inicial maiúscula na primeira palavra. |
| Lojista Magalu desde 2016 |  |  |
| O Magalu garante a sua compra, do pedido à entrega. |  |  |

### Avaliações e Reviews · _observado no site_

`avaliacao_review` · **Padrão:** Sentence case (só a primeira palavra) · **Tom:** Para todo mundo

**Prática:** Rótulos e resumos de avaliações em sentence case. A nota aparece como número com o total entre parênteses ('4.8 (2.688)'). Destaques de review aparecem em minúsculas.

**Exceções:**

- Destaques curtos de review ficam em minúsculas (ex.: 'memória fantástica').

| ✅ Recomendado | ❌ Não recomendado | Motivo |
|---|---|---|
| Avaliações dos clientes | Avaliações Dos Clientes | Title Case indevido. |
| 2.688 avaliações | VER TODAS AS AVALIAÇÕES | Caixa alta indevida. |
| 1.237 comentários | 4.8(2688) | Falta espaço e separador de milhar: '4.8 (2.688)'. |
| Avaliações com fotos e vídeos |  |  |
| Ver todas as avaliações |  |  |
| O que os clientes estão falando do produto |  |  |
| 4.8 (2.688) |  |  |

### Filtros e Ordenação · _observado no site_

`filtro_ordenacao` · **Padrão:** Sentence case (só a primeira palavra) · **Tom:** Sempre em movimento

**Prática:** Rótulos de filtro em sentence case ('Marca', 'Preço', 'Vendido por', 'Tipo de compra'). Atenção: as opções de ordenação aparecem no site em Title Case ('Mais Vendidos', 'Menor Preço'), o que diverge do selo 'Mais vendidos'. Recomendação: padronizar ordenação em sentence case para alinhar ao restante.

**Exceções:**

- Valores de filtro que são selos/serviços seguem a grafia do selo (ex.: 'Full', 'Ofertas do Dia').

| ✅ Recomendado | ❌ Não recomendado | Motivo |
|---|---|---|
| Marca | VENDIDO POR | Caixa alta indevida em rótulo de filtro. |
| Preço | Mais Vendidos | Como opção de ordenação aparece em Title Case no site, mas diverge do selo 'Mais vendidos'; padronizar em sentence case. |
| Vendido por | tipo de compra | Falta a inicial maiúscula. |
| Tipo de compra |  |  |
| Avaliação |  |  |
| Promoções |  |  |
| Compra nacional |  |  |
| Compra internacional |  |  |

### Navegação e Breadcrumb · _observado no site_

`navegacao` · **Padrão:** Sentence case (só a primeira palavra) · **Tom:** Sempre em movimento

**Prática:** O breadcrumb inicia em 'Home' e lista a trilha de categorias; cada categoria segue a grafia oficial (Title Case). Itens de menu de departamentos também em Title Case.

**Exceções:**

- Nomes de categoria/marca seguem sua grafia oficial.

| ✅ Recomendado | ❌ Não recomendado | Motivo |
|---|---|---|
| Home | celulares e smartphones | Categoria em minúsculo na trilha (inconsistência real observada no breadcrumb). |
| Celulares e Smartphones | HOME | Caixa alta indevida. |
| Galaxy A36 | Tv e Vídeo | Sigla 'TV' deve ficar em caixa alta. |
| TV e Vídeo |  |  |
| Utilidades Domésticas |  |  |

### Conteúdo gerado por IA (Lu) · _observado no site_

`conteudo_ia_lu` · **Padrão:** Sentence case (só a primeira palavra) · **Tom:** Digital que impulsiona

**Prática:** Conteúdo gerado automaticamente é atribuído de forma clara e transparente, em sentence case, com a fórmula 'pela Lu' ou 'da Lu'. Reforça transparência e a persona da marca em vez de citar 'IA' genérica.

**Exceções:**

- A atribuição usa a persona 'Lu', não 'IA' ou 'inteligência artificial' genérica.

| ✅ Recomendado | ❌ Não recomendado | Motivo |
|---|---|---|
| Informações geradas pela Lu | Texto gerado por inteligência artificial | Sem atribuição à persona; preferir 'pela Lu'. |
| Resumo de avaliações de clientes feito pela Lu | RESUMO FEITO PELA LU | Caixa alta indevida. |
| Informações da Lu | Informações Geradas Pela Lu | Title Case indevido. |

### Entrega e Devolução · _observado no site_

`entrega_devolucao` · **Padrão:** Sentence case (só a primeira palavra) · **Tom:** Sempre em movimento

**Prática:** Mensagens de entrega e devolução em sentence case, com tom acolhedor ('pra você'). Benefícios podem ser destacados em Title Case quando viram rótulo/selo: observado 'Entrega Full' e 'Devolução Gratuita' (ambas maiúsculas) ao lado de 'Devolução gratuita' (sentence case) no corpo do texto.

**Exceções:**

- 'Entrega Full' e 'Devolução Gratuita' em Title Case quando rótulo/selo de destaque; em corpo de texto, sentence case.

| ✅ Recomendado | ❌ Não recomendado | Motivo |
|---|---|---|
| Entrega rápida e segura pra você. | ENTREGA RÁPIDA E SEGURA | Caixa alta indevida. |
| Devolva seu produto em até 7 dias do recebimento. | Devolva Seu Produto Em Até 7 Dias | Title Case indevido. |
| Magalu garante a sua compra, do pedido à entrega. | devolução gratuita em até 7 dias | Como selo de destaque, usar 'Devolução Gratuita'. |
| Entrega Full |  |  |
| Devolução Gratuita |  |  |

### Cupom · _observado no site_

`cupom` · **Padrão:** Sentence case (só a primeira palavra) · **Tom:** Simplesmente incrível

**Prática:** Selo de cupom segue 'Cupom' (inicial maiúscula) + valor + 'OFF' em caixa alta. Ex.: 'Cupom 10% OFF', 'Cupom R$ 30 OFF'.

**Exceções:**

- 'OFF' sempre em caixa alta.

| ✅ Recomendado | ❌ Não recomendado | Motivo |
|---|---|---|
| Cupom 10% OFF | cupom 10% off | Falta inicial em 'Cupom' e 'OFF' deve ser caixa alta. |
| Cupom R$ 30 OFF | Cupom 10% Off | 'OFF' deve ser caixa alta. |
| Cupom R$ 500 OFF | CUPOM 10% OFF | 'Cupom' não deve ser caixa alta inteira. |

### Microcopy de sistema e cabeçalho · _observado no site_

`microcopy_sistema` · **Padrão:** Sentence case (só a primeira palavra) · **Tom:** Para todo mundo

**Prática:** Microcopy de cabeçalho, inputs, saudações e estados em sentence case, com tom humano e acolhedor. Ex.: 'Digite seu CEP', 'Olá, vem ser feliz!', 'Buscar em Magazine Luiza'.

**Exceções:**

- Siglas (CEP, CPF) em caixa alta.

| ✅ Recomendado | ❌ Não recomendado | Motivo |
|---|---|---|
| Digite seu CEP | DIGITE SEU CEP | Caixa alta indevida (exceto a sigla CEP). |
| Olá, vem ser feliz! | Olá, Vem Ser Feliz! | Title Case indevido. |
| Aproveite ofertas incríveis recomendadas para você. | digite seu cep | Falta inicial maiúscula e a sigla CEP. |
| Buscar em Magazine Luiza |  |  |
| + de 10.000 produtos encontrados |  |  |

---

## 3. Biblioteca De / Para

| De | Para | Tom | Por quê | Fonte |
|---|---|---|---|---|
| Acompanhe seus pedidos. É muito fácil acompanhar seu pedido! Clique aqui, faça seu login e saiba em qual etapa ele se encontra! | Passo a passo do seu pedido. Se quiser, você pode acompanhar seu pedido até chegar em você. É só clicar aqui e fazer seu login. | Sempre em movimento | Conduz com passo a passo, mais humano e direto, sem perder a clareza. | brandbook |
| O meu pedido acabou de ser realizado, como posso fazer a troca? Não conseguimos realizar a troca nesse momento. É necessário que você recuse o produto no ato da entrega e após a recusa entre em contato para que a troca seja aberta, ok? | Meu pedido já foi realizado. Posso fazer alguma troca? Infelizmente, não podemos fazer trocas imediatas após a finalização do pedido. Mas, calma, há como resolver! Recuse o produto no ato da entrega e entre em contato com nossa Central de Atendimento. O processo de troca será iniciado imediatamente. | Para todo mundo | Acolhe a frustração ('Mas, calma, há como resolver!') e resolve com clareza. | brandbook |
| Magazine Luiza S.A. comunica aos seus respectivos acionistas e ao mercado em geral que o marketplace do Magalu foi eleito o melhor do Brasil. | Magalu, o melhor do Brasil. O Magalu recebeu o prêmio Melhor Marketplace do Brasil. Mais do que isso: virou referência em e-commerce do país. | Simplesmente incrível | Sai do tom jurídico/corporativo para um tom humano, otimista e direto. | brandbook |
| CLIQUE AQUI E COMPRE JÁ | Comprar agora | Sempre em movimento | Remove a caixa alta (impessoal) e aplica sentence case no CTA, com ação clara. | derivado |
| Adicione o produto ao carrinho de compras | Adicionar à sacola | Sempre em movimento | Padroniza o CTA, encurta e usa o termo da casa ('sacola'). | derivado |
| Prazo de entrega estimado: 24 horas | Chega amanhã | Sempre em movimento | Troca o jargão técnico por uma promessa humana e fácil de entender. | derivado |
| Produto com frete sem custo para o cliente | Frete Grátis | Para todo mundo | Destaca o benefício de forma direta, com a grafia de prazo de entrega (ambas maiúsculas). | derivado |
| Efetue o pagamento através de PIX | Pague com Pix | Para todo mundo | Corrige a grafia 'Pix' (Banco Central) e troca 'efetue/através' por linguagem simples. | derivado |
| Não há mais estoque disponível para este item no momento | Esgotado por enquanto. Volta logo! | Simplesmente incrível | Tom otimista e acolhedor no lugar da frieza, mantendo a informação. | derivado |
| Desconto de até 50% off | Até 50% OFF no Pix | Simplesmente incrível | Aplica a exceção 'OFF' em caixa alta e deixa a condição clara. | derivado |
| Realize o seu cadastro para prosseguir com a finalização da sua compra | Crie sua conta pra finalizar a compra | Para todo mundo | Linguagem de pessoa para pessoa, sem formalidade desnecessária. | derivado |
| Aguarde, sua solicitação está sendo processada pelo sistema | Só um instante, estamos preparando tudo pra você | Para todo mundo | Substitui o jargão de sistema por uma fala humana e tranquilizadora. | derivado |
| PARCELE EM 10X SEM JUROS | 10x de R$ 177,67 sem juros | Sempre em movimento | Sentence case e estrutura de parcelamento do site. | derivado |
| Compre agora mesmo! | Comprar agora | Sempre em movimento | CTA primário padronizado da PDP. | site |
| Este produto é vendido por um parceiro | Vendido e entregue por [Loja] | Para todo mundo | Estrutura padrão de marketplace observada. | site |
| Veja o que dizem nossos clientes | O que os clientes estão falando do produto | Para todo mundo | Alinha ao rótulo real da seção de avaliações. | site |
| Resumo gerado por inteligência artificial | Resumo de avaliações de clientes feito pela Lu | Digital que impulsiona | Atribui à persona Lu, com transparência. | site |
| 10% de desconto à vista no pix | 10% OFF no Pix | Simplesmente incrível | 'OFF' em caixa alta e 'Pix' com inicial maiúscula. | derivado |

---

## 4. Inconsistências reais observadas no site

Divergências encontradas no ar (24/06/2026). Material direto para o modo **validar/normalizar** do agente.

| # | Caso | ✅ Recomendado | ❌ Divergente | Recomendação | Onde |
|---|---|---|---|---|---|
| INC-01 | 'no Pix' vs 'no pix' | no Pix | no pix | Padronizar 'Pix' sempre com inicial maiúscula (Banco Central), inclusive em textos entre parênteses. | Cards de listagem ('no Pix' no preço, mas '(X% de desconto no pix)' no parêntese). |
| INC-02 | 'Frete Grátis' vs 'Frete grátis' | Frete Grátis | Frete grátis | Depende do contexto: prazo de entrega usa 'Frete Grátis' (ambas maiúsculas); tag/selo usa 'Frete grátis' (sentence case). Documentar a regra de contexto. | Deck (prazo x tag) e site. |
| INC-03 | 'Devolução Gratuita' vs 'Devolução gratuita' | Devolução Gratuita | Devolução gratuita | Selo de destaque em Title Case; corpo de texto em sentence case. Padronizar por contexto. | PDP (selo de benefício x texto de política). |
| INC-04 | 'Mais Vendidos' (ordenação) vs 'Mais vendidos' (selo) | Mais Vendidos | Mais vendidos | Padronizar opções de ordenação em sentence case para alinhar ao selo. | Listagem: dropdown de ordenação x selo de produto. |
| INC-05 | Caixa de 'TV' nas subcategorias | Smart TV | Smart Tv / Tv Led / Tv 4k | Sigla 'TV' sempre em caixa alta. Vários links de subcategoria divergem ('Smart Tv', 'Tv Led', 'Painéis para tv'). | Menu de subcategorias. |
| INC-06 | 'Magalu Seguros' vs 'Magalu seguros' | Magalu Seguros | Magalu seguros | Submarca em Title Case: 'Magalu Seguros'. | Rodapé/menu de serviços (aparece 'Magalu seguros'). |
| INC-07 | Breadcrumb com caixa divergente | Celulares e Smartphones | celulares e smartphones | Categorias no breadcrumb devem seguir a grafia oficial (Title Case) em todos os níveis. | PDP breadcrumb (mesma trilha com caixas diferentes). |
| INC-08 | 'Lista de Casamento' (site) vs 'Listas de Casamento' (deck) | Listas de Casamento | Lista de Casamento | Definir forma canônica única (singular ou plural) entre deck e site. | Menu de serviços (singular) x deck (plural). |
| INC-09 | Nomes de produto de sellers (3P) fora do padrão | Relógio Smart Watch Digital D20 Masculino e Feminino | Relogio Smart Watch Digital D20 Original Masculino E Feminino | Nomes de 3P frequentemente quebram o Title Case sem preposições ('E' maiúsculo, acentuação ausente). Validar/normalizar nomes de catálogo de sellers. | Listagem (produtos de marketplace). |
| INC-10 | 'Ficha Técnica' vs 'ficha técnica' | Ficha técnica | Ficha Técnica | Padronizar o rótulo de seção ('Descrição e ficha técnica' usa minúscula; 'Ficha Técnica' usa Title Case). | PDP (dois rótulos próximos). |

---

## 5. Playbook do agente

### Modo: gerar

Para gerar copy nova: identifique a categoria (cta, vitrine, tag_selo, prazo_entrega, nome_produto, nome_marca, categoria_produto, servico_submarca, pix). Aplique o 'padrao_capitalizacao' da regra correspondente, respeite as exceções e escreva no 'pilar_tom' indicado. Consulte o glossário para a grafia oficial de termos e marcas.

### Modo: validar

Para validar copy existente: classifique a categoria, compare a capitalização com o 'padrao_capitalizacao' da regra e verifique as exceções (Frete Grátis vs Frete grátis por contexto, OFF em caixa alta, Pix, Magalu Indica, MagaluPay, siglas de marca). Use os exemplos 'nao_recomendado' como referência de erro. Retorne: conforme / não conforme + motivo + sugestão corrigida.

### Modo: normalizar

Para normalizar (De → Para): corrija primeiro a capitalização pela regra da categoria; depois ajuste o tom para o pilar adequado (humano e acessível por padrão; 'Sempre em movimento' em fluxos de ação; 'Simplesmente incrível' em chamadas). Use os pares 'transformacao' como referência de estilo. Preserve a informação essencial.

---

## 6. Referência rápida de exceções

- **Frete Grátis** (prazo de entrega, ambas maiúsculas) **vs Frete grátis** (tag/selo, sentence case).
- **Devolução Gratuita** (selo) **vs Devolução gratuita** (corpo de texto).
- **OFF** sempre em caixa alta (descontos, cupons).
- **Pix** apenas com a inicial maiúscula — inclusive em parênteses (erro comum no site: 'no pix').
- **Magalu Indica** com as duas palavras em maiúscula; **MagaluPay** em camelCase; **Magalog** com inicial apenas.
- **Hífen:** só a primeira palavra leva inicial maiúscula (Porta-copos, Guarda-chuva).
- **Preposições em nomes de produto** (a, de, até, com, sem, para) em minúscula; conjunção **e** também.
- **Siglas** (LG, JBL, OMO, TV, CEP) em caixa alta, conforme grafia oficial.
- **Ordenação** ('Mais Vendidos') aparece em Title Case no site, mas o selo é 'Mais vendidos' — padronizar.
- **Conteúdo de IA** atribuído **pela Lu**, não como 'inteligência artificial' genérica.
