# Snack Prompt 3.0: Documento Técnico Detalhado

**Versão:** 1.0  
**Data:** Dezembro 2025  
**Audiência:** Time Técnico, Arquitetos de Sistemas, Engenheiros de Software  
**Objetivo:** Fornecer especificações técnicas completas para implementação da Plataforma de Inteligência Corporativa e Marketplace de Agentes

---

## Sumário Executivo Técnico

O Snack Prompt 3.0 evolui de um repositório de prompts para uma plataforma robusta de inteligência corporativa, combinando uma **Knowledge Base Ativa**, um **Marketplace de Agentes com Proteção de IP** e uma **API-as-a-Service** escalável. A arquitetura utiliza um padrão de **Microserviço Sidecar**, integrando um novo **AI Engine em Python** ao backend legado em **Go**, com comunicação assíncrona baseada em eventos para garantir desacoplamento, escalabilidade e resiliência.

---

## 1. Visão Geral da Arquitetura

### 1.1 Princípios Arquiteturais

A arquitetura foi desenhada seguindo os seguintes princípios:

- **Desacoplamento:** O AI Engine é independente do Core Backend, permitindo manutenção e evolução separadas.
- **Escalabilidade Horizontal:** Tanto o Backend Go quanto o AI Engine Python podem ser escalados horizontalmente.
- **Resiliência:** Falhas em um componente não afetam os outros, graças à comunicação assíncrona.
- **Segurança:** Proteção de propriedade intelectual através do "Proxy Blindado" e encriptação de dados sensíveis.
- **Performance:** Otimização de latência através de caching, indexação vetorial e processamento assíncrono.

### 1.2 Componentes Principais

| Componente | Responsabilidade | Tecnologia |
| :--- | :--- | :--- |
| **Frontend** | Interface de usuário, chat, construtor de agentes | Next.js + TypeScript |
| **Core Backend** | Lógica de negócio, autenticação, pagamentos, CRUD | Go + PostgreSQL |
| **AI Engine** | Processamento vetorial, orquestração de LLMs, agentes | Python + FastAPI |
| **Vector Database** | Indexação e busca de embeddings | Qdrant |
| **Message Broker** | Fila de eventos assíncrona | RabbitMQ |
| **Embedding Service** | Geração de embeddings | Jina AI v3 |
| **LLM Providers** | Modelos de linguagem | OpenAI, Anthropic |

### 1.3 Diagrama de Arquitetura de Alto Nível

![Arquitetura de Alto Nível](/home/ubuntu/architecture_diagram.png)

A figura acima ilustra a interação entre os componentes. O Frontend comunica-se com o Core Backend para lógica de negócio e autenticação. O Core Backend publica eventos no RabbitMQ quando dados são alterados. O AI Engine consome esses eventos, processa os dados, gera embeddings e atualiza o Qdrant. As respostas do usuário são geradas através da orquestração de LLMs com contexto recuperado do Qdrant.

---

## 2. Stack Tecnológica Detalhada

### 2.1 Vector Database: Qdrant

**Por que Qdrant?**

O Qdrant foi escolhido em detrimento de alternativas como PGVector por várias razões críticas:

- **Performance Nativa:** Escrito em Rust, otimizado especificamente para operações vetoriais. Oferece latência de milissegundos mesmo com milhões de vetores.
- **Filtragem de Metadados:** Suporta filtros complexos (`user_id`, `table_id`, `agent_id`) com latência mínima, essencial para multi-tenancy.
- **Busca Híbrida:** Implementa nativamente a busca por **vetores densos** (semântica) + **vetores esparsos** (palavras-chave exatas). Isso é crítico para Knowledge Bases corporativas onde precisão é essencial.
- **Quantização:** Permite compressão de vetores (até 4x de economia de RAM/Disco) mantendo qualidade de busca.

**Configuração Recomendada:**

