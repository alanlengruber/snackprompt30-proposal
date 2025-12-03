// Roadmap Data - Snack Prompt 3.0
// 70 Features | 421 Story Points | 11 Sprints | 22 weeks

export type StoryStatus = "pending" | "in_progress" | "completed";
export type Complexity = "simple" | "medium" | "hard" | "very_hard";
export type Responsible = "Backend Python" | "Backend Go" | "Frontend 1" | "Frontend 2" | "Backend Go + Python";
export type StoryType = "Core" | "UI" | "UX" | "Integration" | "Security" | "Tool" | "Compliance" | "Product";
export type Team = "Engineering" | "Product";

export interface Story {
  id: string;
  item: string;
  feature: string;
  points: number;
  responsible: Responsible;
  sprint: string;
  status: StoryStatus;
  type: StoryType;
  complexity: Complexity;
  note: string;
  device: string;
  team: Team;
  functionality: string;
}

export interface Epic {
  id: string;
  title: string;
  stories: Story[];
}

export interface Phase {
  id: string;
  title: string;
  shortTitle: string;
  sprints: number;
  storyPoints: number;
  duration: string;
  status: StoryStatus;
  color: string;
  epics: Epic[];
  milestones: string[];
}

export const phases: Phase[] = [
  {
    id: "phase-0",
    title: "Fase 0: Fundacao",
    shortTitle: "Fundacao",
    sprints: 1,
    storyPoints: 28,
    duration: "2 semanas",
    status: "pending",
    color: "slate",
    milestones: [
      "AI Engine respondendo em /health",
      "Integracao Go-Python funcionando",
      "Qdrant configurado"
    ],
    epics: [
      {
        id: "epic-0-1",
        title: "Setup AI Engine",
        stories: [
          { id: "F0-004", item: "FastAPI AI Engine Base", feature: "AI Engine - Infraestrutura", points: 5, responsible: "Backend Python", sprint: "S1", status: "pending", type: "Core", complexity: "simple", note: "Servico FastAPI com estrutura modular, health check, configuracao por ambiente (dev/staging/prod). Inclui setup de Poetry, pytest e estrutura de pastas.", device: "API", team: "Engineering", functionality: "Base para todo processamento de IA, escalabilidade horizontal, monitoramento" },
          { id: "F0-005", item: "Integracao Go-Python", feature: "AI Engine - Infraestrutura", points: 5, responsible: "Backend Go + Python", sprint: "S1", status: "pending", type: "Core", complexity: "medium", note: "Webhook/endpoint no Go que dispara chamadas para o AI Engine Python. Autenticacao via JWT interno com secret compartilhado. Retry com exponential backoff.", device: "API", team: "Engineering", functionality: "Comunicacao segura entre backends, desacoplamento de servicos" },
          { id: "F0-006", item: "Wrapper Multi-LLM", feature: "AI Engine - LLM", points: 5, responsible: "Backend Python", sprint: "S1", status: "pending", type: "Core", complexity: "medium", note: "Factory pattern para instanciar OpenAI, Anthropic ou outros providers. Abstracao de interface comum. Fallback automatico entre providers. Suporte a streaming.", device: "API", team: "Engineering", functionality: "Flexibilidade de providers, resiliencia, otimizacao de custos" },
          { id: "F0-007", item: "Wrapper Jina Embeddings", feature: "AI Engine - Embeddings", points: 5, responsible: "Backend Python", sprint: "S1", status: "pending", type: "Core", complexity: "simple", note: "Cliente Jina AI v3 com Matryoshka representation (512 dims). Retry com backoff, caching de embeddings frequentes, batch processing para eficiencia.", device: "API", team: "Engineering", functionality: "Embeddings de alta qualidade, otimizacao de custos com dimensoes reduzidas" },
          { id: "F0-008", item: "Cliente Qdrant", feature: "AI Engine - Vector DB", points: 5, responsible: "Backend Python", sprint: "S1", status: "pending", type: "Core", complexity: "medium", note: "Configuracao de collections por ambiente. Indices otimizados com HNSW. Filtros por user_id, table_id. Suporte a hybrid search (dense + sparse vectors).", device: "API", team: "Engineering", functionality: "Busca vetorial performatica, multi-tenancy, isolamento de dados" },
          { id: "F0-009", item: "Logging Estruturado", feature: "AI Engine - Observability", points: 3, responsible: "Backend Python", sprint: "S1", status: "pending", type: "Core", complexity: "simple", note: "Logs em JSON com correlation_id para rastreamento. Integracao com Sentry para erros. Metricas de latencia e tokens consumidos.", device: "API", team: "Engineering", functionality: "Debug, auditoria, monitoramento de custos, troubleshooting" },
        ]
      }
    ]
  },
  {
    id: "phase-1",
    title: "Fase 1: MVP Chat",
    shortTitle: "MVP Chat",
    sprints: 3,
    storyPoints: 102,
    duration: "6 semanas",
    status: "pending",
    color: "blue",
    milestones: [
      "Tabelas sendo indexadas automaticamente no Qdrant",
      "Chat funcionando com respostas baseadas nas KBs do usuario",
      "Citacoes clicaveis levando a fonte",
      "Streaming funcionando"
    ],
    epics: [
      {
        id: "epic-1-1",
        title: "Ingestao de Dados (Data Pipeline)",
        stories: [
          { id: "F1-001", item: "JSON to LlamaIndex Parser", feature: "Data Pipeline - Ingestao", points: 8, responsible: "Backend Python", sprint: "S2", status: "pending", type: "Core", complexity: "hard", note: "Endpoint POST /ingest que recebe JSON da tabela Snack Prompt. Converte estrutura hierarquica (Tabela > Coluna > Celula) para documentos LlamaIndex preservando metadados.", device: "API", team: "Engineering", functionality: "Transformar dados estruturados em formato vetorizavel, manter rastreabilidade" },
          { id: "F1-002", item: "HierarchicalNodeParser", feature: "Data Pipeline - Ingestao", points: 8, responsible: "Backend Python", sprint: "S2", status: "pending", type: "Core", complexity: "hard", note: "Parser customizado que cria chunks em 3 niveis: Tabela (2048 tokens), Coluna (512 tokens), Celula (128 tokens). Mantem referencias pai-filho para citacoes precisas.", device: "API", team: "Engineering", functionality: "Contexto hierarquico nas buscas, citacoes precisas ate nivel de celula" },
          { id: "F1-003", item: "Embeddings + Qdrant Upsert", feature: "Data Pipeline - Ingestao", points: 5, responsible: "Backend Python", sprint: "S2", status: "pending", type: "Core", complexity: "medium", note: "Gera embeddings via Jina AI e faz upsert no Qdrant com payload rico: snack_table_id, snack_column_id, snack_item_id, text_content, source_url, access_level.", device: "API", team: "Engineering", functionality: "Indexacao eficiente, metadados para citacoes e controle de acesso" },
          { id: "F1-004", item: "Webhook Table Saved", feature: "Data Pipeline - Integracao", points: 5, responsible: "Backend Go", sprint: "S2", status: "pending", type: "Integration", complexity: "medium", note: "Evento disparado quando usuario salva tabela no frontend. Envia payload JSON completo para fila de processamento do AI Engine. Garante entrega com retry.", device: "API", team: "Engineering", functionality: "Sincronizacao automatica de dados, consistencia eventual" },
          { id: "F1-005", item: "Fila Assincrona Redis", feature: "Data Pipeline - Ingestao", points: 8, responsible: "Backend Python", sprint: "S3", status: "pending", type: "Core", complexity: "hard", note: "Worker que consome fila Redis (ou BullMQ). Processamento em background para nao bloquear UI. Dead letter queue para falhas. Dashboard de monitoramento.", device: "API", team: "Engineering", functionality: "Nao bloquear UX durante indexacao, resiliencia a falhas" },
        ]
      },
      {
        id: "epic-1-2",
        title: "Chat RAG Basico",
        stories: [
          { id: "F1-006", item: "Endpoint /chat RAG", feature: "Chat - Backend", points: 8, responsible: "Backend Python", sprint: "S3", status: "pending", type: "Core", complexity: "hard", note: "POST /chat com query, user_id, table_ids[]. Faz retrieval no Qdrant, monta contexto, chama LLM, retorna resposta estruturada com source_documents.", device: "API", team: "Engineering", functionality: "Core do produto: conversar com dados do usuario" },
          { id: "F1-007", item: "Filtro Multi-tenant Qdrant", feature: "Chat - Backend", points: 5, responsible: "Backend Python", sprint: "S3", status: "pending", type: "Security", complexity: "medium", note: "Filtro obrigatorio por user_id em todas as queries. Garante que usuario so acessa seus proprios dados. Implementado como middleware/decorator.", device: "API", team: "Engineering", functionality: "Seguranca de dados, isolamento entre usuarios, compliance" },
          { id: "F1-008", item: "Streaming SSE", feature: "Chat - Backend", points: 8, responsible: "Backend Python", sprint: "S3", status: "pending", type: "UX", complexity: "hard", note: "Server-Sent Events para streaming de resposta token a token. Implementacao com FastAPI StreamingResponse. Heartbeat para keep-alive. Tratamento de desconexao.", device: "API", team: "Engineering", functionality: "UX de digitacao em tempo real, feedback imediato ao usuario" },
          { id: "F1-009", item: "Source Documents Response", feature: "Chat - Backend", points: 5, responsible: "Backend Python", sprint: "S3", status: "pending", type: "Core", complexity: "medium", note: "Resposta inclui array de source_documents com page_content, metadata (table_id, column_id, item_id, score). Base para sistema de citacoes.", device: "API", team: "Engineering", functionality: "Rastreabilidade, base para citacoes clicaveis" },
        ]
      },
      {
        id: "epic-1-3",
        title: "Sistema de Citacoes",
        stories: [
          { id: "F1-010", item: "Citation Processor", feature: "Citations - Backend", points: 5, responsible: "Backend Python", sprint: "S4", status: "pending", type: "Core", complexity: "hard", note: "Processa source_documents e gera Citation[] estruturadas. Extrai snippet relevante, calcula relevance_score, gera deep_link para celula original.", device: "API", team: "Engineering", functionality: "Citacoes verificaveis, diferencial competitivo, confianca" },
          { id: "F1-011", item: "Citation Injector", feature: "Citations - Backend", points: 8, responsible: "Backend Python", sprint: "S4", status: "pending", type: "Core", complexity: "hard", note: "Usa LLM secundario para identificar pontos de citacao no texto e injetar [1], [2], etc. Mapeia referencias para Citation objects. Evita citacoes redundantes.", device: "API", team: "Engineering", functionality: "Texto com referencias inline, padrao academico de citacao" },
          { id: "F1-012", item: "Deep Link Generator", feature: "Citations - Backend", points: 3, responsible: "Backend Python", sprint: "S4", status: "pending", type: "Core", complexity: "simple", note: "Gera URLs /kb/{table_id}/item/{item_id} para navegacao direta a celula citada. Inclui highlight da celula na UI destino.", device: "API", team: "Engineering", functionality: "Verificacao com um clique, auditabilidade" },
        ]
      },
      {
        id: "epic-1-4",
        title: "Interface de Chat",
        stories: [
          { id: "F1-013", item: "Chat UI Component", feature: "Chat - Frontend", points: 8, responsible: "Frontend 1", sprint: "S3", status: "pending", type: "UI", complexity: "hard", note: "Componente React com input, historico de mensagens, avatars, timestamps, loading states, scroll automatico. Suporte a markdown nas respostas.", device: "Desktop/Mobile", team: "Product", functionality: "Interface principal de interacao com IA" },
          { id: "F1-014", item: "Streaming Renderer", feature: "Chat - Frontend", points: 5, responsible: "Frontend 1", sprint: "S3", status: "pending", type: "UX", complexity: "medium", note: "Renderizacao progressiva de tokens conforme chegam via SSE. Efeito de digitacao. Buffer inteligente para evitar flickering.", device: "Desktop/Mobile", team: "Product", functionality: "UX fluida, feedback visual imediato" },
          { id: "F1-015", item: "CitationRenderer Component", feature: "Citations - Frontend", points: 8, responsible: "Frontend 2", sprint: "S4", status: "pending", type: "UI", complexity: "hard", note: "Detecta [1], [2] no texto e transforma em badges clicaveis. Tooltip com preview da fonte. Cores diferenciadas por tipo de fonte.", device: "Desktop/Mobile", team: "Product", functionality: "Citacoes interativas, verificacao rapida" },
          { id: "F1-016", item: "CitationDrawer Component", feature: "Citations - Frontend", points: 5, responsible: "Frontend 2", sprint: "S4", status: "pending", type: "UI", complexity: "medium", note: "Sheet lateral que abre ao clicar em citacao. Mostra: breadcrumb (Tabela > Coluna > Linha), conteudo completo da celula, score de relevancia, botao Abrir na KB.", device: "Desktop/Mobile", team: "Product", functionality: "Contexto completo da fonte, navegacao para origem" },
          { id: "F1-017", item: "KB Selector", feature: "Chat - Frontend", points: 5, responsible: "Frontend 1", sprint: "S4", status: "pending", type: "UI", complexity: "medium", note: "Dropdown/multi-select para escolher com quais tabelas conversar. Mostra nome, icone, contagem de itens. Suporte a busca e favoritos.", device: "Desktop/Mobile", team: "Product", functionality: "Controle de escopo da conversa, organizacao" },
          { id: "F1-018", item: "Chat History Persistence", feature: "Chat - Frontend", points: 5, responsible: "Frontend 2", sprint: "S4", status: "pending", type: "Core", complexity: "medium", note: "Salva historico de mensagens por sessao no localStorage ou backend. Recupera ao reabrir. Opcao de limpar historico.", device: "Desktop/Mobile", team: "Product", functionality: "Continuidade de conversas, contexto preservado" },
        ]
      }
    ]
  },
  {
    id: "phase-2",
    title: "Fase 2: Agentes Inteligentes",
    shortTitle: "Agentes",
    sprints: 4,
    storyPoints: 157,
    duration: "8 semanas",
    status: "pending",
    color: "green",
    milestones: [
      "Agent Builder funcional com React Flow",
      "Pelo menos 3 Tools implementadas",
      "RAG Hibrido funcionando",
      "Usuario consegue criar, testar e usar agentes proprios",
      "Templates disponiveis para quickstart"
    ],
    epics: [
      {
        id: "epic-2-1",
        title: "Agent Runtime (LangGraph)",
        stories: [
          { id: "F2-001", item: "LangGraph StateGraph Base", feature: "Agent Runtime", points: 8, responsible: "Backend Python", sprint: "S5", status: "pending", type: "Core", complexity: "hard", note: "StateGraph com nodes basicos: InputNode (recebe query), RAGNode (busca contexto), LLMNode (gera resposta), OutputNode (formata saida). Estado tipado com Pydantic.", device: "API", team: "Engineering", functionality: "Fundacao para agentes customizaveis, fluxos deterministicos" },
          { id: "F2-002", item: "Loop/Retry Support", feature: "Agent Runtime", points: 8, responsible: "Backend Python", sprint: "S5", status: "pending", type: "Core", complexity: "hard", note: "Conditional edges que permitem loops: se score < threshold, volta para RAGNode com query reformulada. Limite de iteracoes para evitar loops infinitos.", device: "API", team: "Engineering", functionality: "Auto-correcao, qualidade de resposta, robustez" },
          { id: "F2-003", item: "Checkpointer Memory", feature: "Agent Runtime", points: 5, responsible: "Backend Python", sprint: "S5", status: "pending", type: "Core", complexity: "medium", note: "Persistencia de estado entre interacoes usando Redis/Postgres. Permite conversas longas com memoria. TTL configuravel. Resumo automatico de contexto antigo.", device: "API", team: "Engineering", functionality: "Conversas multi-turn, contexto de longo prazo" },
          { id: "F2-004", item: "JSON to StateGraph Compiler", feature: "Agent Runtime", points: 13, responsible: "Backend Python", sprint: "S6", status: "pending", type: "Core", complexity: "very_hard", note: "Recebe definicao de agente em JSON (do React Flow) e compila para StateGraph executavel. Validacao de schema, resolucao de dependencias entre nodes.", device: "API", team: "Engineering", functionality: "Habilita Agent Builder visual, low-code para criadores" },
        ]
      },
      {
        id: "epic-2-2",
        title: "Sistema de Tools",
        stories: [
          { id: "F2-005", item: "Tool Registry", feature: "Tools System", points: 8, responsible: "Backend Python", sprint: "S5", status: "pending", type: "Core", complexity: "hard", note: "Registro central de tools com: id, name, description, inputSchema (JSON Schema), outputSchema, permissions (plans), rateLimit, costCredits. API para listar tools disponiveis.", device: "API", team: "Engineering", functionality: "Catalogo de capacidades, controle de acesso, billing" },
          { id: "F2-006", item: "Tool: Calculadora Financeira", feature: "Tools System", points: 5, responsible: "Backend Python", sprint: "S6", status: "pending", type: "Tool", complexity: "medium", note: "Funcoes: NPV, IRR, PMT, FV, PV, taxa equivalente, amortizacao (SAC, Price). Input validado, output estruturado com explicacao do calculo.", device: "API", team: "Product", functionality: "Agentes financeiros, analise de investimentos" },
          { id: "F2-007", item: "Tool: Extrator PDF (Docling)", feature: "Tools System", points: 8, responsible: "Backend Python", sprint: "S6", status: "pending", type: "Tool", complexity: "hard", note: "Integracao com Docling (IBM) para extrair tabelas de PDFs. OCR para documentos escaneados. Output em markdown estruturado preservando layout de tabelas.", device: "API", team: "Product", functionality: "Ingestao de documentos, due diligence, analise de contratos" },
          { id: "F2-008", item: "Tool: Gerador de Documentos", feature: "Tools System", points: 8, responsible: "Backend Python", sprint: "S7", status: "pending", type: "Tool", complexity: "hard", note: "Preenche templates (DOCX, PDF) com dados do contexto. Suporte a placeholders, loops, condicionais. Output em multiplos formatos.", device: "API", team: "Product", functionality: "Geracao de contratos, relatorios, propostas" },
          { id: "F2-009", item: "Tool Sandbox Execution", feature: "Tools System", points: 8, responsible: "Backend Python", sprint: "S6", status: "pending", type: "Security", complexity: "hard", note: "Execucao de tools em ambiente isolado (Docker/Firecracker). Timeout de 30s. Memory limit. Network isolation para tools que nao precisam de internet.", device: "API", team: "Engineering", functionality: "Seguranca, protecao contra codigo malicioso" },
          { id: "F2-010", item: "Tool Audit Logging", feature: "Tools System", points: 5, responsible: "Backend Python", sprint: "S7", status: "pending", type: "Compliance", complexity: "medium", note: "Log de todas execucoes: tool_id, user_id, agent_id, input, output, duration_ms, credits_consumed. Queryable para billing e debug.", device: "API", team: "Engineering", functionality: "Auditoria, billing preciso, troubleshooting" },
        ]
      },
      {
        id: "epic-2-3",
        title: "RAG Hibrido (Multi-KB)",
        stories: [
          { id: "F2-011", item: "RAG Hibrido Multi-KB", feature: "RAG System", points: 8, responsible: "Backend Python", sprint: "S7", status: "pending", type: "Core", complexity: "very_hard", note: "Retrieval que combina KB do criador do agente + KB do usuario no mesmo contexto. Filtro Qdrant com should clause para multiplos table_ids com diferentes access_levels.", device: "API", team: "Engineering", functionality: "Modelo Caixa Preta, expertise + dados do cliente" },
          { id: "F2-012", item: "Access Control KB Secreta", feature: "RAG System", points: 5, responsible: "Backend Python", sprint: "S7", status: "pending", type: "Security", complexity: "hard", note: "Usuario recebe resposta baseada na KB secreta mas nunca ve o conteudo raw. Citations mostram apenas Fonte: Base do Agente sem expor dados. Logs nao registram conteudo sensivel.", device: "API", team: "Engineering", functionality: "Protecao de IP do criador, modelo de negocio viavel" },
          { id: "F2-013", item: "Citation Source Tagging", feature: "RAG System", points: 5, responsible: "Backend Python", sprint: "S7", status: "pending", type: "Core", complexity: "medium", note: "Citacoes identificam origem: Base do Agente vs Seus Documentos. Cores diferenciadas na UI. Permite auditoria de quais fontes contribuiram.", device: "API", team: "Product", functionality: "Transparencia, entendimento de origem das respostas" },
        ]
      },
      {
        id: "epic-2-4",
        title: "Agent Builder (React Flow)",
        stories: [
          { id: "F2-014", item: "React Flow Canvas", feature: "Agent Builder", points: 8, responsible: "Frontend 1", sprint: "S5", status: "pending", type: "UI", complexity: "very_hard", note: "Canvas drag-and-drop usando @xyflow/react. Zoom, pan, minimap. Snap to grid. Undo/redo. Keyboard shortcuts. Auto-layout com dagre.", device: "Desktop", team: "Product", functionality: "Interface visual para construcao de agentes" },
          { id: "F2-015", item: "Node Palette", feature: "Agent Builder", points: 8, responsible: "Frontend 1", sprint: "S5", status: "pending", type: "UI", complexity: "hard", note: "Sidebar com nodes draggaveis: Input, LLM, KB Lookup, Tool, Condition, Loop, Output, Human. Cada node com icone e descricao.", device: "Desktop", team: "Product", functionality: "Descoberta de capacidades, construcao intuitiva" },
          { id: "F2-016", item: "Node Config Panel", feature: "Agent Builder", points: 8, responsible: "Frontend 2", sprint: "S6", status: "pending", type: "UI", complexity: "hard", note: "Panel lateral que aparece ao selecionar node. Formularios dinamicos baseados no tipo: LLM (model, temperature), KB (selecionar tabelas), Tool (selecionar tool), etc.", device: "Desktop", team: "Product", functionality: "Configuracao detalhada de cada step do agente" },
          { id: "F2-017", item: "Edge Validation", feature: "Agent Builder", points: 5, responsible: "Frontend 1", sprint: "S6", status: "pending", type: "UX", complexity: "medium", note: "Validacao visual de conexoes: verde=valida, vermelho=invalida. Regras: Input so conecta como source, Output so como target. Cycles detectados e alertados.", device: "Desktop", team: "Product", functionality: "Prevencao de erros, feedback visual imediato" },
          { id: "F2-018", item: "Agent Tester", feature: "Agent Builder", points: 8, responsible: "Frontend 2", sprint: "S7", status: "pending", type: "UI", complexity: "hard", note: "Modal de teste com input de exemplo. Executa agente em modo debug mostrando cada node executado, tempo, tokens. Log de execucao expandivel.", device: "Desktop", team: "Product", functionality: "Iteracao rapida, debug de fluxos" },
          { id: "F2-019", item: "Flow Persistence", feature: "Agent Builder", points: 5, responsible: "Frontend 1", sprint: "S7", status: "pending", type: "Core", complexity: "medium", note: "Salvar/carregar fluxo no banco. Auto-save a cada mudanca. Versionamento (historico de versoes). Export como JSON/YAML.", device: "Desktop", team: "Product", functionality: "Nao perder trabalho, colaboracao, backup" },
          { id: "F2-020", item: "Agent Templates", feature: "Agent Builder", points: 5, responsible: "Frontend 2", sprint: "S8", status: "pending", type: "Product", complexity: "medium", note: "Galeria de templates pre-construidos: Assistente Juridico, Analista Financeiro, Consultor de RH, etc. One-click para criar copia editavel.", device: "Desktop", team: "Product", functionality: "Aceleracao de onboarding, inspiracao, best practices" },
          { id: "F2-021", item: "Agent Preview Mode", feature: "Agent Builder", points: 5, responsible: "Frontend 1", sprint: "S8", status: "pending", type: "UX", complexity: "medium", note: "Modo preview que simula experiencia do usuario final. Esconde interface de edicao. Permite testar UX completa antes de publicar.", device: "Desktop", team: "Product", functionality: "QA antes de publicar, experiencia real" },
        ]
      },
      {
        id: "epic-2-5",
        title: "CRUD de Agentes",
        stories: [
          { id: "F2-022", item: "Agents Table Schema", feature: "Agent CRUD", points: 5, responsible: "Backend Go", sprint: "S5", status: "pending", type: "Core", complexity: "medium", note: "Tabela PostgreSQL: id, user_id, name, description, icon, flow_json, visibility (private/public/marketplace), price_credits, created_at, updated_at. Indices otimizados.", device: "API", team: "Engineering", functionality: "Persistencia de agentes, queries eficientes" },
          { id: "F2-023", item: "Agents CRUD Endpoints", feature: "Agent CRUD", points: 5, responsible: "Backend Go", sprint: "S6", status: "pending", type: "Core", complexity: "medium", note: "REST API: POST /agents, GET /agents/:id, PUT /agents/:id, DELETE /agents/:id, GET /agents (list com paginacao e filtros). Validacao de ownership.", device: "API", team: "Engineering", functionality: "Gerenciamento de agentes via API" },
          { id: "F2-024", item: "Agent-KB Relationship", feature: "Agent CRUD", points: 5, responsible: "Backend Go", sprint: "S6", status: "pending", type: "Core", complexity: "medium", note: "Tabela pivot agent_knowledge_bases. Many-to-many. Cascade delete. Endpoint para vincular/desvincular KBs de um agente.", device: "API", team: "Engineering", functionality: "Associar bases de conhecimento a agentes" },
          { id: "F2-025", item: "My Agents Page", feature: "Agent Management", points: 5, responsible: "Frontend 2", sprint: "S7", status: "pending", type: "UI", complexity: "medium", note: "Lista de agentes do usuario em grid/list view. Cards com nome, descricao, stats (usos, rating). Acoes: editar, duplicar, excluir, publicar no marketplace.", device: "Desktop", team: "Product", functionality: "Gerenciamento centralizado de agentes" },
        ]
      }
    ]
  },
  {
    id: "phase-3",
    title: "Fase 3: Marketplace e Economia",
    shortTitle: "Marketplace",
    sprints: 3,
    storyPoints: 134,
    duration: "6 semanas",
    status: "pending",
    color: "purple",
    milestones: [
      "Usuarios podem comprar creditos",
      "Agentes premium funcionando com cobranca",
      "Marketplace com busca e filtros",
      "Sellers recebem comissao",
      "Cash-out via PIX funcionando"
    ],
    epics: [
      {
        id: "epic-3-1",
        title: "Sistema de Creditos",
        stories: [
          { id: "F3-001", item: "Credit Wallets Table", feature: "Credits System", points: 5, responsible: "Backend Go", sprint: "S9", status: "pending", type: "Core", complexity: "medium", note: "Tabela: user_id, balance, currency. Tabela de transacoes: id, wallet_id, type (credit/debit), amount, reference, created_at. Constraints para evitar saldo negativo.", device: "API", team: "Engineering", functionality: "Economia interna, controle de gastos" },
          { id: "F3-002", item: "Wallet Endpoints", feature: "Credits System", points: 5, responsible: "Backend Go", sprint: "S9", status: "pending", type: "Core", complexity: "medium", note: "GET /wallet (saldo atual), GET /wallet/transactions (historico com paginacao), POST /wallet/topup (adicionar creditos). Webhooks para integracoes.", device: "API", team: "Engineering", functionality: "Consulta de saldo e historico" },
          { id: "F3-003", item: "Payment Gateway Integration", feature: "Credits System", points: 13, responsible: "Backend Go", sprint: "S9", status: "pending", type: "Integration", complexity: "very_hard", note: "Integracao Stripe (internacional) + Pagar.me (Brasil). Checkout session, webhooks de confirmacao, tratamento de falhas, retry. Suporte a PIX, cartao, boleto.", device: "API", team: "Engineering", functionality: "Monetizacao, compra de creditos" },
          { id: "F3-004", item: "Auto-Debit on Agent Use", feature: "Credits System", points: 8, responsible: "Backend Go", sprint: "S10", status: "pending", type: "Core", complexity: "hard", note: "Apos execucao de agente premium, debita creditos da wallet do usuario. Calculo: tokens_used * rate + tool_costs + base_fee. Transacao atomica. Block se saldo insuficiente.", device: "API", team: "Engineering", functionality: "Cobranca por uso, economia sustentavel" },
          { id: "F3-005", item: "Token Usage Reporter", feature: "Credits System", points: 3, responsible: "Backend Python", sprint: "S9", status: "pending", type: "Core", complexity: "simple", note: "Retorna ao Go: input_tokens, output_tokens, model_used, tools_executed. Base para calculo de custos. Inclui breakdown por node executado.", device: "API", team: "Engineering", functionality: "Transparencia de custos, billing preciso" },
        ]
      },
      {
        id: "epic-3-2",
        title: "Modelo de Repasse",
        stories: [
          { id: "F3-006", item: "Revenue Split Engine", feature: "Revenue Share", points: 8, responsible: "Backend Go", sprint: "S10", status: "pending", type: "Core", complexity: "hard", note: "Apos uso de agente premium, split automatico: 40% para pool de custos IA, 40% para plataforma, 20% para seller. Configuravel por agente. Registro de cada split.", device: "API", team: "Engineering", functionality: "Modelo economico sustentavel, incentivo para criadores" },
          { id: "F3-007", item: "Seller Earnings Table", feature: "Revenue Share", points: 5, responsible: "Backend Go", sprint: "S10", status: "pending", type: "Core", complexity: "medium", note: "Tabela: seller_id, agent_id, amount, status (pending/available/withdrawn), available_at (data de liberacao), created_at. Indices para queries de dashboard.", device: "API", team: "Engineering", functionality: "Tracking de ganhos, quarentena" },
          { id: "F3-008", item: "Quarantine Release Job", feature: "Revenue Share", points: 5, responsible: "Backend Go", sprint: "S10", status: "pending", type: "Core", complexity: "medium", note: "Cron job diario que muda status de pending para available apos 14 dias. Notifica seller por email. Logs de liberacao para auditoria.", device: "API", team: "Engineering", functionality: "Protecao contra chargebacks, liberacao automatica" },
        ]
      },
      {
        id: "epic-3-3",
        title: "Marketplace",
        stories: [
          { id: "F3-009", item: "Marketplace Page", feature: "Marketplace", points: 8, responsible: "Frontend 1", sprint: "S9", status: "pending", type: "UI", complexity: "hard", note: "Grid de agentes publicos com cards: nome, descricao, rating, preco, autor. Filtros: categoria, preco, rating. Ordenacao: popular, recente, preco. Busca full-text.", device: "Desktop/Mobile", team: "Product", functionality: "Descoberta de agentes, economia de criadores" },
          { id: "F3-010", item: "Agent Detail Page", feature: "Marketplace", points: 5, responsible: "Frontend 1", sprint: "S10", status: "pending", type: "UI", complexity: "medium", note: "Pagina completa: descricao longa, screenshots, reviews, informacoes do criador, preco, botao Usar Agente. Secao de FAQs. Agentes relacionados.", device: "Desktop/Mobile", team: "Product", functionality: "Convencimento para uso, informacao completa" },
          { id: "F3-011", item: "Purchase/Use Flow", feature: "Marketplace", points: 8, responsible: "Frontend 2", sprint: "S10", status: "pending", type: "UX", complexity: "hard", note: "Fluxo: verificar saldo, confirmar uso, debitar, abrir chat com agente. Modal de confirmacao com custo estimado. Opcao de comprar mais creditos se insuficiente.", device: "Desktop/Mobile", team: "Product", functionality: "Conversao, UX de compra frictionless" },
          { id: "F3-012", item: "Marketplace Search API", feature: "Marketplace", points: 5, responsible: "Backend Go", sprint: "S9", status: "pending", type: "Core", complexity: "medium", note: "GET /marketplace/agents com filtros: category, min_price, max_price, min_rating, sort_by. Full-text search em nome e descricao. Paginacao eficiente.", device: "API", team: "Engineering", functionality: "Backend para pagina de marketplace" },
          { id: "F3-013", item: "Rating System", feature: "Marketplace", points: 5, responsible: "Backend Go", sprint: "S11", status: "pending", type: "Core", complexity: "medium", note: "POST /agents/:id/reviews (rating 1-5, comentario). GET /agents/:id/reviews. Um review por usuario por agente. Media calculada e cacheada. Moderacao basica.", device: "API", team: "Product", functionality: "Social proof, qualidade do marketplace" },
        ]
      },
      {
        id: "epic-3-4",
        title: "Dashboard do Seller",
        stories: [
          { id: "F3-014", item: "Seller Dashboard", feature: "Seller Portal", points: 8, responsible: "Frontend 2", sprint: "S10", status: "pending", type: "UI", complexity: "hard", note: "Visao geral: saldo total, disponivel, pendente. Cards com metricas: vendas hoje, esta semana, este mes. Lista de agentes com performance individual.", device: "Desktop", team: "Product", functionality: "Visibilidade de ganhos, motivacao de criadores" },
          { id: "F3-015", item: "Earnings Chart", feature: "Seller Portal", points: 5, responsible: "Frontend 2", sprint: "S11", status: "pending", type: "UI", complexity: "medium", note: "Grafico de linha com ganhos dos ultimos 30 dias. Hover mostra valor do dia. Comparacao com periodo anterior. Export de dados.", device: "Desktop", team: "Product", functionality: "Tendencias, acompanhamento de performance" },
          { id: "F3-016", item: "Transaction History", feature: "Seller Portal", points: 5, responsible: "Frontend 1", sprint: "S11", status: "pending", type: "UI", complexity: "medium", note: "Tabela com todas transacoes: data, tipo (venda/saque), agente, valor, status. Filtros por periodo e tipo. Export CSV.", device: "Desktop", team: "Product", functionality: "Detalhamento, reconciliacao financeira" },
          { id: "F3-017", item: "Withdrawal Request Form", feature: "Seller Portal", points: 5, responsible: "Frontend 1", sprint: "S11", status: "pending", type: "UI", complexity: "medium", note: "Formulario: valor (validado contra disponivel), metodo (PIX/TED/PayPal), dados bancarios (salvos ou novos). Confirmacao com codigo SMS/email.", device: "Desktop", team: "Product", functionality: "Solicitacao de saque, seguranca" },
        ]
      },
      {
        id: "epic-3-5",
        title: "Cash-out",
        stories: [
          { id: "F3-018", item: "Withdrawal Endpoint", feature: "Cash-out", points: 5, responsible: "Backend Go", sprint: "S11", status: "pending", type: "Core", complexity: "medium", note: "POST /wallet/withdraw. Validacoes: saldo suficiente, valor minimo, dados bancarios validos, limite diario/mensal. Cria registro em status pending.", device: "API", team: "Engineering", functionality: "Processamento de saques" },
          { id: "F3-019", item: "PIX Integration", feature: "Cash-out", points: 13, responsible: "Backend Go", sprint: "S11", status: "pending", type: "Integration", complexity: "very_hard", note: "Integracao com PSP (ex: Pagar.me, Asaas) para transferencias PIX automaticas. Geracao de chave PIX, validacao de destinatario, webhooks de confirmacao.", device: "API", team: "Engineering", functionality: "Saques instantaneos no Brasil" },
          { id: "F3-020", item: "Withdrawal Queue Processor", feature: "Cash-out", points: 5, responsible: "Backend Go", sprint: "S11", status: "pending", type: "Core", complexity: "hard", note: "Worker que processa fila de saques. Estados: pending, processing, completed/failed. Retry para falhas temporarias. Alertas para falhas criticas.", device: "API", team: "Engineering", functionality: "Processamento assincrono, resiliencia" },
          { id: "F3-021", item: "Withdrawal Notifications", feature: "Cash-out", points: 5, responsible: "Backend Go", sprint: "S11", status: "pending", type: "UX", complexity: "medium", note: "Emails transacionais: saque solicitado, saque processando, saque concluido, saque falhou. Templates HTML responsivos. Includes link para dashboard.", device: "API", team: "Product", functionality: "Comunicacao proativa, confianca" },
        ]
      }
    ]
  },
  {
    id: "phase-4",
    title: "Fase 4: Integração MCP",
    shortTitle: "MCP",
    sprints: 3,
    storyPoints: 89,
    duration: "6 semanas",
    status: "pending",
    color: "orange",
    milestones: [
      "MCP Gateway funcionando com Claude Desktop",
      "Agentes expostos como MCP Tools",
      "Agentes podem consumir MCP servers externos",
      "Marketplace com agentes MCP-enabled"
    ],
    epics: [
      {
        id: "epic-4-0",
        title: "Validação MCP",
        stories: [
          { id: "F4-001", item: "Protótipo MCP Server", feature: "MCP - Validação", points: 8, responsible: "Backend Python", sprint: "S12", status: "pending", type: "Core", complexity: "hard", note: "Protótipo técnico com 1 agente hardcoded exposto via MCP. Usar SDK oficial Python. Testar integração com Claude Desktop internamente.", device: "API", team: "Engineering", functionality: "Validação técnica do protocolo MCP" },
          { id: "F4-002", item: "Demo Enterprise", feature: "MCP - Validação", points: 3, responsible: "Backend Python", sprint: "S12", status: "pending", type: "Product", complexity: "simple", note: "Preparar demo para 3-5 potenciais clientes Enterprise. Coletar feedback. Documentar interesse e objeções. Go/No-Go decision.", device: "Desktop", team: "Product", functionality: "Validação de mercado antes de investimento" },
        ]
      },
      {
        id: "epic-4-1",
        title: "MCP Server MVP",
        stories: [
          { id: "F4-003", item: "MCP Gateway Service", feature: "MCP Server", points: 13, responsible: "Backend Python", sprint: "S12", status: "pending", type: "Core", complexity: "very_hard", note: "Serviço FastAPI que implementa protocolo MCP via SSE. Traduz requests MCP para chamadas internas ao AI Engine. Gerencia sessões e estado.", device: "API", team: "Engineering", functionality: "Gateway para clientes MCP externos" },
          { id: "F4-004", item: "MCP Authentication", feature: "MCP Server", points: 8, responsible: "Backend Go", sprint: "S12", status: "pending", type: "Security", complexity: "hard", note: "Validação de API Keys específicas para MCP. Rate limiting por plano. Integração com sistema de permissões existente.", device: "API", team: "Engineering", functionality: "Segurança e controle de acesso MCP" },
          { id: "F4-005", item: "Agents as MCP Tools", feature: "MCP Server", points: 8, responsible: "Backend Python", sprint: "S13", status: "pending", type: "Core", complexity: "hard", note: "Expor agentes como MCP Tools com schema JSON. Streaming de respostas via SSE. Manter proteção Black Box - não expor system prompts.", device: "API", team: "Engineering", functionality: "Agentes acessíveis via Claude Desktop/VS Code" },
          { id: "F4-006", item: "MCP Billing Integration", feature: "MCP Server", points: 5, responsible: "Backend Go", sprint: "S13", status: "pending", type: "Integration", complexity: "medium", note: "Cada invocação MCP = 1 crédito. Integrar com wallet existente. Log de uso para analytics. Block se saldo insuficiente.", device: "API", team: "Engineering", functionality: "Monetização do canal MCP" },
        ]
      },
      {
        id: "epic-4-2",
        title: "MCP Client",
        stories: [
          { id: "F4-007", item: "MCP Client Adapter", feature: "MCP Client", points: 13, responsible: "Backend Python", sprint: "S13", status: "pending", type: "Core", complexity: "very_hard", note: "Novo tool no LangGraph que conecta a MCP servers externos. Descobre tools disponíveis. Invoca tools com timeout e retry.", device: "API", team: "Engineering", functionality: "Agentes podem usar ferramentas externas via MCP" },
          { id: "F4-008", item: "MCP Registry", feature: "MCP Client", points: 5, responsible: "Backend Go", sprint: "S14", status: "pending", type: "Core", complexity: "medium", note: "Catálogo de MCP servers configurados por usuário/org. Credenciais encriptadas. Health checks periódicos.", device: "API", team: "Engineering", functionality: "Gerenciamento de conexões MCP externas" },
          { id: "F4-009", item: "MCP Servers UI", feature: "MCP Client", points: 8, responsible: "Frontend 1", sprint: "S14", status: "pending", type: "UI", complexity: "hard", note: "Página para configurar MCP servers externos. Formulário para adicionar server (URI, credenciais). Lista de servers com status. Testar conexão.", device: "Desktop", team: "Product", functionality: "UI para gerenciar conexões MCP" },
        ]
      },
      {
        id: "epic-4-3",
        title: "Marketplace MCP",
        stories: [
          { id: "F4-010", item: "MCP-enabled Flag", feature: "Marketplace MCP", points: 3, responsible: "Backend Go", sprint: "S14", status: "pending", type: "Core", complexity: "simple", note: "Campo mcp_enabled na tabela de agentes. Creators podem marcar agentes como disponíveis via MCP. Filtro no marketplace.", device: "API", team: "Engineering", functionality: "Identificar agentes acessíveis via MCP" },
          { id: "F4-011", item: "MCP Installation URI", feature: "Marketplace MCP", points: 5, responsible: "Backend Go", sprint: "S14", status: "pending", type: "Core", complexity: "medium", note: "Gerar URI de instalação MCP para cada agente. Formato: snackprompt://install/{agent_id}. Botão 'Adicionar ao Claude' no marketplace.", device: "API", team: "Product", functionality: "One-click install de agentes via MCP" },
          { id: "F4-012", item: "MCP Analytics", feature: "Marketplace MCP", points: 5, responsible: "Backend Go", sprint: "S14", status: "pending", type: "Core", complexity: "medium", note: "Tracking de uso via MCP vs Web. Dashboard para creators ver distribuição de canais. Métricas: invocações, receita por canal.", device: "API", team: "Product", functionality: "Visibilidade de performance do canal MCP" },
          { id: "F4-013", item: "MCP Documentation", feature: "Marketplace MCP", points: 5, responsible: "Frontend 2", sprint: "S14", status: "pending", type: "Product", complexity: "medium", note: "Página de docs explicando como usar MCP. Guia de instalação para Claude Desktop. Exemplos de uso. FAQ.", device: "Desktop/Mobile", team: "Product", functionality: "Onboarding de usuários MCP" },
        ]
      }
    ]
  }
];

