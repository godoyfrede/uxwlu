# Documentação Detalhada - Lu Writer

Esta é a documentação aprofundada do **Lu Writer**, um copiloto de UX Writing desenvolvido para escalar e padronizar a criação de conteúdo em interfaces do Magalu.

---

## 1. Visão Geral do Sistema

O Lu Writer foi concebido como uma aplicação Full-Stack (BFF - Backend For Frontend) para garantir a segurança das chaves de API da Inteligência Artificial, oferecendo ao mesmo tempo uma interface de usuário rica, fluida e reativa.

**Objetivo:** Reduzir o atrito cognitivo de Product Designers, PMs e Desenvolvedores ao escrever *copies* (textos de interface), garantindo aderência estrita ao Brandbook do Magalu, regras de capitalização, tom de voz e prevenção de erros em mensagens críticas.

## 2. Arquitetura Técnica

A aplicação é dividida em duas camadas principais que rodam através de um servidor unificado:

*   **Frontend (SPA - Single Page Application):** Desenvolvido em React com Vite. Responsável pelo gerenciamento de estado local, renderização de componentes modulares e comunicação via API REST com o backend.
*   **Backend (API Express):** Desenvolvido em Node.js com Express. Atua como um *proxy seguro* entre a interface do usuário e a API do Google Gemini.

### 2.1 Fluxo de Dados
1. O usuário interage com a interface (React).
2. O React dispara chamadas assíncronas (`fetch`) para endpoints locais (`/api/*`).
3. O Express intercepta a requisição, formata os *prompts* injetando regras de negócios rígidas (ex: *system instructions*) e aciona o SDK `@google/genai`.
4. O Gemini processa o pedido, retornando um JSON estruturado (`responseSchema`).
5. O Express devolve a resposta validada ao Frontend.
6. O Frontend atualiza o estado, renderiza o resultado e salva a interação no `HistoryContext` (Histórico de Sessão).

---

## 3. Detalhamento Funcional (Os 4 Modos)

O núcleo da aplicação se concentra em quatro modos de operação:

### A. Revisar e Validar (`/api/review`)
*   **Propósito:** Auditar textos já escritos pelo usuário.
*   **Como funciona:** O usuário insere um texto, categoria (ex: CTA, Título) e contexto. O backend instrui a IA a analisar contra regras estritas (ex: capitalização de CTAs).
*   **Tratamento Especial:** Identifica "Copies Críticas". Textos relacionados a senhas, pagamentos, LGPD ou erros graves acionam um sinalizador booleano (`isCritical`) que renderiza alertas em tela recomendando "Revisão Humana".
*   **Retorno da IA:** Veredito (Conforme, Ajustar, Não Conforme), lista de problemas, regra fonte, justificativa e sugestão de correção.

### B. Gerar (`/api/generate`)
*   **Propósito:** Criação de conteúdo "do zero" baseado em uma intenção.
*   **Como funciona:** O usuário descreve o que precisa (Ex: "Avisar que o limite do cartão estourou"). A interface permite definir a quantidade de opções desejadas.
*   **Processamento da IA:** A IA gera exatamente o número de *strings* pedidas. Mais do que isso, a IA é instruída a julgar a própria geração, marcando uma das opções como `isRecommended: true` e fornecendo um `reason` (motivo do porquê aquela variação é a melhor para o contexto).

### C. Explicar Regras (`/api/explain`)
*   **Propósito:** Substituir buscas demoradas em PDFs ou sites de documentação de marca.
*   **Como funciona:** Funciona como um oráculo de consulta. O *prompt* força a IA a assumir a persona didática da Lu (brand persona do Magalu).
*   **Formato Obrigatório:** A IA sempre retorna a regra teórica atrelada a dois exemplos práticos obrigatórios: `exampleGood` (✅) e `exampleBad` (❌).