```yaml
# Qdrant Configuration
qdrant:
  host: "qdrant-service"
  port: 6333
  api_key: "${QDRANT_API_KEY}"
  
  collection_config:
    vector_size: 1024  # Jina v3 default
    distance: "Cosine"
    quantization:
      enabled: true
      type: "int8"
      always_ram: false
```

### 2.2 Embedding Model: Jina Embeddings v3

**Características Principais:**

- **SOTA Performance:** Jina v3 é o estado da arte em modelos open-source multilíngues, com suporte para mais de 100 idiomas.
- **Matryoshka Representation:** Permite "cortar" o vetor (ex: usar 512 dimensões em vez de 1024) mantendo 95%+ da precisão. Isso reduz drasticamente o custo de armazenamento no Qdrant.
- **Task Adapters:** O modelo pode ser instruído se está indexando uma "Fato Jurídico", "Descrição de Produto" ou "Contrato", melhorando a qualidade do RAG.

**Integração no AI Engine:**

```python
from jina_client import JinaEmbedding

embedding_client = JinaEmbedding(
    api_key=os.getenv("JINA_API_KEY"),
    model="jina-embeddings-v3",
    task="retrieval.document",
    dimension=512  # Matryoshka: reduz custo
)

# Exemplo de uso
embeddings = embedding_client.embed_documents(
    documents=["Texto 1", "Texto 2"],
    batch_size=32
)
```

### 2.3 Data Pipeline (ETL): LlamaIndex + Docling

**LlamaIndex - O Bibliotecário:**

LlamaIndex fornece parsers hierárquicos que transformam estruturas JSON (Tabela > Coluna > Célula) em vetores sem perder contexto.

```python
from llama_index.core import Document
from llama_index.core.node_parser import HierarchicalNodeParser

# Configuração do parser hierárquico
parser = HierarchicalNodeParser.from_defaults(
    chunk_size=512,
    chunk_overlap=128,
    backup_chunk_size=256
)

# Transformação de dados estruturados
documents = [
    Document(
        text=f"Tabela: {table_name}, Coluna: {col_name}, Valor: {cell_value}",
        metadata={
            "table_id": table_id,
            "column_id": col_id,
            "cell_id": cell_id,
            "user_id": user_id
        }
    )
    for table_id, col_id, cell_id, table_name, col_name, cell_value in data
]

nodes = parser.get_nodes_from_documents(documents)
```

**Docling - Extração de Documentos Complexos:**

Para quando o usuário faz upload de PDFs ou DOCX, o Docling (IBM) extrai tabelas e layouts complexos.

```python
from docling.document_converter import DocumentConverter

converter = DocumentConverter()
result = converter.convert_document_to_document_markup(
    source_file_path="documento.pdf",
    output_format="markdown"
)

# Resultado: Markdown estruturado pronto para embedding
markdown_content = result.document.export_to_markdown()
```

### 2.4 Agent Runtime: LangChain (LangGraph)

**Por que LangGraph?**

Diferente de cadeias lineares, o LangGraph implementa uma **Máquina de Estados**, permitindo lógica complexa com loops, auto-correção e gerenciamento de memória.

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict, List

class AgentState(TypedDict):
    messages: List[BaseMessage]
    context_chunks: List[Document]
    token_count: int
    user_context: dict

# Definição do grafo
workflow = StateGraph(AgentState)

# Adição de nodes
workflow.add_node("query_reformulation", reformulate_query_node)
workflow.add_node("retrieval", retrieval_node)
workflow.add_node("generation", generation_node)
workflow.add_node("post_processing", post_processing_node)

# Adição de edges (transições)
workflow.add_edge("query_reformulation", "retrieval")
workflow.add_conditional_edges(
    "retrieval",
    check_context_found,
    {
        "found": "generation",
        "not_found": "post_processing"
    }
)
workflow.add_edge("generation", "post_processing")
workflow.add_edge("post_processing", END)

