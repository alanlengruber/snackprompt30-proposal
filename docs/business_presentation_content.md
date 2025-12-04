# BUSINESS MODEL
# Snack Prompt 3.0

Modelo de negócio, estratégia de monetização e projeções financeiras para a Plataforma de Inteligência Corporativa

Versão: 2.0 (Consolidada e Corrigida)
Data: Dezembro 2025
Audiência: Time de Negócio e Executivo

---

## Modelo de Negócio
Visão Geral do Modelo

O Snack Prompt 3.0 opera em um modelo de marketplace bilateral, conectando criadores de agentes especializados com empresas que buscam soluções de IA corporativa. A plataforma gera receita através de três pilares principais, garantindo resiliência financeira.

#### 40% - Assinaturas SaaS
Receita recorrente de planos PRO e Premium. Cobre custos fixos operacionais (OpEx).

#### 35% - Marketplace
Comissões sobre o uso de agentes especializados. Cobre custos variáveis e gera escala via efeito de rede.

#### 25% - Enterprise
Contratos customizados com SLA, suporte dedicado e infraestrutura isolada. Gera volume de caixa e valuation.

### Proposta de Valor

**1. Para Empresas**
Transforme dados corporativos em inteligência ativa sem risco de vazamento. Acesse agentes especializados criados por experts do setor sem necessidade de desenvolver internamente.

**2. Para Criadores de Agentes**
Monetize seu conhecimento criando agentes especializados. Proteja sua propriedade intelectual com o sistema "Proxy Blindado" e receba **70-85%** da receita gerada pelo seu agente.

**3. Para a Plataforma**
Efeito de rede: quanto mais agentes de qualidade, mais empresas. Quanto mais empresas, mais criadores.

---

## Sistema de Créditos Snack
Mecânica de Créditos e Unit Economics

O sistema de créditos Snack funciona como uma moeda interna que abstrai os custos de IA e simplifica a precificação.

**Taxa de Conversão:** 1 Snack Credit = $0.02

**A Lógica do "Spread" (Margem na Origem):**
Ao vender o crédito a $0.02, criamos uma margem bruta inicial significativa sobre o custo real da infraestrutura (fração de centavo).
*   **Custo Médio IA:** ~$0.002 - $0.01 por interação
*   **Preço de Venda:** $0.02 - $0.10 (dependendo do pacote)
*   **Margem Bruta:** 500% a 900%

*Essa "gordura" inicial é estratégica: ela permite absorver variações de uso (tokens excedentes) e oferecer comissões agressivas aos criadores sem comprometer o caixa.*

**Consumo de Créditos (Exemplos):**
*   Mensagem simples: 1-2 créditos
*   Mensagem com RAG: 3-5 créditos
*   Agente especializado: 5-20 créditos
*   Indexação (1k células): 10 créditos

---

## Modelo de Repasse (Revenue Share)
Estrutura de Comissões e Segregação de Receita

O modelo utiliza uma regra de **Segregação de Receita (Revenue Decoupling)** para proteger a margem da plataforma. O repasse ao criador incide apenas sobre a "Taxa de Inteligência", nunca sobre o custo de infraestrutura.

**Fórmula de Precificação:**
`Preço Final = Custo de Infra (Retido 100% pela Plataforma) + Fee do Criador (Split)`

Exemplo: Se um agente usa um OCR (Custo 5 créditos) e cobra 10 créditos de Fee.
*   **Plataforma retém:** 5 créditos (Integral da Infra) + % do Fee.
*   **Criador recebe:** % do Fee (Split).

**Tabela de Repasse (Sobre o Fee do Criador):**

| Faixa de Receita Mensal | Criador Recebe | Plataforma Retém | Exemplo ($200 Fee) |
| :--- | :--- | :--- | :--- |
| $0 - $200 | 70% | 30% | $140 |
| $201 - $1,000 | 75% | 25% | $150 |
| $1,001 - $4,000 | 80% | 20% | $160 |
| Acima de $4,000 | 85% | 15% | $170 |

**Incentivos:**
*   **Bônus de Performance:** +5% para avaliação > 4.5.
*   **Early Adopter:** Primeiros 100 criadores mantêm 85% permanente.

---

## Casos de Uso Práticos
O Poder do RAG Híbrido

O diferencial da Snack Prompt é o RAG Híbrido: agentes combinam o conhecimento do criador com os dados do usuário.

### 🎯 Comparador de Propostas (B2B/Compras)
Recebe múltiplos documentos, extrai dados e gera matriz comparativa.
*   **Valor:** Decisão em minutos.
*   **Preço Sugerido:** $4/análise.
*   **Split Estimado:** 80% Criador | 20% Plataforma.

### 🎯 Gerador de Contratos (Jurídico)
Gera contratos blindados a partir de briefing e templates validados.
*   **Valor:** Contrato em 5min.
*   **Preço Sugerido:** $5/contrato.
*   **Split Estimado:** 80% Criador | 20% Plataforma.

