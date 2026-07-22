---
doc: glossario_marca
fonte_padrao: deck_padronizacao_v1
chunking: automatico
status: povoado  # semeado da base + propostas no tom Magalu (validar)
---

# Glossário de marca — grafia oficial e uso

Fonte de verdade para a **grafia correta** de termos, marcas, submarcas, serviços,
selos, categorias e formas de pagamento do Magalu. É o glossário que o
`lu_writer_system_prompt.md` pressupõe: a IA consulta aqui para **escrever e
revisar** copy com a grafia certa.

> **Como ler a Fonte:** `deck` / `site` / `brandbook` = oficial. `derivado` =
> extraído das regras. `derivado (De/Para)` = preferência de léxico. Linhas
> `⟨preencher⟩` são placeholders para o time.

**Colunas:** `Termo` · `Tipo` · `Grafia correta ✅` · `Evite ❌` · `Quando usar / regra` · `Fonte`

| Termo | Tipo | Grafia correta ✅ | Evite ❌ | Quando usar / regra | Fonte |
|---|---|---|---|---|---|
| Pix | pagamento | Pix | PIX · pix · no pix | Só a inicial maiúscula (Banco Central), inclusive entre parênteses. | deck / glossário (INC-01) |
| MagaluPay | submarca/serviço | MagaluPay | Magalu Pay · MAGALUPAY | camelCase, junto. Serviço financeiro. | glossário / deck |
| Magalog | serviço | Magalog | MAGALOG · Magalu Log | Só a inicial. Logística. | deck |
| Magalu Indica | selo | Magalu Indica | magalu indica · Magalu indica | Selo de recomendação: as duas palavras com inicial maiúscula (exceção). | deck (tag_selo) |
| Frete Grátis | benefício | Frete Grátis | frete grátis | No contexto de PRAZO de entrega, ambas maiúsculas. | deck (prazo_entrega, INC-02) |
| Frete grátis | tag | Frete grátis | Frete Grátis | No contexto de TAG/selo, sentence case. O contexto decide. | deck (tag_selo, INC-02) |
| Devolução Gratuita | selo | Devolução Gratuita | devolução gratuita | Como selo/rótulo de destaque, Title Case. | site (INC-03) |
| Devolução gratuita | benefício | Devolução gratuita | Devolução Gratuita | Em corpo de texto/política, sentence case. | site (INC-03) |
| OFF | pagamento | OFF | off · Off | Sempre em caixa alta em descontos e cupons. | deck (tag_selo) |
| Cupom | tag | Cupom | cupom · CUPOM | Inicial maiúscula + valor + OFF. Ex.: Cupom 10% OFF. | site (cupom) |
| Full | selo | Full | FULL | Sentence case. Selo de entrega Full. | site (tag_selo) |
| Entrega Full | selo | Entrega Full | entrega full | Title Case quando rótulo de destaque. | site (entrega_devolucao) |
| Cliente Ouro | programa | Cliente Ouro | cliente ouro | Title Case. Programa de relacionamento. | deck (servico_submarca) |
| Garantia Estendida | serviço | Garantia Estendida | garantia estendida | Title Case. | deck (servico_submarca) |
| Troca Certa | serviço | Troca Certa | troca certa | Title Case. | deck (servico_submarca) |
| Casa Protegida | serviço | Casa Protegida | casa protegida | Title Case. | deck (servico_submarca) |
| Proteção Roubo e Furto com Quebra Acidental | serviço | Proteção Roubo e Furto com Quebra Acidental | proteção roubo e furto... | Title Case; conjunções/preposições internas minúsculas. | deck (servico_submarca) |
| Proteção Saúde | serviço | Proteção Saúde | proteção saúde | Title Case. | deck (servico_submarca) |
| Cartão Superprotegido | serviço | Cartão Superprotegido | cartão superprotegido | Title Case. | deck (servico_submarca) |
| Compra Segura | serviço | Compra Segura | compra segura | Title Case. | deck (servico_submarca) |
| Compra Internacional | serviço | Compra Internacional | compra internacional | Title Case. | deck (servico_submarca) |
| Consórcio Magalu | serviço | Consórcio Magalu | consórcio magalu | Title Case. | deck (servico_submarca) |
| Magalu Seguros | submarca/serviço | Magalu Seguros | Magalu seguros | Title Case (submarca). | site (INC-06) |
| Magalu Serviços | submarca/serviço | Magalu Serviços | magalu serviços | Title Case. | deck (servico_submarca) |
| Magalu Entregas | submarca/serviço | Magalu Entregas | magalu entregas | Title Case. | deck (servico_submarca) |
| Influenciador Magalu | serviço | Influenciador Magalu | influenciador magalu | Title Case. | deck (servico_submarca) |
| Listas de Casamento | serviço | Listas de Casamento | Lista de Casamento | Definir forma canônica (deck usa plural). | deck (INC-08) |
| Favoritos | recurso | Favoritos | favoritos | Title Case (nome do recurso). | deck (servico_submarca) |
| Lu | persona | Lu · pela Lu · da Lu | inteligência artificial · IA | Conteúdo gerado é atribuído à persona Lu, nunca IA genérica. | site (conteudo_ia_lu) |
| Magazine Luiza / Magalu | nome | Magazine Luiza · Magalu | magazine luiza · magalú | Grafia oficial da marca. | brandbook |
| Mais vendidos | selo | Mais vendidos | Mais Vendidos | Selo em sentence case (diverge da ordenação Mais Vendidos). | site (INC-04) |
| LG · JBL · OMO · TV · CEP · CPF | sigla | LG · JBL · OMO · TV · CEP · CPF | Lg · Jbl · Omo · Tv · Cep | Siglas sempre em caixa alta, conforme grafia oficial. | deck (nome_marca, INC-05) |
| Beleza e Perfumaria | categoria | Beleza e Perfumaria | Beleza E Perfumaria · beleza e perfumaria | Title Case; conjunção e minúscula. | deck (categoria_produto) |
| Utilidades Domésticas | categoria | Utilidades Domésticas | Utilidades domésticas | Title Case (cada palavra principal). | deck (categoria_produto) |
| Celulares e Smartphones | categoria | Celulares e Smartphones | celulares e smartphones | Title Case; e minúsculo. | site (INC-07) |
| TV e Vídeo | categoria | TV e Vídeo | Tv e Vídeo · TV E VÍDEO | Title Case; sigla TV em caixa alta. | site (INC-05) |
| sem juros | expressão | sem juros | Sem Juros · SEM JUROS | Sempre minúsculo, inclusive no parcelamento. | site (preco_pagamento) |
| sacola | léxico | sacola | carrinho | Termo da casa para o cesto de compras. | derivado (De/Para) |
| pague com | léxico | pague com | efetue o pagamento · efetuar pagamento | Linguagem de pessoa pra pessoa. | derivado (De/Para) |
| por / pelo | léxico | por · pelo | através de | Evite através de fora de sentido físico. | derivado (De/Para) |
| ação específica (não clique aqui) | léxico | Ver pedido · Comprar agora · Acompanhar | clique aqui | O CTA descreve a ação, nunca clique aqui. | derivado (De/Para) |
| fazer / criar / pagar | léxico | fazer · criar · pagar | realizar · efetuar | Verbos simples no lugar de formais. | derivado (De/Para) |
| ⟨preencher⟩ | ⟨tipo⟩ | ⟨grafia ✅⟩ | ⟨grafias ❌⟩ | ⟨quando usar⟩ | ⟨fonte⟩ |

> **Tipos:** `marca` · `submarca/serviço` · `selo` · `tag` · `pagamento` ·
> `benefício` · `programa` · `categoria` · `sigla` · `persona` · `nome` ·
> `expressão` · `léxico` · `recurso`.