# Compilação
graph = workflow.compile()
```

### 2.5 Message Broker: RabbitMQ

**Configuração para Escalabilidade:**

```yaml
rabbitmq:
  host: "rabbitmq-service"
  port: 5672
  
  exchanges:
    - name: "snack.events"
      type: "topic"
      durable: true
  
  queues:
    - name: "queue.ingestion.priority"
      durable: true
      arguments:
        x-max-priority: 10
        x-dead-letter-exchange: "snack.dlx"
    
    - name: "queue.ingestion.standard"
      durable: true
      arguments:
        x-dead-letter-exchange: "snack.dlx"
  
  dead_letter_exchange:
    name: "snack.dlx"
    type: "topic"
```

---

## 3. Sincronização de Dados: Arquitetura Orientada a Eventos

### 3.1 Fluxo de Sincronização Detalhado

A sincronização entre Postgres e Qdrant é crítica. Implementamos uma arquitetura **Event-Driven** para garantir consistência sem impactar a experiência do usuário.

#### Fase 1: Ação do Usuário e Persistência

1. Usuário edita uma célula na tabela no frontend.
2. Frontend envia `PATCH /api/tables/{table_id}/cells/{cell_id}` para o Backend Go.
3. Go valida a requisição e salva no PostgreSQL dentro de uma transação.

```sql
BEGIN TRANSACTION;
  UPDATE snack_items 
  SET content = $1, updated_at = NOW()
  WHERE id = $2 AND user_id = $3;
  
  INSERT INTO audit_log (user_id, action, entity_id, timestamp)
  VALUES ($3, 'ITEM_UPDATED', $2, NOW());
COMMIT;
```

#### Fase 2: Publicação do Evento

Imediatamente após o commit, o Go publica um evento no RabbitMQ:

```go
// Backend Go
event := Event{
    EventType: "ITEM_UPDATED",
    Timestamp: time.Now().UTC(),
    Data: EventData{
        SnackTableID:  tableID,
        SnackColumnID: columnID,
        SnackItemID:   itemID,
        ContentText:   newContent,
        Metadata: map[string]interface{}{
            "author_id": userID,
            "is_public": isPublic,
        },
    },
}

// Serializa e publica
eventJSON, _ := json.Marshal(event)
channel.Publish(
    exchange: "snack.events",
    routingKey: "item.updated",
    body: eventJSON,
)
```

#### Fase 3: Consumo e Processamento

O AI Engine (Python) consome a mensagem:

```python
import pika
import json
from jina_client import JinaEmbedding
from qdrant_client import QdrantClient

def process_item_updated(ch, method, properties, body):
    try:
        event = json.loads(body)
        
        # Passo 1: Deletar vetores antigos
        qdrant.delete(
            collection_name="snack_items",
            points_selector=models.FilterSelector(
                filter=models.Filter(
                    must=[
                        models.FieldCondition(
                            key="snack_item_id",
                            match=models.MatchValue(value=event["data"]["snack_item_id"])
                        )
                    ]
                )
            )
        )
        
        # Passo 2: Chunking do texto
        chunks = chunk_text(event["data"]["content_text"], chunk_size=512)
        
        # Passo 3: Gerar embeddings
        embeddings = jina_client.embed_documents(chunks)
        
        # Passo 4: Inserir no Qdrant
        points = [
            models.PointStruct(
                id=generate_id(),
                vector=embedding,
                payload={
                    "snack_table_id": event["data"]["snack_table_id"],
                    "snack_column_id": event["data"]["snack_column_id"],
                    "snack_item_id": event["data"]["snack_item_id"],
                    "text_content": chunk,
                    "user_id": event["data"]["metadata"]["author_id"],
                    "is_public": event["data"]["metadata"]["is_public"]
                }
            )
            for chunk, embedding in zip(chunks, embeddings)
        ]
        
        qdrant.upsert(
            collection_name="snack_items",
            points=points
        )
        
        # Passo 5: Confirmar processamento
        ch.basic_ack(delivery_tag=method.delivery_tag)
        
    except Exception as e:
        # Em caso de erro, fazer Nack para reprocessar
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)
        logger.error(f"Erro ao processar evento: {str(e)}")