// Helper functions
export function getAllStories(): Story[] {
  return phases.flatMap(phase =>
    phase.epics.flatMap(epic => epic.stories)
  );
}

export function getStoriesBySprint(sprint: string): Story[] {
  return getAllStories().filter(story => story.sprint === sprint);
}

export function getStoriesByResponsible(responsible: Responsible): Story[] {
  return getAllStories().filter(story => story.responsible === responsible);
}

export function getStoriesByStatus(status: StoryStatus): Story[] {
  return getAllStories().filter(story => story.status === status);
}

export function getTotalPoints(): number {
  return getAllStories().reduce((sum, story) => sum + story.points, 0);
}

export function getCompletedPoints(): number {
  return getAllStories()
    .filter(story => story.status === "completed")
    .reduce((sum, story) => sum + story.points, 0);
}

export function getProgressPercentage(): number {
  const total = getTotalPoints();
  const completed = getCompletedPoints();
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

export const sprints = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10", "S11", "S12", "S13", "S14"];

export const responsibles: Responsible[] = [
  "Backend Python",
  "Backend Go",
  "Frontend 1",
  "Frontend 2",
  "Backend Go + Python"
];

export const complexityLabels: Record<Complexity, string> = {
  simple: "Simple",
  medium: "Medium",
  hard: "Hard",
  very_hard: "Very Hard"
};

export const complexityColors: Record<Complexity, string> = {
  simple: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  hard: "bg-orange-100 text-orange-800",
  very_hard: "bg-red-100 text-red-800"
};

export const statusLabels: Record<StoryStatus, string> = {
  pending: "Pendente",
  in_progress: "Em Progresso",
  completed: "Concluido"
};

export const statusColors: Record<StoryStatus, string> = {
  pending: "bg-slate-100 text-slate-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800"
};