### 🎯 Due Diligence Automatizada (M&A)
Analisa riscos em balanços e contratos automaticamente.
*   **Valor:** Relatório em horas.
*   **Preço Sugerido:** $30/análise.
*   **Split Estimado:** 85% Criador | 15% Plataforma.

---

## Ferramentas para Agentes (Tools)
Monetização de Infraestrutura

Tools são capacidades especiais. Além de potência, são **Centros de Lucro**: a receita do uso de Tools é retida 100% pela plataforma para cobrir custos de API e gerar margem adicional.

**Exemplos de Custos de Infra (Tools):**
*   **Calculadora Financeira (NPV/TIR):** 2 créditos (Retido pela Plataforma)
*   **OCR Inteligente:** 4 créditos (Retido pela Plataforma)
*   **Extrator de Tabelas:** 5 créditos (Retido pela Plataforma)
*   **Busca na Web/Cotações:** 1 crédito (Retido pela Plataforma)

---

## Agent Builder
Crie Agentes Visualmente com Transparência de Custo

O Agent Builder permite criar fluxos sem código, com uma **Calculadora de Custos em Tempo Real**. Conforme o criador adiciona Tools, o sistema exibe o custo base de infraestrutura, permitindo que ele precifique seu agente acima desse valor.

**Estratégia de Tiers para LLM (Buffer de Risco):**
Para simplificar a cobrança variável de tokens, utilizamos Tiers de preço fixo que já incluem margem de segurança.

*   **Tier Standard (GPT-4o-mini):** Custo base 1 crédito/msg.
*   **Tier Pro (GPT-4o/Claude 3.5):** Custo base 3 créditos/msg.

*Isso transforma custo variável em preço fixo previsível para o usuário.*

---

## Sistema de Citações
Confiança e Compliance

Para resolver a alucinação, cada afirmação da IA é verificável.
*   **Output:** "A taxa é 12% `[1]`."
*   **Ação:** Clique no `[1]` abre o chunk do documento original.
*   **Benefício:** Essencial para vendas Enterprise e setores regulados.

---

## Sistema de Saque (Cash-out)
Segurança Financeira

Fluxo desenhado para proteger o caixa da empresa contra fraudes e chargebacks.
*   **Quarentena:** 14 dias.
*   **Pagamento:** Automático (PIX/Stripe).

### Exemplo Corrigido: Ciclo Completo de Receita

**DIA 1**
• 👤 Usuário compra 100 créditos por $100 (Pacote sem desconto para simplificação)
• 👤 Usuário usa Agente "Advogado Sênior" (Preço: 50 créditos)
• ⚙️ Custo de Infra (Tools usadas): 10 créditos (Retidos pela Plataforma)
• 💰 Fee do Agente: 40 créditos
• 💼 **Seller recebe:** 32 créditos (80% de comissão sobre o Fee)
• 📊 Status: 🔒 $32 PENDING

**DIA 15**
• ⏰ Quarentena expira.
• 💸 Seller solicita saque via PIX.

---

## Custos de IA e Infraestrutura
Breakdown Otimizado

Custo médio por mensagem RAG (5 chunks): $0.01.
Preço médio ao usuário: $0.06 - $0.10.

**Estratégias de Otimização:**
*   Caching de Embeddings (Redução de 70% no custo Jina AI).
*   Quantização de Vetores (Redução de 75% no Qdrant).
*   Contratos de Volume (Desconto progressivo OpenAI).

---

## Planos e Precificação

*   **GRATUITO ($0):** 50 créditos, Chat básico. (Aquisição/PLG).
*   **PRO ($10/mês):** 500 créditos, RAG Híbrido, 10 tabelas. (Retenção).
*   **PREMIUM ($30/mês):** 2.000 créditos, Agentes Marketplace, API. (Monetização).
*   **ENTERPRISE (Custom):** Infra dedicada, SLA. (Margem Alta).

---

## Projeções Financeiras
Cenário Realista (Ano 1)

*   **Break-Even Point:** Mês 6.
*   **MRR (Mês 12):** $47,040.
*   **Lucro Líquido (Ano 1):** $42,000.
*   **Margem Blended:** 40-60% (Combinando Marketplace + Uso Interno).

---

## Métricas de Sucesso
KPIs

*   **LTV/CAC:** 13.3x (Benchmark SaaS: 3x).
*   **CAC:** $36.
*   **LTV:** $480.
*   **NPS:** +45.

---

## Go-to-Market Strategy
Roadmap de Lançamento

1.  **Q1 (Beta Fechado):** Validação PMF com 50 empresas.
2.  **Q2 (Lançamento Público):** Foco em atingir 5k usuários.
3.  **Q3 (Marketplace):** Escala de criadores e parceiros.
4.  **Q4 (Enterprise):** Expansão LATAM e Certificações SOC2.

---

## MCP - Diferencial Competitivo
Model Context Protocol

A estratégia de fosso defensivo (Moat).
*   **Integração:** Snack Prompt dentro do VS Code e Office via MCP.
*   **Vantagem:** Integração "Zero-Code" para empresas.
*   **Diferencial:** <5% dos concorrentes possuem essa tecnologia hoje.

---