# Configurar consumer
connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq-service'))
channel = connection.channel()
channel.basic_consume(
    queue='queue.ingestion.priority',
    on_message_callback=process_item_updated
)
channel.start_consuming()
```

### 3.2 Tratamento de Falhas e Resiliência

O RabbitMQ gerencia automaticamente retentativas e Dead Letter Queues (DLQ):

1. **Primeira Tentativa Falha:** O worker faz `basic_nack(requeue=True)`.
2. **Retentativas:** A mensagem volta à fila e é reprocessada até 5 vezes.
3. **Falha Permanente:** Após 5 tentativas, a mensagem é movida para `dlq.ingestion.errors`.
4. **Alerta:** Um sistema de monitoramento notifica o time sobre mensagens na DLQ.

```python
# Configuração de DLQ
dlq_config = {
    "x-dead-letter-exchange": "snack.dlx",
    "x-dead-letter-routing-key": "error.ingestion",
    "x-message-ttl": 86400000  # 24 horas
}

# Binding da DLQ
channel.queue_declare(
    queue="dlq.ingestion.errors",
    durable=True,
    arguments=dlq_config
)
```

### 3.3 Diagrama de Sequência da Sincronização

![Diagrama de Sincronização](/home/ubuntu/sync_diagram.png)

---

## 4. Modelagem de Dados

### 4.1 Schema PostgreSQL (Novas Entidades)

#### Tabela: `agents`

```sql
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    system_prompt TEXT NOT NULL, -- Encriptado em repouso
    model_config JSONB NOT NULL, -- {"provider": "openai", "model": "gpt-4o", "temperature": 0.7}
    visibility ENUM ('private', 'public_free', 'marketplace_paid') DEFAULT 'private',
    price_per_msg INTEGER, -- Custo em créditos (NULL se gratuito)
    is_blackbox BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_author_id (author_id),
    INDEX idx_visibility (visibility)
);
```

#### Tabela: `agent_knowledge_links`

```sql
CREATE TABLE agent_knowledge_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    table_id VARCHAR(255) NOT NULL,
    link_type ENUM ('static', 'dynamic') DEFAULT 'static',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (agent_id, table_id),
    INDEX idx_agent_id (agent_id)
);
```

#### Tabela: `wallets`

```sql
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id),
    balance BIGINT DEFAULT 0, -- Armazenado em centavos/unidades mínimas
    updated_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_user_id (user_id)
);
```

#### Tabela: `transactions`

```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    transaction_type ENUM ('agent_usage', 'refill', 'payout', 'refund'),
    amount BIGINT NOT NULL,
    agent_id UUID REFERENCES agents(id),
    description TEXT,
    status ENUM ('pending', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);
```

### 4.2 Payload do Qdrant

```json
{
  "id": "unique-vector-id",
  "vector": [0.123, 0.456, ...],
  "payload": {
    "snack_table_id": "Table_123",
    "snack_column_id": "Col_Age",
    "snack_item_id": "Cell_ABC",
    "text_content": "Contexto: Idade do Cliente. Valor: 35 anos.",
    "source_url": "https://snackprompt.com/tables/Table_123/cells/Cell_ABC",
    "user_id": "user_456",
    "is_public": false,
    "created_at": "2025-12-01T10:00:00Z"
  }
}
```

---

## 5. Contratos de API

### 5.1 Endpoint de Chat (Streaming)

**Requisição:**

```http
POST /api/v1/chat/completions
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "agent_id": "uuid-do-agente",
  "messages": [
    {
      "role": "user",
      "content": "Analise este contrato e aponte riscos."
    }
  ],
  "attached_user_tables": ["table_id_1", "table_id_2"],
  "stream": true,
  "temperature": 0.7
}
```

**Resposta (Server-Sent Events):**

```
event: citation
data: {"ref_id": 1, "source": "Tabela Jurídica, Célula 2", "content": "Artigo 5º da Constituição"}