### D. Analisar Tela (`/api/analyze`)
*   **Propósito:** QA (Quality Assurance) visual. Auditar *layouts* prontos antes do *handoff*.
*   **Como funciona:** O usuário faz upload de uma imagem (Base64). O backend utiliza capacidades multimodais do Gemini Flash/Pro para leitura espacial e extração de texto (*OCR semântico*).
*   **Análise Espacial:** A IA detecta a região de cada texto (`Topo`, `Corpo`, `Rodapé`).
*   **Aviso de Legibilidade:** Se a imagem for de baixa qualidade ou tiver contraste ruim, a API retorna `readabilityWarning = true`.

---

## 4. Gestão de Estado e UI

### Histórico de Sessão (`HistoryContext.tsx`)
Para evitar a perda de contexto e de ideias brilhantes geradas pela IA, a aplicação implementa um padrão de cache de sessão.
*   Toda requisição bem-sucedida aos modos gera um objeto `HistoryItem`.
*   O objeto guarda `inputData` (o que foi pedido) e `resultData` (a resposta JSON completa).
*   **Favoritos (Pin):** Os usuários podem marcar itens importantes no histórico (`item.pinned`), alterando a ordem de renderização (favoritos no topo).

### Tom de Voz Global
No `<Layout>`, há um controle de Tom de Voz (*Tone of Voice*).
*   **Auto:** É o padrão atual. A IA decide qual o tom ideal.
*   **Pilares Específicos:** O usuário pode forçar "Para todo mundo" ou "Sempre em movimento". Esse estado (`tone`) é injetado dinamicamente nos *prompts* do backend em todas as chamadas.

---

## 5. Engenharia de Prompts e Modelos de IA (Backend)

O sucesso desta aplicação reside na técnica de *Structured Outputs* (Saídas Estruturadas) aplicada no backend (`server/controllers/ai.controller.ts`).

### Modelo e API Utilizados
A inteligência do copiloto é alimentada pela **API de Inferência LLM interna do Magalu** (`api.inferencia.llm.mglu.io`). 
- Utilizamos a biblioteca padrão `openai` como cliente para realizar as conexões (dada a compatibilidade da interface REST).
- O modelo em uso, tanto para geração de texto quanto para análise de imagem (visão computacional), é o **`google-gemma-4-e4b-it`**.

### Saídas Estruturadas (Structured Outputs)
Ao se comunicar com o LLM (`google-gemma-4-e4b-it`), o backend envia um `response_format` forçado para `json_schema`. Isso assegura que:
1. A IA não devolva parágrafos soltos de texto ou Markdown, impossíveis de componentizar no React.
2. Campos obrigatórios (`required`) forçam a IA a sempre estruturar a resposta com um Veredito, uma Justificativa e uma Fonte.

**Exemplo de Engenharia de Segurança:** No modo "Revisar", se a IA achar o texto inadequado, ela é *obrigada* pelo esquema de dados (*Schema*) a fornecer uma `suggestion` de correção para o usuário.

---

## 6. Escopo de Evolução (Próximos Passos Sugeridos)

Caso o time deseje evoluir o projeto:
1.  **Persistência em Nuvem (Database):** Atualmente o histórico vive no contexto do React (memória do navegador). Conectar um banco de dados (ex: Firebase Firestore ou PostgreSQL) permitiria que times compartilhassem *queries* de UX Writing entre si.
2.  **Plugin de Figma:** Como a API já avalia imagens e retorna JSONs estruturados apontando erros por região, é possível plugar este mesmo Node.js Backend a um Plugin do Figma para corrigir textos diretamente no canvas do designer.
3.  **Filtro de Linguagem:** Adicionar camadas prévias de validação contra glossários negativos de palavras proibidas pela marca.


## 7. Exportando o Projeto (Download)

Para fazer o download ou exportar este projeto completo para o seu ambiente local ou GitHub:

No ambiente do **Google AI Studio**, você pode exportar a aplicação clicando no ícone de opções (Settings) ou no menu superior, e escolhendo **Export to ZIP** ou **Export to GitHub**.

Dessa forma, você levará o código fonte integral, incluindo o servidor (Backend), a interface (React Frontend) e esta documentação.