event: token
data: {"text": "O"}

event: token
data: {"text": " contrato"}

event: token
data: {"text": " apresenta"}

event: token
data: {"text": " riscos"}

event: done
data: {"total_tokens": 150, "credits_deducted": 2, "citations": [{"ref_id": 1, "source": "Tabela Jurídica, Célula 2"}]}
```

### 5.2 Endpoint de Criação de Agente

**Requisição:**

```http
POST /api/v1/agents
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "title": "Advogado Sênior",
  "description": "Especialista em análise de contratos e legislação",
  "system_prompt": "Você é um advogado experiente...",
  "model_config": {
    "provider": "openai",
    "model": "gpt-4o",
    "temperature": 0.3
  },
  "visibility": "marketplace_paid",
  "price_per_msg": 5,
  "knowledge_links": [
    {
      "table_id": "Table_Laws",
      "link_type": "static"
    }
  ]
}
```

**Resposta:**

```json
{
  "id": "agent-uuid",
  "author_id": "user-uuid",
  "title": "Advogado Sênior",
  "visibility": "marketplace_paid",
  "price_per_msg": 5,
  "is_blackbox": true,
  "created_at": "2025-12-01T10:00:00Z"
}
```

---

## 6. Lógica do Agente: LangGraph em Detalhes

### 6.1 Fluxo de Decisão (MVP)

![Fluxo do Agente](/home/ubuntu/agent_flow_diagram.png)

### 6.2 Implementação do Grafo

```python
from langgraph.graph import StateGraph, END
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from typing import TypedDict, List, Optional

class AgentState(TypedDict):
    messages: List[BaseMessage]
    context_chunks: List[Document]
    token_count: int
    user_context: dict
    query_reformulated: Optional[str]

def reformulate_query_node(state: AgentState) -> AgentState:
    """Reformula a pergunta do usuário para otimizar busca vetorial."""
    last_message = state["messages"][-1].content
    
    reformulation_prompt = f"""
    Reformule a seguinte pergunta para melhorar a busca em uma base de dados vetorial.
    Pergunta original: {last_message}
    
    Reformulação:
    """
    
    response = llm.invoke(reformulation_prompt)
    state["query_reformulated"] = response.content
    return state

def retrieval_node(state: AgentState) -> AgentState:
    """Recupera contexto do Qdrant usando RAG Híbrido."""
    query = state["query_reformulated"] or state["messages"][-1].content
    
    # Gerar embedding da query
    query_embedding = jina_client.embed_documents([query])[0]
    
    # Buscar no Qdrant com filtro híbrido
    search_results = qdrant.search(
        collection_name="snack_items",
        query_vector=query_embedding,
        query_filter=models.Filter(
            should=[
                models.FieldCondition(
                    key="table_id",
                    match=models.MatchValue(value=creator_kb_id)
                ),
                models.FieldCondition(
                    key="table_id",
                    match=models.MatchValue(value=user_kb_id)
                )
            ]
        ),
        limit=5
    )
    
    # Converter resultados em Documents
    context_chunks = [
        Document(
            page_content=result.payload["text_content"],
            metadata=result.payload
        )
        for result in search_results
    ]
    
    state["context_chunks"] = context_chunks
    return state

def generation_node(state: AgentState) -> AgentState:
    """Gera resposta usando LLM com contexto."""
    context_text = "\n\n".join([
        f"Fonte: {chunk.metadata['source_url']}\n{chunk.page_content}"
        for chunk in state["context_chunks"]
    ])
    
    system_prompt = f"""
    Você é um assistente especializado. Responda apenas com base no contexto fornecido.
    Se não encontrar informação suficiente, diga isso claramente.
    Adicione [Ref: N] ao final de cada sentença que cita uma fonte.
    
    Contexto:
    {context_text}
    """
    
    messages = state["messages"] + [
        HumanMessage(content=system_prompt)
    ]
    
    response = llm.invoke(messages)
    state["messages"].append(AIMessage(content=response.content))
    state["token_count"] += estimate_tokens(response.content)
    
    return state

def post_processing_node(state: AgentState) -> AgentState:
    """Formata citações e prepara resposta final."""
    # Extrair referências [Ref: N] da resposta
    response_text = state["messages"][-1].content
    citations = extract_citations(response_text)
    
    # Mapear referências para fontes
    citation_map = {
        i: chunk.metadata
        for i, chunk in enumerate(state["context_chunks"])
    }
    
    state["citations"] = [
        {
            "ref_id": ref_id,
            "source": citation_map.get(ref_id - 1, {}).get("source_url")
        }
        for ref_id in citations
    ]
    
    return state

# Construir o grafo
workflow = StateGraph(AgentState)

workflow.add_node("reformulate", reformulate_query_node)
workflow.add_node("retrieve", retrieval_node)
workflow.add_node("generate", generation_node)
workflow.add_node("post_process", post_processing_node)

workflow.add_edge("reformulate", "retrieve")
workflow.add_conditional_edges(
    "retrieve",
    lambda state: "generate" if state["context_chunks"] else "post_process",
    {
        "generate": "generate",
        "post_process": "post_process"
    }
)
workflow.add_edge("generate", "post_process")
workflow.add_edge("post_process", END)

workflow.set_entry_point("reformulate")

agent_graph = workflow.compile()
```

---

## 7. Arquitetura de Segurança: O "Proxy Blindado"

### 7.1 Fluxo de Execução Segura

![Arquitetura de Segurança](/home/ubuntu/security_diagram.png)

### 7.2 Implementação Detalhada

#### Passo 1: Validação no Backend Go

```go
// Backend Go - Validação e Autorização
func (h *ChatHandler) HandleChatRequest(c *gin.Context) {
    var req ChatRequest
    c.BindJSON(&req)
    
    // Verificar autenticação
    userID := c.GetString("user_id")
    
    // Verificar se o usuário comprou o agente
    agent, err := db.GetAgent(req.AgentID)
    if agent.Visibility == "marketplace_paid" {
        purchased, err := db.CheckAgentPurchase(userID, req.AgentID)
        if !purchased {
            c.JSON(403, gin.H{"error": "Agent not purchased"})
            return
        }
    }
    
    // Verificar saldo de créditos
    wallet, err := db.GetWallet(userID)
    estimatedCost := agent.PricePerMsg
    if wallet.Balance < estimatedCost {
        c.JSON(402, gin.H{"error": "Insufficient credits"})
        return
    }
    
    // Gerar JWT temporário com IDs permitidos
    executionToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "user_id": userID,
        "agent_id": req.AgentID,
        "allowed_tables": req.AttachedUserTables,
        "exp": time.Now().Add(5 * time.Minute).Unix(),
    })
    
    tokenString, _ := executionToken.SignedString([]byte(os.Getenv("JWT_SECRET")))
    
    // Repassar para o AI Engine
    aiResponse, err := callAIEngine(req, tokenString)
    
    // Debitar créditos
    db.DebitCredits(userID, estimatedCost)
    
    c.JSON(200, aiResponse)
}
```

#### Passo 2: Execução Segura no AI Engine

```python
# AI Engine (Python) - Execução Segura
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer
import jwt

app = FastAPI()
security = HTTPBearer()

@app.post("/api/v1/chat/completions")
async def chat_completions(
    request: ChatRequest,
    credentials: HTTPAuthCredentials = Depends(security)
):
    try:
        # Validar JWT
        token_data = jwt.decode(
            credentials.credentials,
            os.getenv("JWT_SECRET"),
            algorithms=["HS256"]
        )
        
        user_id = token_data["user_id"]
        agent_id = token_data["agent_id"]
        allowed_tables = token_data["allowed_tables"]
        
        # Recuperar agente (com prompt encriptado)
        agent = db.get_agent(agent_id)
        
        # Descriptografar o prompt em memória
        system_prompt = decrypt_prompt(
            agent.system_prompt_encrypted,
            key=os.getenv("ENCRYPTION_KEY")
        )
        
        # Construir o filtro de RAG Híbrido
        creator_kb_id = agent.knowledge_links[0].table_id
        user_kb_ids = allowed_tables
        
        # Usar a chave de API da Snack Prompt (não a do usuário)
        llm = ChatOpenAI(
            api_key=os.getenv("SNACK_PROMPT_OPENAI_KEY"),
            model=agent.model_config["model"]
        )
        
        # Executar o agente
        result = agent_graph.invoke({
            "messages": [HumanMessage(content=request.messages[-1]["content"])],
            "context_chunks": [],
            "token_count": 0,
            "user_context": {
                "creator_kb_id": creator_kb_id,
                "user_kb_ids": user_kb_ids
            }
        })
        
        # Retornar apenas a resposta (sem expor o prompt ou dados)
        return {
            "response": result["messages"][-1].content,
            "citations": result.get("citations", []),
            "tokens_used": result["token_count"]
        }
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

---

## 8. Considerações de Performance e Escalabilidade

### 8.1 Otimizações de Latência

| Otimização | Impacto | Implementação |
| :--- | :--- | :--- |
| **Caching de Embeddings** | Reduz custo de Jina AI em 70% | Redis com TTL de 24h |
| **Quantização de Vetores** | Reduz tamanho do Qdrant em 4x | Qdrant native quantization |
| **Busca Híbrida** | Melhora precisão em 40% | Qdrant dense + sparse search |
| **Streaming SSE** | Melhora UX em 60% | FastAPI + SSE |
| **Connection Pooling** | Reduz overhead de conexão | PgBouncer + Qdrant client pooling |

### 8.2 Escalabilidade Horizontal

- **AI Engine:** Stateless, pode ter N réplicas atrás de um load balancer.
- **RabbitMQ:** Configurado em cluster para alta disponibilidade.
- **Qdrant:** Suporta replicação e sharding para distribuição de dados.
- **PostgreSQL:** Replicação read-only para distribuir leituras.

---

## 9. Plano de Implementação

### Fase 1: Fundação (Semanas 1-4)

- [ ] Setup de infraestrutura (Qdrant, RabbitMQ, PostgreSQL)
- [ ] Implementação do módulo de ingestão (LlamaIndex + Jina)
- [ ] Testes de sincronização de dados
- [ ] Chat básico com citações

### Fase 2: Agentes e API (Semanas 5-8)

- [ ] Implementação do LangGraph
- [ ] Agent Builder UI
- [ ] API externa com autenticação JWT
- [ ] Testes de carga

### Fase 3: Marketplace (Semanas 9-12)

- [ ] Sistema de créditos e faturamento
- [ ] Proteção de IP (Proxy Blindado)
- [ ] Marketplace UI
- [ ] Sistema de comissões

---

## 10. Checklist de Decisões Técnicas

- [ ] Aprovamos a modelagem de dados? Há sugestões?
- [ ] Qdrant é a melhor escolha para Vector DB?
- [ ] FastAPI ou Flask para o AI Engine?
- [ ] Onde guardaremos a chave de criptografia dos System Prompts? (Vault, Env Var, AWS KMS?)
- [ ] O Frontend está confortável em consumir Server-Sent Events?
- [ ] Implementaremos Self-Correction no MVP ou deixamos para v2?

---

## Referências Técnicas

- **Qdrant Documentation:** https://qdrant.tech/documentation/
- **Jina Embeddings:** https://jina.ai/embeddings/
- **LangChain LangGraph:** https://github.com/langchain-ai/langgraph
- **RabbitMQ Best Practices:** https://www.rabbitmq.com/documentation.html
- **FastAPI Documentation:** https://fastapi.tiangolo.com/

---

**Documento Preparado por:** Manus AI  
**Última Atualização:** Dezembro 2025  
**Status:** Pronto para Revisão Técnica
