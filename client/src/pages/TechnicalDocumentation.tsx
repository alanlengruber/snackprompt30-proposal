import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, Menu, X, Code, Briefcase, Calendar, FileText } from "lucide-react";
import mermaid from "mermaid";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-go";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-json";

const technicalSections = [
  { id: "overview", title: "01. Visão Geral da Arquitetura", number: "01" },
  { id: "stack", title: "02. Stack Tecnológica Detalhada", number: "02" },
  { id: "sync", title: "03. Sincronização de Dados", number: "03" },
  { id: "data-pipeline", title: "04. Data Pipeline (LlamaIndex + Docling)", number: "04" },
  { id: "data", title: "05. Modelagem de Dados", number: "05" },
  { id: "api", title: "06. Contratos de API", number: "06" },
  { id: "agent", title: "07. Lógica do Agente", number: "07" },
  { id: "tools-arch", title: "08. Arquitetura de Tools", number: "08" },
  { id: "agent-builder-tech", title: "09. Agent Builder (React Flow)", number: "09" },
  { id: "citations-tech", title: "10. Sistema de Citações", number: "10" },
  { id: "security", title: "11. Arquitetura de Segurança", number: "11" },
  { id: "performance", title: "12. Performance e Escalabilidade", number: "12" },
  { id: "implementation", title: "13. Plano de Implementação", number: "13" },
  { id: "checklist", title: "14. Checklist de Decisões", number: "14" },
];

const businessSections = [
  { id: "business-model", title: "01. Modelo de Negócio", number: "01" },
  { id: "credits", title: "02. Sistema de Créditos Snack", number: "02" },
  { id: "revenue-share", title: "03. Modelo de Repasse", number: "03" },
  { id: "use-cases", title: "04. Casos de Uso Práticos", number: "04" },
  { id: "agent-tools", title: "05. Ferramentas para Agentes", number: "05" },
  { id: "agent-builder-biz", title: "06. Agent Builder", number: "06" },
  { id: "citations-biz", title: "07. Sistema de Citações", number: "07" },
  { id: "seller-payout", title: "08. Sistema de Saque (Cash-out)", number: "08" },
  { id: "ai-costs", title: "09. Custos de IA e Infraestrutura", number: "09" },
  { id: "pricing", title: "10. Planos e Precificação", number: "10" },
  { id: "projections", title: "11. Projeções Financeiras", number: "11" },
  { id: "metrics", title: "12. Métricas de Sucesso", number: "12" },
  { id: "gtm", title: "13. Go-to-Market Strategy", number: "13" },
];

type ViewMode = "technical" | "business";

export default function TechnicalDocumentation() {
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<ViewMode>("technical");
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const sections = viewMode === "technical" ? technicalSections : businessSections;

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      themeVariables: {
        primaryColor: "#2563EB",
        primaryTextColor: "#fff",
        primaryBorderColor: "#1e40af",
        lineColor: "#64748b",
        secondaryColor: "#f1f5f9",
        tertiaryColor: "#e2e8f0",
      },
    });
  }, []);

  useEffect(() => {
    const renderMermaid = async () => {
      // Reset all mermaid elements (remove processed state)
      const elements = document.querySelectorAll(".mermaid");
      elements.forEach((element, index) => {
        element.removeAttribute("data-processed");
        element.id = `mermaid-${viewMode}-${index}`;
      });

      if (elements.length > 0) {
        await mermaid.run();
      }
    };

    // Small delay to ensure DOM is ready after viewMode change
    const timeoutId = setTimeout(() => {
      renderMermaid();
      Prism.highlightAll();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [viewMode]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  useEffect(() => {
    // Reset to first section when switching modes
    const firstSection = sections[0];
    if (firstSection) {
      setActiveSection(firstSection.id);
      scrollToSection(firstSection.id);
    }
  }, [viewMode]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-80 bg-sidebar border-r border-sidebar-border z-40 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-8 border-b border-sidebar-border">
          <h1 className="text-2xl font-black text-sidebar-foreground tracking-tight">
            Snack Prompt 3.0
          </h1>
          <p className="text-sm text-sidebar-foreground/70 mt-1">
            Documentação Completa
          </p>

          {/* Navigation Links */}
          <div className="mt-4 flex gap-2">
            <Button variant="default" size="sm" className="flex-1 gap-2">
              <FileText className="h-4 w-4" />
              <span className="text-xs">Docs</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/roadmap")}
              className="flex-1 gap-2"
            >
              <Calendar className="h-4 w-4" />
              <span className="text-xs">Roadmap</span>
            </Button>
          </div>

          {/* View Mode Toggle */}
          <div className="mt-3 flex gap-2">
            <Button
              variant={viewMode === "technical" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("technical")}
              className="flex-1 gap-2"
            >
              <Code className="h-4 w-4" />
              <span className="text-xs">Técnico</span>
            </Button>
            <Button
              variant={viewMode === "business" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("business")}
              className="flex-1 gap-2"
            >
              <Briefcase className="h-4 w-4" />
              <span className="text-xs">Negócio</span>
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-230px)]">
          <nav className="p-6 space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full text-left px-4 py-3 rounded-md transition-all duration-200 flex items-center gap-3 group ${
                  activeSection === section.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <span
                  className={`text-xs font-bold ${
                    activeSection === section.id ? "text-primary" : "text-sidebar-foreground/40"
                  }`}
                >
                  {section.number}
                </span>
                <span className="text-sm font-medium flex-1">{section.title.replace(/^\d+\.\s/, "")}</span>
                <ChevronRight
                  className={`h-4 w-4 transition-transform ${
                    activeSection === section.id ? "translate-x-1" : ""
                  }`}
                />
              </button>
            ))}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-80 min-h-screen">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 py-12 lg:py-20" ref={contentRef}>
          {/* Header */}
          <header className="mb-16">
            <div className="inline-block px-4 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-4">
              {viewMode === "technical" ? "TECHNICAL SPECIFICATION" : "BUSINESS MODEL"}
            </div>
            <h1 className="text-5xl lg:text-6xl font-black tracking-tight mb-6">
              Snack Prompt 3.0
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              {viewMode === "technical"
                ? "Especificações técnicas completas para implementação da Plataforma de Inteligência Corporativa e Marketplace de Agentes"
                : "Modelo de negócio, estratégia de monetização e projeções financeiras para a Plataforma de Inteligência Corporativa"}
            </p>
            <div className="flex flex-wrap gap-4 mt-8 text-sm text-muted-foreground">
              <div>
                <span className="font-semibold text-foreground">Versão:</span> 1.0
              </div>
              <div>
                <span className="font-semibold text-foreground">Data:</span> Dezembro 2025
              </div>
              <div>
                <span className="font-semibold text-foreground">Audiência:</span>{" "}
                {viewMode === "technical" ? "Time Técnico" : "Time de Negócio"}
              </div>
            </div>
          </header>

          {viewMode === "technical" ? renderTechnicalContent() : renderBusinessContent()}

          {/* Footer */}
          <footer className="border-t border-border pt-12 mt-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Documento Preparado por:</strong> Manus AI
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Última Atualização:</strong> Dezembro 2025
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Status:</strong> Pronto para Revisão
                </p>
              </div>
              <Button
                onClick={() => scrollToSection(sections[0]?.id || "overview")}
                variant="outline"
                className="gap-2"
              >
                Voltar ao Topo
                <ChevronRight className="h-4 w-4 rotate-[-90deg]" />
              </Button>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );

  function renderTechnicalContent() {
    return (
      <>
        {/* Section 01: Overview */}
        <section id="overview" className="mb-20 scroll-mt-20">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-6xl font-black text-primary/20">01</span>
            <h2 className="text-3xl font-bold">Visão Geral da Arquitetura</h2>
          </div>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Princípios Arquiteturais</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-primary mb-2">Desacoplamento</h4>
                <p className="text-sm text-muted-foreground">
                  O AI Engine é independente do Core Backend, permitindo manutenção e evolução
                  separadas.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-2">Escalabilidade Horizontal</h4>
                <p className="text-sm text-muted-foreground">
                  Backend Go e AI Engine Python podem ser escalados horizontalmente.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-2">Resiliência</h4>
                <p className="text-sm text-muted-foreground">
                  Falhas em um componente não afetam os outros, graças à comunicação assíncrona.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-2">Segurança</h4>
                <p className="text-sm text-muted-foreground">
                  Proteção de propriedade intelectual através do "Proxy Blindado" e encriptação.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-6">Componentes Principais</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Componente</th>
                    <th className="text-left py-3 px-4 font-semibold">Responsabilidade</th>
                    <th className="text-left py-3 px-4 font-semibold">Tecnologia</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Frontend</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      Interface de usuário, chat, construtor de agentes
                    </td>
                    <td className="py-3 px-4">
                      <code className="text-xs bg-muted px-2 py-1 rounded">Next.js + TypeScript</code>
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Core Backend</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      Lógica de negócio, autenticação, pagamentos, CRUD
                    </td>
                    <td className="py-3 px-4">
                      <code className="text-xs bg-muted px-2 py-1 rounded">Go + PostgreSQL</code>
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">AI Engine</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      Processamento vetorial, orquestração de LLMs, agentes
                    </td>
                    <td className="py-3 px-4">
                      <code className="text-xs bg-muted px-2 py-1 rounded">Python + FastAPI</code>
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Vector Database</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      Indexação e busca de embeddings
                    </td>
                    <td className="py-3 px-4">
                      <code className="text-xs bg-muted px-2 py-1 rounded">Qdrant</code>
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Message Broker</td>
                    <td className="py-3 px-4 text-muted-foreground">Fila de eventos assíncrona</td>
                    <td className="py-3 px-4">
                      <code className="text-xs bg-muted px-2 py-1 rounded">RabbitMQ</code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-8 bg-muted/30">
            <h3 className="text-xl font-bold mb-4">Diagrama de Arquitetura de Alto Nível</h3>
            <div className="bg-white p-6 rounded-lg">
              <img
                src="/architecture_diagram.png"
                alt="Arquitetura de Alto Nível"
                className="w-full h-auto"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              O Frontend comunica-se com o Core Backend para lógica de negócio e autenticação. O
              Core Backend publica eventos no RabbitMQ quando dados são alterados. O AI Engine
              consome esses eventos, processa os dados, gera embeddings e atualiza o Qdrant.
            </p>
          </Card>
        </section>

        {/* Section 02: Stack */}
        <section id="stack" className="mb-20 scroll-mt-20">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-6xl font-black text-primary/20">02</span>
            <h2 className="text-3xl font-bold">Stack Tecnológica Detalhada</h2>
          </div>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Vector Database: Qdrant</h3>
            <div className="mb-6">
              <h4 className="font-semibold text-primary mb-3">Por que Qdrant?</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <strong className="text-foreground">Performance Nativa:</strong> Escrito em Rust,
                    otimizado para operações vetoriais com latência de milissegundos.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <strong className="text-foreground">Filtragem de Metadados:</strong> Suporta
                    filtros complexos com latência mínima, essencial para multi-tenancy.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <strong className="text-foreground">Busca Híbrida:</strong> Implementa nativamente
                    vetores densos (semântica) + vetores esparsos (palavras-chave).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <strong className="text-foreground">Quantização:</strong> Compressão de vetores
                    (até 4x economia) mantendo qualidade de busca.
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2 font-semibold">
                Configuração Recomendada (YAML):
              </p>
              <pre className="text-xs overflow-x-auto">
                <code className="language-yaml">{`qdrant:
  host: "qdrant-service"
  port: 6333
  api_key: "\${QDRANT_API_KEY}"
  
  collection_config:
    vector_size: 1024  # Jina v3 default
    distance: "Cosine"
    quantization:
      enabled: true
      type: "int8"
      always_ram: false`}</code>
              </pre>
            </div>
          </Card>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Embedding Model: Jina Embeddings v3</h3>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-primary/5 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">SOTA Performance</h4>
                <p className="text-xs text-muted-foreground">
                  Estado da arte em modelos multilíngues, suporte para 100+ idiomas.
                </p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Matryoshka Representation</h4>
                <p className="text-xs text-muted-foreground">
                  Permite "cortar" o vetor mantendo 95%+ da precisão, reduzindo custos.
                </p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Task Adapters</h4>
                <p className="text-xs text-muted-foreground">
                  Modelo pode ser instruído para diferentes tipos de documentos.
                </p>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2 font-semibold">
                Integração no AI Engine (Python):
              </p>
              <pre className="text-xs overflow-x-auto">
                <code className="language-python">{`from jina_client import JinaEmbedding

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
)`}</code>
              </pre>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-xl font-bold mb-4">Agent Runtime: LangChain (LangGraph)</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Diferente de cadeias lineares, o LangGraph implementa uma{" "}
              <strong className="text-foreground">Máquina de Estados</strong>, permitindo lógica
              complexa com loops, auto-correção e gerenciamento de memória.
            </p>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2 font-semibold">
                Definição do Grafo (Python):
              </p>
              <pre className="text-xs overflow-x-auto">
                <code className="language-python">{`from langgraph.graph import StateGraph, END
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

# Compilação
graph = workflow.compile()`}</code>
              </pre>
            </div>
          </Card>
        </section>

        {/* Section 03: Sync */}
        <section id="sync" className="mb-20 scroll-mt-20">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-6xl font-black text-primary/20">03</span>
            <h2 className="text-3xl font-bold">Sincronização de Dados</h2>
          </div>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Arquitetura Orientada a Eventos</h3>
            <p className="text-sm text-muted-foreground mb-6">
              A sincronização entre Postgres e Qdrant utiliza uma arquitetura{" "}
              <strong className="text-foreground">Event-Driven</strong> para garantir consistência
              sem impactar a experiência do usuário.
            </p>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-primary mb-2">Fase 1: Ação do Usuário</h4>
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                  <li>Usuário edita uma célula na tabela no frontend</li>
                  <li>Frontend envia PATCH para o Backend Go</li>
                  <li>Go valida e salva no PostgreSQL dentro de uma transação</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold text-primary mb-2">Fase 2: Publicação do Evento</h4>
                <p className="text-sm text-muted-foreground">
                  Imediatamente após o commit, o Go publica um evento no RabbitMQ com os dados
                  atualizados.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-primary mb-2">Fase 3: Consumo e Processamento</h4>
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                  <li>AI Engine (Python) consome a mensagem do RabbitMQ</li>
                  <li>Deleta vetores antigos do Qdrant (por ID)</li>
                  <li>Gera novos embeddings via Jina AI</li>
                  <li>Insere novos vetores no Qdrant</li>
                  <li>Confirma processamento (Ack)</li>
                </ol>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-muted/30">
            <h3 className="text-xl font-bold mb-4">Diagrama de Sequência</h3>
            <div className="bg-white p-6 rounded-lg">
              <img
                src="/sync_diagram.png"
                alt="Diagrama de Sincronização"
                className="w-full h-auto"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              O fluxo mostra como a atualização de dados é instantânea para o usuário (200 OK
              imediato), enquanto a sincronização vetorial acontece de forma assíncrona em
              background.
            </p>
          </Card>

          <Card className="p-8 mt-8">
            <h3 className="text-xl font-bold mb-4">Tratamento de Falhas e Resiliência</h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                O RabbitMQ gerencia automaticamente retentativas e Dead Letter Queues (DLQ):
              </p>
              <ol className="space-y-2 list-decimal list-inside">
                <li>
                  <strong className="text-foreground">Primeira Tentativa Falha:</strong> O worker
                  faz basic_nack(requeue=True)
                </li>
                <li>
                  <strong className="text-foreground">Retentativas:</strong> A mensagem volta à fila
                  e é reprocessada até 5 vezes
                </li>
                <li>
                  <strong className="text-foreground">Falha Permanente:</strong> Após 5 tentativas, a
                  mensagem é movida para dlq.ingestion.errors
                </li>
                <li>
                  <strong className="text-foreground">Alerta:</strong> Sistema de monitoramento
                  notifica o time sobre mensagens na DLQ
                </li>
              </ol>
            </div>
          </Card>
        </section>

        {/* Section 04: Data Pipeline (LlamaIndex + Docling) */}
        <section id="data-pipeline" className="mb-20 scroll-mt-20">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-6xl font-black text-primary/20">04</span>
            <h2 className="text-3xl font-bold">Data Pipeline (LlamaIndex + Docling)</h2>
          </div>

          <Card className="p-8 mb-8 bg-muted/30">
            <h3 className="text-xl font-bold mb-4">Visão Geral do Pipeline de Dados</h3>
            <p className="text-muted-foreground mb-6">
              O pipeline de dados da Snack Prompt utiliza duas ferramentas especializadas que trabalham em conjunto:
              <strong className="text-foreground"> LlamaIndex</strong> para processamento hierárquico de dados estruturados (JSON)
              e <strong className="text-foreground">Docling (IBM)</strong> para extração inteligente de documentos não-estruturados (PDF, DOCX).
            </p>
            <div className="bg-white p-6 rounded-lg">
              <div className="mermaid text-sm">
{`flowchart TB
    subgraph Input["Entrada de Dados"]
        JSON["JSON Tabelas"]
        PDF["PDF Upload"]
        DOCX["DOCX Upload"]
    end

    subgraph Processing["Processamento"]
        LI["LlamaIndex<br/>HierarchicalNodeParser"]
        DOC["Docling<br/>DocumentConverter"]
    end

    subgraph Indexing["Indexacao"]
        EMB["Jina AI v3<br/>Embeddings"]
        QD["Qdrant<br/>Vector DB"]
    end

    JSON --> LI
    PDF --> DOC
    DOCX --> DOC
    DOC --> LI
    LI --> EMB
    EMB --> QD`}
              </div>
            </div>
          </Card>

          <Card className="p-8 mb-8 border-l-4 border-l-blue-500">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">📚</span> LlamaIndex: O Bibliotecário
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              O LlamaIndex atua como nosso "bibliotecário inteligente", transformando a estrutura hierárquica
              das tabelas Snack Prompt (<code className="bg-muted px-1 rounded">Tabela → Coluna → Célula</code>) em vetores
              sem perder o contexto pai-filho.
            </p>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-primary mb-3">HierarchicalNodeParser</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  O parser hierárquico preserva a estrutura de dados, permitindo que cada célula
                  "saiba" a qual coluna e tabela pertence durante a busca vetorial.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <pre className="text-xs overflow-x-auto">
                    <code className="language-python">{`# ai_engine/ingestion/llamaindex_parser.py
from llama_index.core.node_parser import HierarchicalNodeParser
from llama_index.core.schema import Document, TextNode
from typing import List, Dict, Any

class SnackPromptHierarchicalParser:
    """
    Parser hierárquico para estrutura Snack Prompt.
    Preserva contexto: Tabela > Coluna > Célula
    """

    def __init__(self):
        self.parser = HierarchicalNodeParser.from_defaults(
            chunk_sizes=[2048, 512, 128],  # Tabela, Coluna, Célula
            chunk_overlap=20
        )

    def parse_table(self, table_data: Dict[str, Any]) -> List[TextNode]:
        """
        Converte JSON da tabela em nodes hierárquicos.

        Args:
            table_data: {
                "id": "tbl_123",
                "name": "Clientes",
                "columns": [
                    {
                        "id": "col_456",
                        "name": "Nome",
                        "items": [
                            {"id": "item_789", "value": "João Silva"}
                        ]
                    }
                ]
            }
        """
        nodes = []
        table_id = table_data["id"]
        table_name = table_data["name"]

        for column in table_data["columns"]:
            column_id = column["id"]
            column_name = column["name"]

            for item in column["items"]:
                # Texto enriquecido com contexto hierárquico
                enriched_text = f"""
                Tabela: {table_name}
                Coluna: {column_name}
                Valor: {item["value"]}
                """.strip()

                node = TextNode(
                    text=enriched_text,
                    metadata={
                        "snack_table_id": table_id,
                        "snack_column_id": column_id,
                        "snack_item_id": item["id"],
                        "table_name": table_name,
                        "column_name": column_name,
                        "hierarchy_level": "cell"
                    }
                )
                nodes.append(node)

        return nodes`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-primary mb-3">Índices e Retrievers</h4>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <pre className="text-xs overflow-x-auto">
                    <code className="language-python">{`# ai_engine/ingestion/index_manager.py
from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from qdrant_client.models import Filter, FieldCondition, MatchValue

class SnackPromptIndexManager:
    """Gerencia índices vetoriais com suporte a multi-tenant."""

    def __init__(self, qdrant_url: str, collection_name: str):
        self.client = QdrantClient(url=qdrant_url)
        self.vector_store = QdrantVectorStore(
            client=self.client,
            collection_name=collection_name
        )
        self.index = VectorStoreIndex.from_vector_store(
            vector_store=self.vector_store
        )

    def get_retriever(
        self,
        user_kb_ids: List[str],
        agent_kb_ids: List[str] = None,
        top_k: int = 5
    ):
        """
        Cria retriever com filtro multi-tenant (RAG Híbrido).
        Combina KB do usuário + KB do agente "caixa preta".
        """
        allowed_tables = user_kb_ids + (agent_kb_ids or [])

        # Filtro Qdrant para multi-tenant
        qdrant_filter = Filter(
            should=[
                FieldCondition(
                    key="snack_table_id",
                    match=MatchValue(value=table_id)
                )
                for table_id in allowed_tables
            ]
        )

        return self.index.as_retriever(
            similarity_top_k=top_k,
            filters=qdrant_filter
        )`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 mb-8 border-l-4 border-l-green-500">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">📄</span> Docling (IBM): O Extrator de Documentos
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Quando usuários fazem upload de PDFs ou DOCXs, o <strong className="text-foreground">Docling</strong> da IBM
              entra em ação. Ele é superior a alternativas como PyMuPDF ou Unstructured para extrair
              tabelas e layouts complexos, convertendo-os em Markdown estruturado.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold text-green-600 mb-2">✅ Por que Docling?</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Melhor extração de tabelas complexas</li>
                  <li>• Preserva hierarquia de títulos</li>
                  <li>• Suporte a layouts multi-coluna</li>
                  <li>• OCR integrado para scans</li>
                  <li>• Output em Markdown estruturado</li>
                </ul>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold text-red-600 mb-2">❌ Limitações de Alternativas</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• PyMuPDF: Tabelas viram texto plano</li>
                  <li>• pdfplumber: Falha em layouts complexos</li>
                  <li>• Unstructured: Mais genérico, menos preciso</li>
                  <li>• LangChain loaders: Dependem de backends</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-primary mb-3">Pipeline de Processamento</h4>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <pre className="text-xs overflow-x-auto">
                    <code className="language-python">{`# ai_engine/ingestion/docling_processor.py
from docling.document_converter import DocumentConverter
from docling.datamodel.base_models import InputFormat
from docling.datamodel.pipeline_options import PdfPipelineOptions
from pathlib import Path
from typing import Dict, Any, List

class DoclingProcessor:
    """
    Processa documentos PDF/DOCX usando Docling da IBM.
    Converte para Markdown estruturado para posterior indexação.
    """

    def __init__(self):
        # Configurações otimizadas para extração de tabelas
        self.pdf_options = PdfPipelineOptions(
            do_ocr=True,                    # OCR para scans
            do_table_structure=True,        # Preserva estrutura de tabelas
            table_structure_options={
                "do_cell_matching": True,   # Alinha células corretamente
                "mode": "accurate"          # Modo preciso (mais lento)
            }
        )

        self.converter = DocumentConverter(
            allowed_formats=[
                InputFormat.PDF,
                InputFormat.DOCX,
                InputFormat.PPTX
            ]
        )

    def process_document(
        self,
        file_path: Path,
        user_id: str,
        table_id: str
    ) -> Dict[str, Any]:
        """
        Processa documento e retorna estrutura para LlamaIndex.

        Returns:
            {
                "markdown": "# Título\\n\\n| Col1 | Col2 |...",
                "metadata": {...},
                "sections": [
                    {"title": "Seção 1", "content": "..."},
                    {"title": "Tabela 1", "content": "| ... |"}
                ]
            }
        """
        result = self.converter.convert(str(file_path))

        # Exporta para Markdown preservando estrutura
        markdown_content = result.document.export_to_markdown()

        # Extrai seções com metadados
        sections = self._extract_sections(result.document)

        return {
            "markdown": markdown_content,
            "metadata": {
                "source_file": file_path.name,
                "user_id": user_id,
                "snack_table_id": table_id,
                "page_count": len(result.document.pages),
                "has_tables": any(
                    s["type"] == "table" for s in sections
                )
            },
            "sections": sections
        }

    def _extract_sections(self, document) -> List[Dict[str, Any]]:
        """Extrai seções estruturadas do documento."""
        sections = []

        for element in document.iterate_items():
            if element.label == "title":
                sections.append({
                    "type": "heading",
                    "level": element.level,
                    "content": element.text
                })
            elif element.label == "table":
                sections.append({
                    "type": "table",
                    "content": element.export_to_markdown(),
                    "rows": element.num_rows,
                    "cols": element.num_cols
                })
            elif element.label == "text":
                sections.append({
                    "type": "paragraph",
                    "content": element.text
                })

        return sections`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-primary mb-3">Integração com LlamaIndex</h4>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <pre className="text-xs overflow-x-auto">
                    <code className="language-python">{`# ai_engine/ingestion/document_ingestion.py
from .docling_processor import DoclingProcessor
from .llamaindex_parser import SnackPromptHierarchicalParser
from llama_index.core.schema import Document

class DocumentIngestionPipeline:
    """
    Pipeline completo: Docling → LlamaIndex → Qdrant.
    """

    def __init__(self, index_manager):
        self.docling = DoclingProcessor()
        self.parser = SnackPromptHierarchicalParser()
        self.index_manager = index_manager

    async def ingest_uploaded_document(
        self,
        file_path: Path,
        user_id: str,
        table_id: str
    ):
        """
        Pipeline completo de ingestão de documento.

        1. Docling extrai e estrutura o documento
        2. LlamaIndex cria nodes hierárquicos
        3. Jina AI gera embeddings
        4. Qdrant armazena vetores
        """
        # Fase 1: Extração com Docling
        doc_result = self.docling.process_document(
            file_path, user_id, table_id
        )

        # Fase 2: Conversão para Documents do LlamaIndex
        documents = []
        for section in doc_result["sections"]:
            doc = Document(
                text=section["content"],
                metadata={
                    **doc_result["metadata"],
                    "section_type": section["type"]
                }
            )
            documents.append(doc)

        # Fase 3: Parse hierárquico e indexação
        nodes = self.parser.parser.get_nodes_from_documents(
            documents
        )

        # Fase 4: Inserção no Qdrant via LlamaIndex
        await self.index_manager.index.ainsert_nodes(nodes)

        return {
            "status": "success",
            "nodes_created": len(nodes),
            "table_id": table_id
        }`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Arquitetura de Chunks e Metadados</h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Fonte</th>
                    <th className="text-left py-3 px-4 font-semibold">Estratégia de Chunk</th>
                    <th className="text-left py-3 px-4 font-semibold">Tamanho</th>
                    <th className="text-left py-3 px-4 font-semibold">Metadados Preservados</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">JSON (Tabelas)</td>
                    <td className="py-3 px-4 text-muted-foreground">Hierárquico (Célula)</td>
                    <td className="py-3 px-4"><code className="bg-muted px-2 py-1 rounded text-xs">128-512 tokens</code></td>
                    <td className="py-3 px-4 text-muted-foreground">table_id, column_id, item_id</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">PDF (Texto)</td>
                    <td className="py-3 px-4 text-muted-foreground">Por Seção/Parágrafo</td>
                    <td className="py-3 px-4"><code className="bg-muted px-2 py-1 rounded text-xs">256-1024 tokens</code></td>
                    <td className="py-3 px-4 text-muted-foreground">page_number, section_title</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">PDF (Tabelas)</td>
                    <td className="py-3 px-4 text-muted-foreground">Por Linha da Tabela</td>
                    <td className="py-3 px-4"><code className="bg-muted px-2 py-1 rounded text-xs">64-256 tokens</code></td>
                    <td className="py-3 px-4 text-muted-foreground">table_index, row_index, headers</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">DOCX</td>
                    <td className="py-3 px-4 text-muted-foreground">Por Parágrafo/Heading</td>
                    <td className="py-3 px-4"><code className="bg-muted px-2 py-1 rounded text-xs">256-1024 tokens</code></td>
                    <td className="py-3 px-4 text-muted-foreground">heading_level, style_name</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-8 mb-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <h3 className="text-xl font-bold mb-4">Fluxo Completo: Do Upload à Busca</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-l-blue-500 pl-4 py-2">
                <div className="text-xs text-blue-400 font-semibold">FASE 1: UPLOAD</div>
                <ul className="text-sm text-slate-300 mt-1 space-y-1">
                  <li>• Usuário faz upload de PDF no frontend</li>
                  <li>• Backend Go valida e envia para AI Engine (Python)</li>
                </ul>
              </div>
              <div className="border-l-4 border-l-green-500 pl-4 py-2">
                <div className="text-xs text-green-400 font-semibold">FASE 2: DOCLING</div>
                <ul className="text-sm text-slate-300 mt-1 space-y-1">
                  <li>• Docling processa PDF com OCR e extração de tabelas</li>
                  <li>• Converte para Markdown estruturado</li>
                  <li>• Extrai seções com metadados</li>
                </ul>
              </div>
              <div className="border-l-4 border-l-yellow-500 pl-4 py-2">
                <div className="text-xs text-yellow-400 font-semibold">FASE 3: LLAMAINDEX</div>
                <ul className="text-sm text-slate-300 mt-1 space-y-1">
                  <li>• HierarchicalNodeParser cria nodes com contexto</li>
                  <li>• Cada chunk preserva metadados de origem</li>
                  <li>• Relacionamentos pai-filho são mantidos</li>
                </ul>
              </div>
              <div className="border-l-4 border-l-purple-500 pl-4 py-2">
                <div className="text-xs text-purple-400 font-semibold">FASE 4: EMBEDDING</div>
                <ul className="text-sm text-slate-300 mt-1 space-y-1">
                  <li>• Jina AI v3 gera embeddings multilíngues</li>
                  <li>• Matryoshka: vetores de 512 dims (economia 50%)</li>
                  <li>• Task Adapters otimizam por tipo de conteúdo</li>
                </ul>
              </div>
              <div className="border-l-4 border-l-red-500 pl-4 py-2">
                <div className="text-xs text-red-400 font-semibold">FASE 5: QDRANT</div>
                <ul className="text-sm text-slate-300 mt-1 space-y-1">
                  <li>• Vetores armazenados com payload rico</li>
                  <li>• Filtros por user_id, table_id, agent_id</li>
                  <li>• Busca híbrida: vetores densos + esparsos</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-xl font-bold mb-4">Configuração e Otimizações</h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <pre className="text-xs overflow-x-auto">
                <code className="language-yaml">{`# ai_engine/config/pipeline_config.yaml

llama_index:
  chunk_sizes:
    table_level: 2048        # Contexto completo da tabela
    column_level: 512        # Contexto da coluna
    cell_level: 128          # Valor individual
  chunk_overlap: 20          # Overlap para continuidade

docling:
  pdf:
    do_ocr: true             # OCR para PDFs escaneados
    ocr_language: "por+eng"  # Português + Inglês
    table_mode: "accurate"   # Modo preciso (vs "fast")
    max_pages: 500           # Limite de páginas
  docx:
    preserve_styles: true    # Manter formatação
    extract_images: false    # Ignorar imagens (por enquanto)

embedding:
  model: "jina-embeddings-v3"
  dimensions: 512            # Matryoshka (512 vs 1024)
  task_type: "retrieval.passage"
  batch_size: 32

qdrant:
  collection_name: "snack_knowledge"
  distance: "Cosine"
  quantization:
    enabled: true
    type: "scalar"           # Economia de 75% storage
  indexing:
    on_disk: true            # Para collections grandes
    m: 16                    # HNSW parameter
    ef_construct: 100`}</code>
              </pre>
            </div>
          </Card>
        </section>

        {/* Section 05: Data */}
        <section id="data" className="mb-20 scroll-mt-20">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-6xl font-black text-primary/20">05</span>
            <h2 className="text-3xl font-bold">Modelagem de Dados</h2>
          </div>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Schema PostgreSQL: Tabela agents</h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <pre className="text-xs overflow-x-auto">
                <code className="language-sql">{`CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    system_prompt TEXT NOT NULL, -- Encriptado em repouso
    model_config JSONB NOT NULL,
    visibility ENUM ('private', 'public_free', 'marketplace_paid') DEFAULT 'private',
    price_per_msg INTEGER, -- Custo em créditos
    is_blackbox BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_author_id (author_id),
    INDEX idx_visibility (visibility)
);`}</code>
              </pre>
            </div>
          </Card>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Schema PostgreSQL: Tabela wallets</h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <pre className="text-xs overflow-x-auto">
                <code className="language-sql">{`CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id),
    balance BIGINT DEFAULT 0, -- Armazenado em centavos
    updated_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_user_id (user_id)
);`}</code>
              </pre>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-xl font-bold mb-4">Payload do Qdrant</h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <pre className="text-xs overflow-x-auto">
                <code className="language-json">{`{
  "id": "unique-vector-id",
  "vector": [0.123, 0.456, ...],
  "payload": {
    "snack_table_id": "Table_123",
    "snack_column_id": "Col_Age",
    "snack_item_id": "Cell_ABC",
    "text_content": "Contexto: Idade do Cliente. Valor: 35 anos.",
    "source_url": "https://snackprompt.com/tables/Table_123",
    "user_id": "user_456",
    "is_public": false,
    "created_at": "2025-12-01T10:00:00Z"
  }
}`}</code>
              </pre>
            </div>
          </Card>
        </section>

        {/* Section 06: API */}
        <section id="api" className="mb-20 scroll-mt-20">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-6xl font-black text-primary/20">06</span>
            <h2 className="text-3xl font-bold">Contratos de API</h2>
          </div>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Endpoint de Chat (Streaming)</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Requisição:</h4>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <pre className="text-xs overflow-x-auto">
                    <code className="language-http">{`POST /api/v1/chat/completions
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
}`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">Resposta (Server-Sent Events):</h4>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <pre className="text-xs overflow-x-auto">
                    <code className="language-typescript">{`event: citation
data: {"ref_id": 1, "source": "Tabela Jurídica, Célula 2"}

event: token
data: {"text": "O"}

event: token
data: {"text": " contrato"}

event: done
data: {"total_tokens": 150, "credits_deducted": 2}`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-xl font-bold mb-4">Endpoint de Criação de Agente</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Requisição:</h4>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <pre className="text-xs overflow-x-auto">
                    <code className="language-json">{`POST /api/v1/agents
Authorization: Bearer <JWT_TOKEN>

{
  "title": "Advogado Sênior",
  "description": "Especialista em análise de contratos",
  "system_prompt": "Você é um advogado experiente...",
  "model_config": {
    "provider": "openai",
    "model": "gpt-4o",
    "temperature": 0.3
  },
  "visibility": "marketplace_paid",
  "price_per_msg": 5
}`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 07: Agent */}
        <section id="agent" className="mb-20 scroll-mt-20">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-6xl font-black text-primary/20">07</span>
            <h2 className="text-3xl font-bold">Lógica do Agente</h2>
          </div>

          <Card className="p-8 mb-8 bg-muted/30">
            <h3 className="text-xl font-bold mb-4">Fluxo de Decisão (MVP)</h3>
            <div className="bg-white p-6 rounded-lg">
              <img
                src="/agent_flow_diagram.png"
                alt="Fluxo do Agente"
                className="w-full h-auto"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              O agente segue uma máquina de estados que decide se reformula a pergunta, busca
              contexto no RAG, gera resposta com LLM e adiciona citações.
            </p>
          </Card>

          <Card className="p-8">
            <h3 className="text-xl font-bold mb-4">Implementação do Grafo LangGraph</h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <pre className="text-xs overflow-x-auto">
                <code className="language-python">{`def retrieval_node(state: AgentState) -> AgentState:
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
    
    state["context_chunks"] = [
        Document(
            page_content=result.payload["text_content"],
            metadata=result.payload
        )
        for result in search_results
    ]
    
    return state`}</code>
              </pre>
            </div>
          </Card>
        </section>

        {/* Section 08: Tools Architecture */}
        <section id="tools-arch" className="mb-20 scroll-mt-20">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-6xl font-black text-primary/20">08</span>
            <h2 className="text-3xl font-bold">Arquitetura de Tools</h2>
          </div>

          <Card className="p-8 mb-8 bg-muted/30">
            <h3 className="text-xl font-bold mb-4">Visão Geral do Sistema de Tools</h3>
            <p className="text-muted-foreground mb-6">
              O sistema de Tools permite que agentes executem ações além de simples consultas RAG.
              Cada tool é um módulo isolado com interface padronizada, sandbox de execução e
              sistema de permissões granular.
            </p>
            <div className="bg-white p-6 rounded-lg">
              <div className="mermaid text-sm">
                {`flowchart TB
    subgraph Agent["🤖 Agent Runtime"]
        LLM["LLM<br/>(Claude/GPT)"]
        Planner["Planning Node"]
        Executor["Tool Executor"]
    end

    subgraph Registry["📦 Tool Registry"]
        TR["Tool Registry<br/>Service"]
        TC["Tool Catalog"]
        TP["Tool Permissions"]
    end

    subgraph Tools["🔧 Tool Categories"]
        subgraph Analysis["Análise"]
            T1["calculator"]
            T2["json_analyzer"]
            T3["comparator"]
        end
        subgraph Documents["Documentos"]
            T4["pdf_generator"]
            T5["excel_processor"]
            T6["contract_builder"]
        end
        subgraph External["Externos"]
            T7["web_scraper"]
            T8["api_caller"]
            T9["email_sender"]
        end
    end

    subgraph Sandbox["🔒 Execution Sandbox"]
        Docker["Docker Container"]
        Timeout["Timeout Manager"]
        ResourceLimiter["Resource Limiter"]
    end

    LLM -->|"tool_call"| Planner
    Planner -->|"validate"| TR
    TR -->|"check"| TP
    TP -->|"authorized"| Executor
    Executor -->|"run in"| Sandbox
    Sandbox --> Tools
    Tools -->|"result"| LLM`}
              </div>
            </div>
          </Card>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Definição de Tool (Interface)</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Cada tool implementa uma interface padronizada que define nome, descrição,
              parâmetros e método de execução:
            </p>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code className="language-typescript">{`// server/tools/base.ts
import { z } from "zod";

export interface ToolDefinition<TInput, TOutput> {
  name: string;
  description: string;
  category: "analysis" | "documents" | "external" | "communication";

  // Schema de entrada (usado para validação e geração de JSON Schema)
  inputSchema: z.ZodType<TInput>;

  // Schema de saída para type-safety
  outputSchema: z.ZodType<TOutput>;

  // Permissões requeridas
  requiredPermissions: Permission[];

  // Limites de recursos
  resourceLimits: {
    maxExecutionTimeMs: number;
    maxMemoryMb: number;
    maxOutputSizeKb: number;
  };

  // Método de execução
  execute(input: TInput, context: ToolContext): Promise<TOutput>;
}

export interface ToolContext {
  userId: string;
  agentId: string;
  conversationId: string;
  kb: KnowledgeBase | null;
  logger: Logger;
}

export type Permission =
  | "kb:read"
  | "kb:write"
  | "external:http"
  | "external:email"
  | "documents:generate"
  | "documents:read";`}</code>
            </pre>
          </Card>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Exemplo: Calculator Tool</h3>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code className="language-typescript">{`// server/tools/analysis/calculator.ts
import { z } from "zod";
import { ToolDefinition, ToolContext } from "../base";
import * as mathjs from "mathjs";

const inputSchema = z.object({
  expression: z.string().describe("Mathematical expression to evaluate"),
  precision: z.number().optional().default(4).describe("Decimal precision"),
  variables: z.record(z.number()).optional().describe("Variable substitutions"),
});

const outputSchema = z.object({
  result: z.number(),
  expression: z.string(),
  steps: z.array(z.string()).optional(),
});

export const calculatorTool: ToolDefinition<
  z.infer<typeof inputSchema>,
  z.infer<typeof outputSchema>
> = {
  name: "calculator",
  description: "Evaluate mathematical expressions with support for variables",
  category: "analysis",
  inputSchema,
  outputSchema,
  requiredPermissions: [], // No special permissions needed
  resourceLimits: {
    maxExecutionTimeMs: 1000,
    maxMemoryMb: 64,
    maxOutputSizeKb: 10,
  },

  async execute(input, context) {
    const { expression, precision, variables } = input;
    context.logger.info(\`Calculating: \${expression}\`);

    // Create scope with variables
    const scope = variables || {};

    // Evaluate expression
    const result = mathjs.evaluate(expression, scope);
    const roundedResult = mathjs.round(result, precision);

    return {
      result: roundedResult,
      expression: \`\${expression} = \${roundedResult}\`,
    };
  },
};`}</code>
            </pre>
          </Card>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Tool Executor com Sandbox</h3>
            <p className="text-sm text-muted-foreground mb-4">
              O executor gerencia a execução segura de tools em containers isolados:
            </p>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code className="language-typescript">{`// server/tools/executor.ts
import { ToolDefinition, ToolContext } from "./base";
import { ToolRegistry } from "./registry";

export class ToolExecutor {
  constructor(
    private registry: ToolRegistry,
    private permissionService: PermissionService,
  ) {}

  async execute<TInput, TOutput>(
    toolName: string,
    input: TInput,
    context: ToolContext
  ): Promise<ToolResult<TOutput>> {
    const tool = this.registry.get(toolName);
    if (!tool) {
      return { success: false, error: \`Tool '\${toolName}' not found\` };
    }

    // 1. Validate permissions
    const hasPermission = await this.permissionService.check(
      context.userId,
      context.agentId,
      tool.requiredPermissions
    );
    if (!hasPermission) {
      return { success: false, error: "Permission denied" };
    }

    // 2. Validate input
    const validation = tool.inputSchema.safeParse(input);
    if (!validation.success) {
      return { success: false, error: validation.error.message };
    }

    // 3. Execute with timeout and resource limits
    try {
      const result = await this.executeWithLimits(
        tool,
        validation.data,
        context
      );

      // 4. Validate output
      const outputValidation = tool.outputSchema.safeParse(result);
      if (!outputValidation.success) {
        return { success: false, error: "Invalid tool output" };
      }

      return { success: true, data: outputValidation.data };
    } catch (error) {
      context.logger.error(\`Tool execution failed: \${error}\`);
      return { success: false, error: String(error) };
    }
  }

  private async executeWithLimits<TInput, TOutput>(
    tool: ToolDefinition<TInput, TOutput>,
    input: TInput,
    context: ToolContext
  ): Promise<TOutput> {
    const { maxExecutionTimeMs } = tool.resourceLimits;

    return Promise.race([
      tool.execute(input, context),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), maxExecutionTimeMs)
      ),
    ]);
  }
}`}</code>
            </pre>
          </Card>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Tool Registry</h3>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code className="language-typescript">{`// server/tools/registry.ts
import { ToolDefinition } from "./base";
import { calculatorTool } from "./analysis/calculator";
import { jsonAnalyzerTool } from "./analysis/json-analyzer";
import { comparatorTool } from "./analysis/comparator";
import { pdfGeneratorTool } from "./documents/pdf-generator";
import { excelProcessorTool } from "./documents/excel-processor";
import { webScraperTool } from "./external/web-scraper";
import { apiCallerTool } from "./external/api-caller";
import { emailSenderTool } from "./communication/email-sender";

export class ToolRegistry {
  private tools = new Map<string, ToolDefinition<any, any>>();

  constructor() {
    // Register built-in tools
    this.register(calculatorTool);
    this.register(jsonAnalyzerTool);
    this.register(comparatorTool);
    this.register(pdfGeneratorTool);
    this.register(excelProcessorTool);
    this.register(webScraperTool);
    this.register(apiCallerTool);
    this.register(emailSenderTool);
  }

  register<TInput, TOutput>(tool: ToolDefinition<TInput, TOutput>) {
    this.tools.set(tool.name, tool);
  }

  get(name: string): ToolDefinition<any, any> | undefined {
    return this.tools.get(name);
  }

  list(): ToolDefinition<any, any>[] {
    return Array.from(this.tools.values());
  }

  listByCategory(category: string): ToolDefinition<any, any>[] {
    return this.list().filter(t => t.category === category);
  }

  // Generate OpenAI-compatible function definitions
  toFunctionDefinitions(): FunctionDefinition[] {
    return this.list().map(tool => ({
      name: tool.name,
      description: tool.description,
      parameters: zodToJsonSchema(tool.inputSchema),
    }));
  }
}`}</code>
            </pre>
          </Card>

          <Card className="p-8">
            <h3 className="text-xl font-bold mb-4">Integração com LangGraph</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Os tools são integrados ao fluxo do agente através de um nó dedicado:
            </p>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code className="language-python">{`# ai_engine/nodes/tool_node.py
from typing import TypedDict, List, Any
from langgraph.graph import StateGraph

class AgentState(TypedDict):
    messages: List[dict]
    tool_calls: List[dict]
    tool_results: List[dict]
    context_chunks: List[Document]

async def tool_executor_node(state: AgentState) -> AgentState:
    """Execute pending tool calls and return results."""

    tool_calls = state.get("tool_calls", [])
    results = []

    for call in tool_calls:
        tool_name = call["name"]
        tool_input = call["arguments"]

        # Call the tool registry via internal API
        result = await execute_tool(
            tool_name=tool_name,
            input=tool_input,
            context={
                "user_id": state["user_id"],
                "agent_id": state["agent_id"],
                "conversation_id": state["conversation_id"],
            }
        )

        results.append({
            "tool_call_id": call["id"],
            "name": tool_name,
            "result": result,
        })

    return {
        **state,
        "tool_results": results,
        "tool_calls": [],  # Clear pending calls
    }

def should_use_tools(state: AgentState) -> str:
    """Routing function: decide if we need to execute tools."""
    last_message = state["messages"][-1]

    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "execute_tools"
    return "generate_response"

# Graph construction
graph = StateGraph(AgentState)
graph.add_node("planner", planner_node)
graph.add_node("execute_tools", tool_executor_node)
graph.add_node("generate", generate_response_node)

graph.add_conditional_edges(
    "planner",
    should_use_tools,
    {
        "execute_tools": "execute_tools",
        "generate_response": "generate",
    }
)
graph.add_edge("execute_tools", "planner")  # Loop back for more reasoning`}</code>
            </pre>
          </Card>
        </section>

        {/* Section 09: Agent Builder (React Flow) */}
        <section id="agent-builder-tech" className="mb-20 scroll-mt-20">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-6xl font-black text-primary/20">09</span>
            <h2 className="text-3xl font-bold">Agent Builder (React Flow)</h2>
          </div>

          <Card className="p-8 mb-8 bg-muted/30">
            <h3 className="text-xl font-bold mb-4">Arquitetura do Visual Builder</h3>
            <p className="text-muted-foreground mb-6">
              O Agent Builder utiliza React Flow (@xyflow/react) para criar uma interface
              visual drag-and-drop onde usuários Enterprise podem montar fluxos de agentes
              complexos sem código.
            </p>
            <div className="bg-white p-6 rounded-lg">
              <div className="mermaid text-sm">
                {`flowchart TB
    subgraph Frontend["🎨 React Frontend"]
        RF["React Flow<br/>Canvas"]
        NS["Node Sidebar<br/>(Drag Source)"]
        PP["Properties Panel"]
        TB["Toolbar"]
    end

    subgraph State["📊 State Management"]
        ZS["Zustand Store"]
        FH["Flow History<br/>(Undo/Redo)"]
        VAL["Validator"]
    end

    subgraph Backend["⚙️ Backend Services"]
        API["tRPC API"]
        Compiler["Flow Compiler"]
        DB[(PostgreSQL)]
    end

    subgraph Runtime["🚀 Agent Runtime"]
        LG["LangGraph<br/>Executor"]
        Tools["Tool Registry"]
    end

    NS -->|"drag"| RF
    RF -->|"update"| ZS
    PP -->|"edit props"| ZS
    ZS -->|"history"| FH
    ZS -->|"validate"| VAL

    TB -->|"save"| API
    API -->|"compile"| Compiler
    Compiler -->|"store"| DB

    API -->|"execute"| LG
    LG --> Tools`}
              </div>
            </div>
          </Card>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Stack Tecnológica</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Frontend</h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <strong>@xyflow/react</strong> - Canvas drag-and-drop
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <strong>Zustand</strong> - State management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <strong>React Hook Form + Zod</strong> - Node properties
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <strong>TailwindCSS</strong> - Styling
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-green-600">Backend</h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <strong>tRPC</strong> - Type-safe API
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <strong>Flow Compiler</strong> - JSON → LangGraph
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <strong>Drizzle ORM</strong> - Persistência
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <strong>Redis</strong> - Cache de compilação
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Schema do Flow (JSON)</h3>
            <p className="text-sm text-muted-foreground mb-4">
              O fluxo visual é serializado em JSON para persistência e compilação:
            </p>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code className="language-typescript">{`// shared/types/agent-flow.ts
import { z } from "zod";

// Node types available in the builder
export const NodeTypeEnum = z.enum([
  "start",           // Entry point
  "llm",             // LLM call (Claude/GPT)
  "rag",             // Knowledge base query
  "tool",            // Tool execution
  "condition",       // Conditional branching
  "loop",            // Iteration over data
  "human_input",     // Wait for user input
  "output",          // Final response
]);

// Base node schema
export const FlowNodeSchema = z.object({
  id: z.string().uuid(),
  type: NodeTypeEnum,
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: z.record(z.unknown()), // Type-specific data
});

// Edge (connection) schema
export const FlowEdgeSchema = z.object({
  id: z.string().uuid(),
  source: z.string().uuid(),
  target: z.string().uuid(),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
  label: z.string().optional(),
  animated: z.boolean().optional(),
});

// Complete flow schema
export const AgentFlowSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  version: z.number().int().positive(),

  nodes: z.array(FlowNodeSchema),
  edges: z.array(FlowEdgeSchema),

  // Flow-level settings
  settings: z.object({
    defaultModel: z.enum(["claude-sonnet", "claude-opus", "gpt-4o"]),
    maxIterations: z.number().int().min(1).max(50).default(10),
    timeoutSeconds: z.number().int().min(30).max(300).default(120),
  }),

  // Metadata
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().uuid(),
});

export type AgentFlow = z.infer<typeof AgentFlowSchema>;
export type FlowNode = z.infer<typeof FlowNodeSchema>;
export type FlowEdge = z.infer<typeof FlowEdgeSchema>;`}</code>
            </pre>
          </Card>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Node Types e Configurações</h3>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code className="language-typescript">{`// shared/types/node-configs.ts
import { z } from "zod";

// LLM Node configuration
export const LLMNodeDataSchema = z.object({
  model: z.enum(["claude-sonnet", "claude-opus", "gpt-4o", "gpt-4o-mini"]),
  systemPrompt: z.string().max(10000),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().int().min(100).max(8000).default(2000),
  tools: z.array(z.string()).optional(), // Tool names to enable
});

// RAG Node configuration
export const RAGNodeDataSchema = z.object({
  knowledgeBaseId: z.string().uuid(),
  queryTemplate: z.string(), // Template with {{variables}}
  topK: z.number().int().min(1).max(20).default(5),
  scoreThreshold: z.number().min(0).max(1).default(0.7),
  includeMetadata: z.boolean().default(true),
});

// Tool Node configuration
export const ToolNodeDataSchema = z.object({
  toolName: z.string(),
  inputMapping: z.record(z.string()), // Map flow variables to tool inputs
  outputVariable: z.string(), // Variable name for tool output
});

// Condition Node configuration
export const ConditionNodeDataSchema = z.object({
  conditions: z.array(z.object({
    id: z.string(),
    variable: z.string(),
    operator: z.enum(["equals", "contains", "gt", "lt", "regex", "exists"]),
    value: z.string(),
    targetHandle: z.string(), // Which output handle to use
  })),
  defaultHandle: z.string(), // Fallback if no condition matches
});

// Loop Node configuration
export const LoopNodeDataSchema = z.object({
  iterateOver: z.string(), // Variable containing array
  itemVariable: z.string(), // Variable name for current item
  indexVariable: z.string().optional(), // Variable name for index
  maxIterations: z.number().int().min(1).max(100).default(10),
});

// Human Input Node configuration
export const HumanInputNodeDataSchema = z.object({
  promptTemplate: z.string(), // What to ask the user
  inputVariable: z.string(), // Where to store the response
  inputType: z.enum(["text", "choice", "file"]).default("text"),
  choices: z.array(z.string()).optional(), // For choice type
  required: z.boolean().default(true),
});`}</code>
            </pre>
          </Card>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Zustand Store para o Builder</h3>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code className="language-typescript">{`// client/src/stores/flow-builder-store.ts
import { create } from "zustand";
import { temporal } from "zundo";
import {
  Node,
  Edge,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Connection,
  NodeChange,
  EdgeChange,
} from "@xyflow/react";

interface FlowBuilderState {
  // Flow data
  nodes: Node[];
  edges: Edge[];
  flowId: string | null;
  flowName: string;

  // UI state
  selectedNodeId: string | null;
  isPanelOpen: boolean;
  isDirty: boolean;

  // Actions
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  addNode: (type: string, position: { x: number; y: number }) => void;
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;
  deleteNode: (nodeId: string) => void;

  selectNode: (nodeId: string | null) => void;
  setFlowName: (name: string) => void;

  // Persistence
  loadFlow: (flow: AgentFlow) => void;
  toJSON: () => AgentFlow;
  reset: () => void;
}

export const useFlowBuilderStore = create<FlowBuilderState>()(
  temporal(
    (set, get) => ({
      nodes: [],
      edges: [],
      flowId: null,
      flowName: "Untitled Flow",
      selectedNodeId: null,
      isPanelOpen: false,
      isDirty: false,

      onNodesChange: (changes) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
          isDirty: true,
        });
      },

      onEdgesChange: (changes) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
          isDirty: true,
        });
      },

      onConnect: (connection) => {
        set({
          edges: addEdge(connection, get().edges),
          isDirty: true,
        });
      },

      addNode: (type, position) => {
        const newNode: Node = {
          id: crypto.randomUUID(),
          type,
          position,
          data: getDefaultNodeData(type),
        };
        set({
          nodes: [...get().nodes, newNode],
          selectedNodeId: newNode.id,
          isPanelOpen: true,
          isDirty: true,
        });
      },

      updateNodeData: (nodeId, data) => {
        set({
          nodes: get().nodes.map((node) =>
            node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
          ),
          isDirty: true,
        });
      },

      deleteNode: (nodeId) => {
        set({
          nodes: get().nodes.filter((n) => n.id !== nodeId),
          edges: get().edges.filter(
            (e) => e.source !== nodeId && e.target !== nodeId
          ),
          selectedNodeId: null,
          isDirty: true,
        });
      },

      selectNode: (nodeId) => {
        set({ selectedNodeId: nodeId, isPanelOpen: !!nodeId });
      },

      setFlowName: (name) => {
        set({ flowName: name, isDirty: true });
      },

      loadFlow: (flow) => {
        set({
          flowId: flow.id,
          flowName: flow.name,
          nodes: flow.nodes,
          edges: flow.edges,
          isDirty: false,
        });
      },

      toJSON: () => {
        const state = get();
        return {
          id: state.flowId || crypto.randomUUID(),
          name: state.flowName,
          nodes: state.nodes,
          edges: state.edges,
          // ... other fields
        };
      },

      reset: () => {
        set({
          nodes: [],
          edges: [],
          flowId: null,
          flowName: "Untitled Flow",
          selectedNodeId: null,
          isDirty: false,
        });
      },
    }),
    { limit: 50 } // Keep 50 history states for undo/redo
  )
);`}</code>
            </pre>
          </Card>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Custom Nodes com React Flow</h3>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code className="language-typescript">{`// client/src/components/flow-builder/nodes/LLMNode.tsx
import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface LLMNodeData {
  model: string;
  systemPrompt: string;
  temperature: number;
}

export const LLMNode = memo(({ data, selected }: NodeProps<LLMNodeData>) => {
  return (
    <div
      className={cn(
        "px-4 py-3 rounded-lg border-2 bg-white shadow-md min-w-[200px]",
        selected ? "border-primary ring-2 ring-primary/20" : "border-slate-200"
      )}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-slate-400 border-2 border-white"
      />

      {/* Node Content */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-purple-100">
          <Brain className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h4 className="font-semibold text-sm">LLM</h4>
          <p className="text-xs text-muted-foreground">{data.model}</p>
        </div>
      </div>

      {/* Preview of system prompt */}
      {data.systemPrompt && (
        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
          {data.systemPrompt}
        </p>
      )}

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-primary border-2 border-white"
      />
    </div>
  );
});

LLMNode.displayName = "LLMNode";

// Register all custom nodes
export const nodeTypes = {
  start: StartNode,
  llm: LLMNode,
  rag: RAGNode,
  tool: ToolNode,
  condition: ConditionNode,
  loop: LoopNode,
  human_input: HumanInputNode,
  output: OutputNode,
};`}</code>
            </pre>
          </Card>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Flow Builder Component</h3>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code className="language-typescript">{`// client/src/components/flow-builder/FlowBuilder.tsx
import { useCallback, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useFlowBuilderStore } from "@/stores/flow-builder-store";
import { nodeTypes } from "./nodes";
import { NodeSidebar } from "./NodeSidebar";
import { PropertiesPanel } from "./PropertiesPanel";
import { FlowToolbar } from "./FlowToolbar";

export function FlowBuilder() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    selectedNodeId,
  } = useFlowBuilderStore();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type || !reactFlowWrapper.current) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };

      addNode(type, position);
    },
    [addNode]
  );

  return (
    <div className="h-screen flex">
      {/* Left Sidebar - Node Types */}
      <NodeSidebar />

      {/* Main Canvas */}
      <div ref={reactFlowWrapper} className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid
          snapGrid={[15, 15]}
        >
          <Background gap={15} size={1} />
          <Controls />
          <MiniMap />

          <Panel position="top-center">
            <FlowToolbar />
          </Panel>
        </ReactFlow>
      </div>

      {/* Right Panel - Node Properties */}
      {selectedNodeId && <PropertiesPanel />}
    </div>
  );
}

export function FlowBuilderPage() {
  return (
    <ReactFlowProvider>
      <FlowBuilder />
    </ReactFlowProvider>
  );
}`}</code>
            </pre>
          </Card>

          <Card className="p-8">
            <h3 className="text-xl font-bold mb-4">Flow Compiler (JSON → LangGraph)</h3>
            <p className="text-sm text-muted-foreground mb-4">
              O compilador transforma o JSON visual em código LangGraph executável:
            </p>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code className="language-python">{`# ai_engine/compiler/flow_compiler.py
from typing import Dict, Any, List
from langgraph.graph import StateGraph, END
from .node_factories import (
    create_llm_node,
    create_rag_node,
    create_tool_node,
    create_condition_router,
    create_loop_node,
    create_human_input_node,
)

class FlowCompiler:
    """Compiles visual flow JSON into executable LangGraph."""

    def __init__(self, tool_registry, kb_service):
        self.tool_registry = tool_registry
        self.kb_service = kb_service

    def compile(self, flow_json: Dict[str, Any]) -> StateGraph:
        """
        Transform visual flow definition into LangGraph.

        Args:
            flow_json: The flow definition from the builder

        Returns:
            Compiled StateGraph ready for execution
        """
        nodes = flow_json["nodes"]
        edges = flow_json["edges"]
        settings = flow_json.get("settings", {})

        # Create the graph
        graph = StateGraph(AgentState)

        # Build adjacency list for edge lookups
        adjacency = self._build_adjacency(edges)

        # Add nodes
        for node in nodes:
            node_id = node["id"]
            node_type = node["type"]
            node_data = node["data"]

            if node_type == "start":
                # Start node just passes through
                graph.set_entry_point(node_id)
                graph.add_node(node_id, lambda s: s)

            elif node_type == "llm":
                llm_node = create_llm_node(
                    model=node_data["model"],
                    system_prompt=node_data["systemPrompt"],
                    temperature=node_data.get("temperature", 0.7),
                    tools=node_data.get("tools", []),
                    tool_registry=self.tool_registry,
                )
                graph.add_node(node_id, llm_node)

            elif node_type == "rag":
                rag_node = create_rag_node(
                    kb_id=node_data["knowledgeBaseId"],
                    query_template=node_data["queryTemplate"],
                    top_k=node_data.get("topK", 5),
                    kb_service=self.kb_service,
                )
                graph.add_node(node_id, rag_node)

            elif node_type == "tool":
                tool_node = create_tool_node(
                    tool_name=node_data["toolName"],
                    input_mapping=node_data["inputMapping"],
                    output_var=node_data["outputVariable"],
                    tool_registry=self.tool_registry,
                )
                graph.add_node(node_id, tool_node)

            elif node_type == "condition":
                # Condition nodes need special routing
                router = create_condition_router(node_data["conditions"])
                graph.add_node(node_id, lambda s: s)  # Pass-through

                # Add conditional edges
                for condition in node_data["conditions"]:
                    target = self._find_target(edges, node_id, condition["targetHandle"])
                    graph.add_conditional_edges(
                        node_id,
                        router,
                        {condition["id"]: target}
                    )
                continue  # Skip normal edge handling

            elif node_type == "output":
                graph.add_node(node_id, lambda s: s)
                graph.add_edge(node_id, END)
                continue

        # Add edges (for non-conditional nodes)
        for node in nodes:
            if node["type"] not in ["condition", "output"]:
                targets = adjacency.get(node["id"], [])
                for target in targets:
                    graph.add_edge(node["id"], target)

        return graph.compile()

    def _build_adjacency(self, edges: List[Dict]) -> Dict[str, List[str]]:
        adjacency = {}
        for edge in edges:
            source = edge["source"]
            target = edge["target"]
            if source not in adjacency:
                adjacency[source] = []
            adjacency[source].append(target)
        return adjacency

    def _find_target(self, edges, source_id, handle) -> str:
        for edge in edges:
            if edge["source"] == source_id and edge.get("sourceHandle") == handle:
                return edge["target"]
        raise ValueError(f"No target found for {source_id}:{handle}")`}</code>
            </pre>
          </Card>
        </section>

        {/* Section 10: Citations System */}
        <section id="citations-tech" className="mb-20 scroll-mt-20">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-6xl font-black text-primary/20">10</span>
            <h2 className="text-3xl font-bold">Sistema de Citações</h2>
          </div>

          <Card className="p-8 mb-8 bg-muted/30">
            <h3 className="text-xl font-bold mb-4">Arquitetura de Citações</h3>
            <p className="text-muted-foreground mb-6">
              O sistema de citações garante rastreabilidade completa das informações,
              conectando cada afirmação do agente aos dados originais na Knowledge Base.
            </p>
            <div className="bg-white p-6 rounded-lg">
              <div className="mermaid text-sm">
{`flowchart TB
    subgraph Retrieval["Retrieval Phase"]
        Q["User Query"]
        VDB["Qdrant Vector DB"]
        CHUNKS["Retrieved Chunks"]
    end

    subgraph LLM["LLM Processing"]
        CTX["Context Assembly"]
        GEN["Response Generation"]
        CITE["Citation Injection"]
    end

    subgraph Output["Output Processing"]
        PARSE["Citation Parser"]
        LINK["Deep Link Generator"]
        RENDER["Frontend Renderer"]
    end

    Q --> VDB
    VDB --> CHUNKS
    CHUNKS --> CTX
    CTX --> GEN
    GEN --> CITE
    CITE --> PARSE
    PARSE --> LINK
    LINK --> RENDER`}
              </div>
            </div>
          </Card>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Payload Qdrant com Metadados</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Cada vetor armazenado no Qdrant inclui metadados ricos para gerar citações precisas:
            </p>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code className="language-json">{`{
  "id": "vec_abc123",
  "vector": [0.123, 0.456, ...],
  "payload": {
    "snack_table_id": "tbl_financeiro_2024",
    "snack_column_id": "col_taxas",
    "snack_item_id": "item_linha_12",

    "text_content": "Taxa máxima de juros: 12% ao ano conforme Art. 591",

    "citation_metadata": {
      "table_name": "Legislação Financeira",
      "column_name": "Limites de Juros",
      "row_index": 12,
      "source_url": "https://app.snackprompt.com/kb/tbl_123/item_456",
      "created_at": "2024-01-15T10:30:00Z",
      "confidence_score": 0.95
    },

    "access_control": {
      "owner_id": "user_creator_xyz",
      "visibility": "agent_blackbox",
      "allowed_agents": ["agent_advogado_123"]
    }
  }
}`}</code>
            </pre>
          </Card>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Citation Processor (Python)</h3>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code className="language-python">{`# ai_engine/citations/processor.py
from typing import List, Dict, Any
from langchain_core.documents import Document
from pydantic import BaseModel

class Citation(BaseModel):
    ref_id: int
    text_snippet: str
    source_table: str
    source_column: str
    source_row: int
    source_url: str
    relevance_score: float

class CitationProcessor:
    """Processa source_documents do LangChain em citações."""

    def extract_citations(
        self,
        source_documents: List[Document],
        response_text: str
    ) -> tuple[str, List[Citation]]:
        citations = []

        for idx, doc in enumerate(source_documents, start=1):
            metadata = doc.metadata
            citation = Citation(
                ref_id=idx,
                text_snippet=doc.page_content[:200],
                source_table=metadata.get("table_name", "Unknown"),
                source_column=metadata.get("column_name", "Unknown"),
                source_row=metadata.get("row_index", 0),
                source_url=self._build_deep_link(metadata),
                relevance_score=metadata.get("score", 0.0)
            )
            citations.append(citation)

        annotated_text = self._inject_references(
            response_text, source_documents, citations
        )
        return annotated_text, citations

    def _build_deep_link(self, metadata: Dict[str, Any]) -> str:
        table_id = metadata.get("snack_table_id", "")
        item_id = metadata.get("snack_item_id", "")
        return f"/kb/{table_id}/item/{item_id}"`}</code>
            </pre>
          </Card>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">API Response Schema</h3>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code className="language-typescript">{`// shared/types/chat-response.ts
interface ChatResponse {
  message: {
    role: "assistant";
    content: string;  // Texto com [1], [2], etc.
  };
  citations: Citation[];
  metadata: {
    model: string;
    tokens_used: number;
    processing_time_ms: number;
  };
}

interface Citation {
  ref_id: number;           // [1], [2], etc.
  text_snippet: string;     // Preview do conteúdo
  source: {
    table_id: string;
    table_name: string;
    column_name: string;
    row_index: number;
    cell_value: string;
  };
  deep_link: string;        // URL para navegação direta
  relevance_score: number;  // 0.0 - 1.0
}`}</code>
            </pre>
          </Card>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Citation Renderer (React)</h3>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code className="language-typescript">{`// client/src/components/chat/CitationRenderer.tsx
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  content: string;
  citations: Citation[];
}

export function CitationRenderer({ content, citations }: Props) {
  const [activeDrawer, setActiveDrawer] = useState<Citation | null>(null);
  const citationPattern = /\\[(\\d+(?:,\\d+)*)\\]/g;

  const renderContent = () => {
    const parts = content.split(citationPattern);

    return parts.map((part, index) => {
      if (/^\\d+(?:,\\d+)*$/.test(part)) {
        const refIds = part.split(",").map(Number);
        const relatedCitations = refIds
          .map(id => citations.find(c => c.ref_id === id))
          .filter(Boolean);

        return (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <button
                className="w-5 h-5 text-xs rounded-full bg-primary/10
                           text-primary hover:bg-primary/20 mx-0.5"
                onClick={() => setActiveDrawer(relatedCitations[0]!)}
              >
                {part}
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              {relatedCitations.map(c => (
                <div key={c!.ref_id} className="text-xs">
                  <p className="font-medium">[{c!.ref_id}] {c!.source.table_name}</p>
                  <p className="text-muted-foreground">{c!.text_snippet}</p>
                </div>
              ))}
            </TooltipContent>
          </Tooltip>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="prose prose-sm">{renderContent()}</div>
  );
}`}</code>
            </pre>
          </Card>

          <Card className="p-8">
            <h3 className="text-xl font-bold mb-4">Configuração por Agente</h3>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code className="language-typescript">{`interface AgentCitationConfig {
  enabled: boolean;                    // Ativar citações
  style: "inline" | "footnote";        // [1] no texto vs rodapé
  showRelevanceScore: boolean;         // Mostrar % de relevância
  minRelevanceThreshold: number;       // Score mínimo (0.0-1.0)
  maxCitationsPerResponse: number;     // Limite de citações
  allowDeepLinks: boolean;             // Permitir links para KB
}

const defaultConfig: AgentCitationConfig = {
  enabled: true,
  style: "inline",
  showRelevanceScore: false,
  minRelevanceThreshold: 0.7,
  maxCitationsPerResponse: 10,
  allowDeepLinks: true,
};`}</code>
            </pre>
          </Card>
        </section>

        {/* Section 11: Security */}
        <section id="security" className="mb-20 scroll-mt-20">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-6xl font-black text-primary/20">11</span>
            <h2 className="text-3xl font-bold">Arquitetura de Segurança</h2>
          </div>

          <Card className="p-8 mb-8 bg-muted/30">
            <h3 className="text-xl font-bold mb-4">O "Proxy Blindado"</h3>
            <div className="bg-white p-6 rounded-lg">
              <img
                src="/security_diagram.png"
                alt="Arquitetura de Segurança"
                className="w-full h-auto"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              O sistema garante que prompts de agentes pagos permaneçam privados. O Backend Go
              valida autenticação e autorização, o AI Engine executa o agente com prompt
              encriptado, e apenas a resposta final é retornada ao usuário.
            </p>
          </Card>

          <Card className="p-8">
            <h3 className="text-xl font-bold mb-4">Fluxo de Execução Segura</h3>
            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Validação no Backend Go</h4>
                  <p className="text-muted-foreground">
                    Verifica autenticação, compra do agente e saldo de créditos
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Geração de JWT Temporário</h4>
                  <p className="text-muted-foreground">
                    Token com 5 minutos de validade contendo IDs permitidos
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Execução no AI Engine</h4>
                  <p className="text-muted-foreground">
                    Descriptografa prompt em memória, executa agente com chave da plataforma
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  4
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Retorno Seguro</h4>
                  <p className="text-muted-foreground">
                    Apenas resposta final e citações são retornadas, prompt permanece oculto
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 12: Performance */}
        <section id="performance" className="mb-20 scroll-mt-20">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-6xl font-black text-primary/20">12</span>
            <h2 className="text-3xl font-bold">Performance e Escalabilidade</h2>
          </div>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-6">Otimizações de Latência</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Otimização</th>
                    <th className="text-left py-3 px-4 font-semibold">Impacto</th>
                    <th className="text-left py-3 px-4 font-semibold">Implementação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Caching de Embeddings</td>
                    <td className="py-3 px-4 text-muted-foreground">Reduz custo em 70%</td>
                    <td className="py-3 px-4">
                      <code className="text-xs bg-muted px-2 py-1 rounded">Redis TTL 24h</code>
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Quantização de Vetores</td>
                    <td className="py-3 px-4 text-muted-foreground">Reduz tamanho em 4x</td>
                    <td className="py-3 px-4">
                      <code className="text-xs bg-muted px-2 py-1 rounded">Qdrant int8</code>
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Busca Híbrida</td>
                    <td className="py-3 px-4 text-muted-foreground">Melhora precisão em 40%</td>
                    <td className="py-3 px-4">
                      <code className="text-xs bg-muted px-2 py-1 rounded">Dense + Sparse</code>
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Streaming SSE</td>
                    <td className="py-3 px-4 text-muted-foreground">Melhora UX em 60%</td>
                    <td className="py-3 px-4">
                      <code className="text-xs bg-muted px-2 py-1 rounded">FastAPI SSE</code>
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Connection Pooling</td>
                    <td className="py-3 px-4 text-muted-foreground">Reduz overhead</td>
                    <td className="py-3 px-4">
                      <code className="text-xs bg-muted px-2 py-1 rounded">PgBouncer</code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-xl font-bold mb-4">Escalabilidade Horizontal</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold text-primary mb-2">AI Engine</h4>
                <p className="text-sm text-muted-foreground">
                  Stateless, pode ter N réplicas atrás de um load balancer
                </p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold text-primary mb-2">RabbitMQ</h4>
                <p className="text-sm text-muted-foreground">
                  Configurado em cluster para alta disponibilidade
                </p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Qdrant</h4>
                <p className="text-sm text-muted-foreground">
                  Suporta replicação e sharding para distribuição de dados
                </p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold text-primary mb-2">PostgreSQL</h4>
                <p className="text-sm text-muted-foreground">
                  Replicação read-only para distribuir leituras
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 13: Implementation */}
        <section id="implementation" className="mb-20 scroll-mt-20">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-6xl font-black text-primary/20">13</span>
            <h2 className="text-3xl font-bold">Plano de Implementação</h2>
          </div>

          <div className="space-y-6">
            <Card className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold">Fase 1: Fundação</h3>
                  <p className="text-sm text-muted-foreground">Semanas 1-4</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground ml-16">
                <li className="flex gap-2">
                  <span className="text-primary">□</span>
                  <span>Setup de infraestrutura (Qdrant, RabbitMQ, PostgreSQL)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">□</span>
                  <span>Implementação do módulo de ingestão (LlamaIndex + Jina)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">□</span>
                  <span>Testes de sincronização de dados</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">□</span>
                  <span>Chat básico com citações</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold">Fase 2: Agentes e API</h3>
                  <p className="text-sm text-muted-foreground">Semanas 5-8</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground ml-16">
                <li className="flex gap-2">
                  <span className="text-primary">□</span>
                  <span>Implementação do LangGraph</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">□</span>
                  <span>Agent Builder UI</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">□</span>
                  <span>API externa com autenticação JWT</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">□</span>
                  <span>Testes de carga</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold">Fase 3: Marketplace</h3>
                  <p className="text-sm text-muted-foreground">Semanas 9-12</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground ml-16">
                <li className="flex gap-2">
                  <span className="text-primary">□</span>
                  <span>Sistema de créditos e faturamento</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">□</span>
                  <span>Proteção de IP (Proxy Blindado)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">□</span>
                  <span>Marketplace UI</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">□</span>
                  <span>Sistema de comissões</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Section 14: Checklist */}
        <section id="checklist" className="mb-20 scroll-mt-20">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-6xl font-black text-primary/20">14</span>
            <h2 className="text-3xl font-bold">Checklist de Decisões Técnicas</h2>
          </div>

          <Card className="p-8">
            <p className="text-sm text-muted-foreground mb-6">
              Pontos críticos que requerem discussão e aprovação do time técnico antes da
              implementação:
            </p>

            <div className="space-y-3">
              {[
                "Aprovamos a modelagem de dados? Há sugestões?",
                "Qdrant é a melhor escolha para Vector DB?",
                "FastAPI ou Flask para o AI Engine?",
                "Onde guardaremos a chave de criptografia dos System Prompts? (Vault, Env Var, AWS KMS?)",
                "O Frontend está confortável em consumir Server-Sent Events?",
                "Implementaremos Self-Correction no MVP ou deixamos para v2?",
              ].map((item, index) => (
                <div key={index} className="flex gap-3 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="flex-shrink-0 w-6 h-6 rounded border-2 border-muted-foreground/30"></div>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8 mt-8 bg-primary/5 border-primary/20">
            <h3 className="text-xl font-bold mb-4">Referências Técnicas</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Qdrant Documentation</h4>
                <a
                  href="https://qdrant.tech/documentation/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  qdrant.tech/documentation
                </a>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Jina Embeddings</h4>
                <a
                  href="https://jina.ai/embeddings/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  jina.ai/embeddings
                </a>
              </div>
              <div>
                <h4 className="font-semibold mb-2">LangChain LangGraph</h4>
                <a
                  href="https://github.com/langchain-ai/langgraph"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  github.com/langchain-ai/langgraph
                </a>
              </div>
              <div>
                <h4 className="font-semibold mb-2">FastAPI Documentation</h4>
                <a
                  href="https://fastapi.tiangolo.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  fastapi.tiangolo.com
                </a>
              </div>
            </div>
          </Card>
        </section>
      </>
    );
  }

  function renderBusinessContent() {
    return (
      <>
        {/* Section 01: Business Model */}
        <section id="business-model" className="mb-20 scroll-mt-20">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-6xl font-black text-primary/20">01</span>
            <h2 className="text-3xl font-bold">Modelo de Negócio</h2>
          </div>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Visão Geral do Modelo</h3>
            <p className="text-sm text-muted-foreground mb-6">
              O Snack Prompt 3.0 opera em um modelo de <strong className="text-foreground">marketplace bilateral</strong>, conectando criadores de agentes especializados com empresas que buscam soluções de IA corporativa. A plataforma gera receita através de três pilares principais: assinaturas mensais (SaaS), comissões sobre transações no marketplace e planos enterprise customizados.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 border-2 border-primary/20 rounded-lg">
                <div className="text-3xl font-black text-primary mb-2">40%</div>
                <h4 className="font-semibold mb-2">Assinaturas SaaS</h4>
                <p className="text-xs text-muted-foreground">
                  Receita recorrente de planos PRO e Premium com acesso à Knowledge Base ativa
                </p>
              </div>
              <div className="p-6 border-2 border-primary/20 rounded-lg">
                <div className="text-3xl font-black text-primary mb-2">35%</div>
                <h4 className="font-semibold mb-2">Marketplace</h4>
                <p className="text-xs text-muted-foreground">
                  Comissões de 20-30% sobre vendas de agentes especializados no marketplace
                </p>
              </div>
              <div className="p-6 border-2 border-primary/20 rounded-lg">
                <div className="text-3xl font-black text-primary mb-2">25%</div>
                <h4 className="font-semibold mb-2">Enterprise</h4>
                <p className="text-xs text-muted-foreground">
                  Contratos customizados com SLA, suporte dedicado e infraestrutura isolada
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-xl font-bold mb-4">Proposta de Valor</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Para Empresas</h4>
                  <p className="text-sm text-muted-foreground">
                    Transforme dados corporativos em inteligência ativa sem risco de vazamento. Acesse agentes especializados criados por experts do setor sem necessidade de desenvolver internamente.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Para Criadores de Agentes</h4>
                  <p className="text-sm text-muted-foreground">
                    Monetize seu conhecimento criando agentes especializados. Proteja sua propriedade intelectual com o sistema "Proxy Blindado" e receba 70-80% da receita gerada.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Para a Plataforma</h4>
                  <p className="text-sm text-muted-foreground">
                    Efeito de rede: quanto mais agentes de qualidade, mais empresas. Quanto mais empresas, mais criadores. Dados de uso melhoram recomendações e aumentam conversão.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 02: Credits System */}
        <section id="credits" className="mb-20 scroll-mt-20">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-6xl font-black text-primary/20">02</span>
            <h2 className="text-3xl font-bold">Sistema de Créditos Snack</h2>
          </div>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Mecânica de Créditos</h3>
            <p className="text-sm text-muted-foreground mb-6">
              O sistema de créditos Snack funciona como uma moeda interna que abstrai os custos de IA e simplifica a precificação para o usuário final. <strong className="text-foreground">1 Crédito Snack = R$ 0,10</strong> (aproximadamente USD 0.02).
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-primary/5 rounded-lg">
                <h4 className="font-semibold text-primary mb-3">Consumo de Créditos</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex justify-between">
                    <span>Mensagem de chat simples (sem RAG)</span>
                    <strong className="text-foreground">1-2 créditos</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Mensagem com RAG (5 chunks)</span>
                    <strong className="text-foreground">3-5 créditos</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Agente especializado (marketplace)</span>
                    <strong className="text-foreground">5-20 créditos</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Indexação de 1.000 células</span>
                    <strong className="text-foreground">10 créditos</strong>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-primary/5 rounded-lg">
                <h4 className="font-semibold text-primary mb-3">Pacotes de Créditos</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex justify-between">
                    <span>100 créditos</span>
                    <strong className="text-foreground">R$ 10,00 (sem desconto)</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>500 créditos</span>
                    <strong className="text-foreground">R$ 45,00 (10% off)</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>1.000 créditos</span>
                    <strong className="text-foreground">R$ 80,00 (20% off)</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>5.000 créditos</span>
                    <strong className="text-foreground">R$ 350,00 (30% off)</strong>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-xl font-bold mb-4">Vantagens do Sistema de Créditos</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Previsibilidade</h4>
                <p className="text-xs text-muted-foreground">
                  Empresas sabem exatamente quanto custará cada interação, facilitando orçamento e controle de gastos
                </p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Flexibilidade</h4>
                <p className="text-xs text-muted-foreground">
                  Usuários podem comprar créditos sob demanda ou incluí-los em planos mensais com desconto
                </p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Margem de Lucro</h4>
                <p className="text-xs text-muted-foreground">
                  Margem média de 40-60% sobre custos de IA, permitindo investimento em infraestrutura e crescimento
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 03: Revenue Share */}
        <section id="revenue-share" className="mb-20 scroll-mt-20">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-6xl font-black text-primary/20">03</span>
            <h2 className="text-3xl font-bold">Modelo de Repasse</h2>
          </div>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Estrutura de Comissões</h3>
            <p className="text-sm text-muted-foreground mb-6">
              O modelo de repasse é desenhado para incentivar criadores de alta qualidade enquanto mantém a sustentabilidade da plataforma. A comissão varia conforme o volume de vendas e a categoria do agente.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Faixa de Receita Mensal</th>
                    <th className="text-left py-3 px-4 font-semibold">Criador Recebe</th>
                    <th className="text-left py-3 px-4 font-semibold">Plataforma Retém</th>
                    <th className="text-left py-3 px-4 font-semibold">Exemplo (R$ 1.000)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">R$ 0 - R$ 1.000</td>
                    <td className="py-3 px-4 font-medium text-primary">70%</td>
                    <td className="py-3 px-4 text-muted-foreground">30%</td>
                    <td className="py-3 px-4">
                      <code className="text-xs bg-muted px-2 py-1 rounded">R$ 700</code>
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">R$ 1.001 - R$ 5.000</td>
                    <td className="py-3 px-4 font-medium text-primary">75%</td>
                    <td className="py-3 px-4 text-muted-foreground">25%</td>
                    <td className="py-3 px-4">
                      <code className="text-xs bg-muted px-2 py-1 rounded">R$ 750</code>
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">R$ 5.001 - R$ 20.000</td>
                    <td className="py-3 px-4 font-medium text-primary">80%</td>
                    <td className="py-3 px-4 text-muted-foreground">20%</td>
                    <td className="py-3 px-4">
                      <code className="text-xs bg-muted px-2 py-1 rounded">R$ 800</code>
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">Acima de R$ 20.000</td>
                    <td className="py-3 px-4 font-medium text-primary">85%</td>
                    <td className="py-3 px-4 text-muted-foreground">15%</td>
                    <td className="py-3 px-4">
                      <code className="text-xs bg-muted px-2 py-1 rounded">R$ 850</code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Ciclo de Pagamento</h3>
            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Acumulação (Dias 1-30)</h4>
                  <p className="text-muted-foreground">
                    Receita de vendas do agente é acumulada na carteira do criador dentro da plataforma
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Fechamento (Dia 1 do mês seguinte)</h4>
                  <p className="text-muted-foreground">
                    Sistema calcula comissão, deduz impostos e taxas de processamento (Stripe ~3%)
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Pagamento (Dias 5-7)</h4>
                  <p className="text-muted-foreground">
                    Transferência automática via PIX ou transferência bancária (mínimo R$ 50)
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  4
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Transparência Total</h4>
                  <p className="text-muted-foreground">
                    Dashboard mostra em tempo real: vendas, comissões, saldo disponível e histórico de pagamentos
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-primary/5 border-primary/20">
            <h3 className="text-xl font-bold mb-4">Incentivos para Criadores</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-primary mb-2">Bônus de Performance</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Criadores com avaliação média acima de 4.5 estrelas recebem +5% de comissão
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-2">Programa de Afiliados</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Ganhe 10% de comissão sobre vendas de agentes indicados por você
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-2">Early Adopter</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Primeiros 100 criadores mantêm 85% de comissão permanentemente
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-2">Certificação</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Agentes certificados pela Snack ganham selo de qualidade e destaque no marketplace
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 04: Use Cases */}
        <section id="use-cases" className="mb-20 scroll-mt-20">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-6xl font-black text-primary/20">04</span>
            <h2 className="text-3xl font-bold">Casos de Uso Práticos</h2>
          </div>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">O Poder do RAG Híbrido</h3>
            <p className="text-sm text-muted-foreground mb-6">
              O diferencial da Snack Prompt é o <strong className="text-foreground">RAG Híbrido</strong>: seus agentes combinam o conhecimento especializado do criador com os dados específicos de cada usuário, gerando respostas precisas e contextualizadas.
            </p>

            <div className="mermaid text-sm mb-6">
{`graph LR
    subgraph KB_CRIADOR["📚 Knowledge Base do CRIADOR"]
        A[Legislação]
        B[Templates]
        C[Expertise]
    end

    subgraph KB_USUARIO["📄 Knowledge Base do USUÁRIO"]
        D[Seus Documentos]
        E[Seus Dados]
    end

    subgraph PROC["🤖 Processamento"]
        F[Agente IA]
        G[Tools]
    end

    A --> F
    B --> F
    C --> F
    D --> F
    E --> F
    G --> F
    F --> H["✨ Resposta + Citações"]`}
            </div>
          </Card>

          {/* Use Case 1: Comparador de Propostas */}
          <Card className="p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🎯</span>
              <h4 className="text-lg font-bold">Comparador de Propostas</h4>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">B2B/Compras</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Recebe múltiplos documentos de fornecedores, extrai dados automaticamente e gera matriz comparativa com recomendação fundamentada.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <h5 className="font-semibold text-primary text-sm mb-2">📚 KB do Criador</h5>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Critérios de avaliação de fornecedores</li>
                  <li>• Benchmarks de preços do setor</li>
                  <li>• Checklist de compliance</li>
                </ul>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg">
                <h5 className="font-semibold text-sm mb-2">📄 KB do Usuário</h5>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• PDFs das propostas recebidas</li>
                  <li>• Requisitos específicos do projeto</li>
                  <li>• Histórico com fornecedores</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-muted text-xs rounded">🔧 Extrator PDF</span>
              <span className="px-2 py-1 bg-muted text-xs rounded">🔧 Calculadora</span>
              <span className="px-2 py-1 bg-muted text-xs rounded">🔧 Gerador de Tabelas</span>
            </div>

            <div className="p-4 border border-border rounded-lg mb-4">
              <p className="text-xs text-muted-foreground mb-2">💬 Exemplo de interação:</p>
              <p className="text-sm mb-2"><strong>Usuário:</strong> "Compare as 5 propostas e recomende o melhor fornecedor"</p>
              <p className="text-sm text-muted-foreground"><strong>Agente:</strong> "Analisei as propostas. Recomendo o Fornecedor C: melhor custo-benefício (R$ 45k), prazo de 30 dias, e atende 95% dos requisitos técnicos. <em>[Fonte: Proposta_C.pdf, p.3]</em>"</p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-muted-foreground">👤 Usuário</p>
                <p className="text-sm font-semibold text-green-700">Decisão em minutos</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-muted-foreground">💰 Seller</p>
                <p className="text-sm font-semibold text-blue-700">R$ 20/análise</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-xs text-muted-foreground">🏢 Plataforma</p>
                <p className="text-sm font-semibold text-purple-700">20% comissão</p>
              </div>
            </div>
          </Card>

          {/* Use Case 2: Gerador de Contratos */}
          <Card className="p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🎯</span>
              <h4 className="text-lg font-bold">Gerador de Contratos</h4>
              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded">Jurídico</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Gera contratos completos a partir de um briefing, utilizando templates validados e adaptando cláusulas ao contexto específico.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <h5 className="font-semibold text-primary text-sm mb-2">📚 KB do Criador</h5>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• 500+ modelos de contrato</li>
                  <li>• Cláusulas padrão por tipo</li>
                  <li>• Legislação atualizada (CC, CDC)</li>
                </ul>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg">
                <h5 className="font-semibold text-sm mb-2">📄 KB do Usuário</h5>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Briefing do contrato</li>
                  <li>• Dados das partes</li>
                  <li>• Requisitos específicos</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-muted text-xs rounded">🔧 Gerador de Doc</span>
              <span className="px-2 py-1 bg-muted text-xs rounded">🔧 Validador Jurídico</span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-muted-foreground">👤 Usuário</p>
                <p className="text-sm font-semibold text-green-700">Contrato em 5min</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-muted-foreground">💰 Seller</p>
                <p className="text-sm font-semibold text-blue-700">R$ 25/contrato</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-xs text-muted-foreground">🏢 Plataforma</p>
                <p className="text-sm font-semibold text-purple-700">20% comissão</p>
              </div>
            </div>
          </Card>

          {/* Use Case 3: Due Diligence */}
          <Card className="p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🎯</span>
              <h4 className="text-lg font-bold">Due Diligence Automatizada</h4>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">M&A/Investimentos</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Analisa documentos de empresas-alvo em múltiplas dimensões (financeira, trabalhista, tributária), identificando riscos e oportunidades.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <h5 className="font-semibold text-primary text-sm mb-2">📚 KB do Criador</h5>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Checklists de due diligence</li>
                  <li>• Red flags por setor</li>
                  <li>• Frameworks de análise</li>
                </ul>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg">
                <h5 className="font-semibold text-sm mb-2">📄 KB do Usuário</h5>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Balanços e DRE</li>
                  <li>• Contratos vigentes</li>
                  <li>• Certidões e documentos</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-muted text-xs rounded">🔧 OCR</span>
              <span className="px-2 py-1 bg-muted text-xs rounded">🔧 Calculadora Financeira</span>
              <span className="px-2 py-1 bg-muted text-xs rounded">🔧 Extrator de Tabelas</span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-muted-foreground">👤 Usuário</p>
                <p className="text-sm font-semibold text-green-700">Relatório em horas</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-muted-foreground">💰 Seller</p>
                <p className="text-sm font-semibold text-blue-700">R$ 150/análise</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-xs text-muted-foreground">🏢 Plataforma</p>
                <p className="text-sm font-semibold text-purple-700">15% comissão</p>
              </div>
            </div>
          </Card>

          {/* Use Case 4: Coach de Apresentações */}
          <Card className="p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🎯</span>
              <h4 className="text-lg font-bold">Coach de Apresentações</h4>
              <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs font-medium rounded">Comunicação</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Analisa slides e roteiros, identifica pontos fracos no storytelling e propõe melhorias iterativas até atingir o impacto desejado.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <h5 className="font-semibold text-primary text-sm mb-2">📚 KB do Criador</h5>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Técnicas de storytelling</li>
                  <li>• Estruturas de pitch vencedoras</li>
                  <li>• Exemplos de apresentações 10/10</li>
                </ul>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg">
                <h5 className="font-semibold text-sm mb-2">📄 KB do Usuário</h5>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Slides atuais</li>
                  <li>• Contexto da apresentação</li>
                  <li>• Público-alvo</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-muted text-xs rounded">🔧 Analisador</span>
              <span className="px-2 py-1 bg-muted text-xs rounded">🔧 Sumarizador</span>
              <span className="px-2 py-1 bg-muted text-xs rounded">🔧 Loop de Refinamento</span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-muted-foreground">👤 Usuário</p>
                <p className="text-sm font-semibold text-green-700">Pitch 10x melhor</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-muted-foreground">💰 Seller</p>
                <p className="text-sm font-semibold text-blue-700">R$ 30/sessão</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-xs text-muted-foreground">🏢 Plataforma</p>
                <p className="text-sm font-semibold text-purple-700">20% comissão</p>
              </div>
            </div>
          </Card>

          {/* More use cases summary */}
          <Card className="p-8">
            <h3 className="text-xl font-bold mb-4">Mais Casos de Uso</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold mb-2">🔍 Auditor de Compliance</h4>
                <p className="text-xs text-muted-foreground">Compara processos internos com LGPD, SOX e normas do setor. Gera relatório de gaps com plano de ação.</p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold mb-2">💰 Precificador Inteligente</h4>
                <p className="text-xs text-muted-foreground">Calcula preço ótimo considerando margens, políticas comerciais e perfil do cliente.</p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold mb-2">👥 Onboarding RH</h4>
                <p className="text-xs text-muted-foreground">Gera plano de integração personalizado para novos funcionários com checklist e agendamentos.</p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold mb-2">📊 Analista de Concorrência</h4>
                <p className="text-xs text-muted-foreground">Compila informações de múltiplas fontes e gera relatório executivo de inteligência de mercado.</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 05: Agent Tools */}
        <section id="agent-tools" className="mb-20 scroll-mt-20">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-6xl font-black text-primary/20">05</span>
            <h2 className="text-3xl font-bold">Ferramentas para Agentes</h2>
          </div>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">O que são Tools?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Tools são <strong className="text-foreground">capacidades especiais</strong> que seus agentes podem usar. Enquanto o LLM "pensa", as Tools "fazem" — calculam, buscam dados, geram documentos.
            </p>

            <div className="bg-white p-6 rounded-lg overflow-x-auto">
              <div className="mermaid text-sm">
{`flowchart LR
    subgraph Fluxo["Como uma Tool Funciona"]
        direction LR
        U["👤 Usuario"]
        A["🤖 Agente IA"]
        T["🔧 Tool"]
        R["📄 Resultado"]
    end

    U -->|"1. Pergunta"| A
    A -->|"2. Identifica"| T
    T -->|"3. Executa"| A
    A -->|"4. Resposta"| R`}
              </div>
            </div>
            <div className="mt-4 p-4 bg-slate-50 rounded-lg text-sm">
              <p className="text-muted-foreground">
                <strong className="text-foreground">Exemplo prático:</strong> Usuario pergunta
                <em> "Calcule o NPV deste investimento"</em> → Agente identifica necessidade de calculo →
                Chama <code className="bg-slate-200 px-1 rounded">Calculadora Financeira</code> →
                Tool executa NPV(valores, taxa) e retorna R$ 150.000 →
                Agente contextualiza e entrega a resposta final.
              </p>
            </div>
          </Card>

          {/* Tools Catalog */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 border-l-4 border-l-blue-500">
              <h4 className="font-bold text-blue-700 mb-4">📊 Análise & Cálculo</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">Calculadora Financeira</p>
                    <p className="text-xs text-muted-foreground">NPV, IRR, juros, amortização</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">2 créditos</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">Calculadora Tributária</p>
                    <p className="text-xs text-muted-foreground">ICMS, ISS, IR, margens</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">2 créditos</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">Comparador de Docs</p>
                    <p className="text-xs text-muted-foreground">Diff entre versões</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">3 créditos</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">Analisador de Sentimento</p>
                    <p className="text-xs text-muted-foreground">Score emocional de textos</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">1 crédito</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-green-500">
              <h4 className="font-bold text-green-700 mb-4">📄 Documentos & Dados</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">Extrator de Tabelas</p>
                    <p className="text-xs text-muted-foreground">Dados estruturados de PDFs</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">5 créditos</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">Gerador de Documentos</p>
                    <p className="text-xs text-muted-foreground">Preenche templates</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">3 créditos</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">OCR Inteligente</p>
                    <p className="text-xs text-muted-foreground">Lê documentos escaneados</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">4 créditos</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">Sumarizador</p>
                    <p className="text-xs text-muted-foreground">Resume textos longos</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">2 créditos</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-purple-500">
              <h4 className="font-bold text-purple-700 mb-4">🌐 Integrações Externas</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">API de Cotações</p>
                    <p className="text-xs text-muted-foreground">Dólar, ações, commodities</p>
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">1 crédito</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">Busca CEP/Endereço</p>
                    <p className="text-xs text-muted-foreground">Localização, cálculo frete</p>
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">1 crédito</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">Validador CPF/CNPJ</p>
                    <p className="text-xs text-muted-foreground">Verifica documentos</p>
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">1 crédito</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">Calendário/Agenda</p>
                    <p className="text-xs text-muted-foreground">Disponibilidade, agendamentos</p>
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">2 créditos</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-orange-500">
              <h4 className="font-bold text-orange-700 mb-4">📢 Comunicação & Output</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">Notificador</p>
                    <p className="text-xs text-muted-foreground">Email, WhatsApp, SMS</p>
                  </div>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">2 créditos</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">Gerador de Gráficos</p>
                    <p className="text-xs text-muted-foreground">Visualizações de dados</p>
                  </div>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">3 créditos</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">Tradutor Multi-idioma</p>
                    <p className="text-xs text-muted-foreground">Tradução automática</p>
                  </div>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">2 créditos</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">Exportador</p>
                    <p className="text-xs text-muted-foreground">PDF, Excel, JSON</p>
                  </div>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">2 créditos</span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-8">
            <h3 className="text-xl font-bold mb-4">Extensibilidade</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border border-border rounded-lg text-center">
                <div className="text-2xl mb-2">🔧</div>
                <h4 className="font-semibold text-sm mb-1">Solicitar Tool</h4>
                <p className="text-xs text-muted-foreground">Criadores PRO podem solicitar novas tools</p>
              </div>
              <div className="p-4 border border-border rounded-lg text-center">
                <div className="text-2xl mb-2">🔌</div>
                <h4 className="font-semibold text-sm mb-1">API Custom</h4>
                <p className="text-xs text-muted-foreground">Enterprise pode integrar APIs próprias</p>
              </div>
              <div className="p-4 border border-border rounded-lg text-center">
                <div className="text-2xl mb-2">🗺️</div>
                <h4 className="font-semibold text-sm mb-1">Roadmap</h4>
                <p className="text-xs text-muted-foreground">Vote nas próximas tools a serem desenvolvidas</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 06: Agent Builder */}
        <section id="agent-builder-biz" className="mb-20 scroll-mt-20">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-6xl font-black text-primary/20">06</span>
            <h2 className="text-3xl font-bold">Agent Builder</h2>
          </div>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Crie Agentes Visualmente</h3>
            <p className="text-sm text-muted-foreground mb-6">
              O Agent Builder permite criar fluxos de agentes inteligentes <strong className="text-foreground">sem escrever código</strong>. Arraste nodes, conecte-os e configure comportamentos complexos de forma visual.
            </p>

            <div className="mermaid text-sm">
{`graph TB
    subgraph BUILDER["Agent Builder"]
        A["📥 Input Node"] --> B["🔍 Analyze Node"]
        B --> C{"Condition"}
        C -->|"Score < 7"| B
        C -->|"Score >= 7"| D["📝 Output Node"]
        B -.-> E["🔧 Tool: Calculadora"]
        B -.-> F["📚 KB Lookup"]
    end`}
            </div>
          </Card>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Níveis de Complexidade</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 border-2 border-border rounded-lg">
                <div className="text-3xl mb-3">🌱</div>
                <h4 className="font-bold mb-2">STARTER</h4>
                <p className="text-sm text-muted-foreground mb-4">Templates prontos para começar rápido</p>
                <ul className="text-xs space-y-2 mb-4">
                  <li>✓ Escolha um template</li>
                  <li>✓ Configure sua KB</li>
                  <li>✓ Publique imediatamente</li>
                </ul>
                <p className="text-lg font-bold text-green-600">Gratuito</p>
              </div>

              <div className="p-6 border-2 border-primary rounded-lg bg-primary/5">
                <div className="text-3xl mb-3">🚀</div>
                <h4 className="font-bold mb-2">PRO</h4>
                <p className="text-sm text-muted-foreground mb-4">Customização avançada</p>
                <ul className="text-xs space-y-2 mb-4">
                  <li>✓ Edite prompts e parâmetros</li>
                  <li>✓ Adicione condições</li>
                  <li>✓ Multi-step workflows</li>
                </ul>
                <p className="text-lg font-bold text-primary">R$ 49/mês</p>
              </div>

              <div className="p-6 border-2 border-border rounded-lg">
                <div className="text-3xl mb-3">🏢</div>
                <h4 className="font-bold mb-2">ENTERPRISE</h4>
                <p className="text-sm text-muted-foreground mb-4">Flow Builder completo</p>
                <ul className="text-xs space-y-2 mb-4">
                  <li>✓ Crie fluxos do zero</li>
                  <li>✓ Nodes customizados</li>
                  <li>✓ API própria</li>
                </ul>
                <p className="text-lg font-bold">Sob consulta</p>
              </div>
            </div>
          </Card>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Interface do Builder</h3>
            <div className="bg-muted/30 rounded-lg p-6 font-mono text-xs overflow-x-auto">
              <pre className="text-muted-foreground">
{`┌─────────────────────────────────────────────────────────────────┐
│  AGENT BUILDER                                    [Salvar] [▶]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────┐     ┌─────────────────────────────────────────┐   │
│  │ NODES   │     │                                         │   │
│  ├─────────┤     │   [📥 Input]                            │   │
│  │ 📥 Input│     │       │                                 │   │
│  │ 🔍 LLM  │     │       ▼                                 │   │
│  │ 🔧 Tool │     │   [📚 KB Lookup] ──→ [🔍 Analyze]       │   │
│  │ 📚 KB   │     │                          │              │   │
│  │ ❓ If   │     │                     ┌────┴────┐         │   │
│  │ 🔄 Loop │     │                     ▼         ▼         │   │
│  │ 📤 Out  │     │              [Score<7]   [Score≥7]      │   │
│  └─────────┘     │                  │            │         │   │
│                  │                  ▼            ▼         │   │
│                  │              [🔄 Loop]   [📤 Output]    │   │
│                  │                                         │   │
│                  └─────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘`}
              </pre>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-xl font-bold mb-4">Tipos de Nodes</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 border border-border rounded-lg text-center">
                <div className="text-2xl mb-2">📥</div>
                <h4 className="font-semibold text-sm">Input</h4>
                <p className="text-xs text-muted-foreground">Recebe dados do usuário</p>
              </div>
              <div className="p-4 border border-border rounded-lg text-center">
                <div className="text-2xl mb-2">🔍</div>
                <h4 className="font-semibold text-sm">LLM</h4>
                <p className="text-xs text-muted-foreground">Processa com IA</p>
              </div>
              <div className="p-4 border border-border rounded-lg text-center">
                <div className="text-2xl mb-2">📚</div>
                <h4 className="font-semibold text-sm">KB Lookup</h4>
                <p className="text-xs text-muted-foreground">Busca na Knowledge Base</p>
              </div>
              <div className="p-4 border border-border rounded-lg text-center">
                <div className="text-2xl mb-2">🔧</div>
                <h4 className="font-semibold text-sm">Tool</h4>
                <p className="text-xs text-muted-foreground">Executa ferramenta</p>
              </div>
              <div className="p-4 border border-border rounded-lg text-center">
                <div className="text-2xl mb-2">❓</div>
                <h4 className="font-semibold text-sm">Condition</h4>
                <p className="text-xs text-muted-foreground">Decisão condicional</p>
              </div>
              <div className="p-4 border border-border rounded-lg text-center">
                <div className="text-2xl mb-2">🔄</div>
                <h4 className="font-semibold text-sm">Loop</h4>
                <p className="text-xs text-muted-foreground">Repete até condição</p>
              </div>
              <div className="p-4 border border-border rounded-lg text-center">
                <div className="text-2xl mb-2">📤</div>
                <h4 className="font-semibold text-sm">Output</h4>
                <p className="text-xs text-muted-foreground">Retorna resultado</p>
              </div>
              <div className="p-4 border border-border rounded-lg text-center">
                <div className="text-2xl mb-2">👤</div>
                <h4 className="font-semibold text-sm">Human</h4>
                <p className="text-xs text-muted-foreground">Aguarda input humano</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 07: Citations System */}
        <section id="citations-biz" className="mb-20 scroll-mt-20">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-6xl font-black text-primary/20">07</span>
            <h2 className="text-3xl font-bold">Sistema de Citações</h2>
          </div>

          <Card className="p-8 mb-8 bg-muted/30">
            <h3 className="text-xl font-bold mb-4">O Problema da Confiança na IA</h3>
            <p className="text-muted-foreground mb-6">
              O maior problema da IA generativa é a <strong className="text-foreground">alucinação</strong> -
              respostas inventadas que parecem verdadeiras. Na Snack Prompt, <strong className="text-foreground">cada
              afirmação pode ser verificada</strong> com um clique.
            </p>
            <div className="bg-white p-6 rounded-lg">
              <div className="mermaid text-sm">
{`flowchart LR
    subgraph ChatGPT["❌ ChatGPT Tradicional"]
        A1["🤖 IA"] --> B1["❓ Resposta"]
        B1 --> C1["😰 Sem fonte"]
    end

    subgraph Snack["✅ Snack Prompt"]
        A2["🤖 IA + KB"] --> B2["📝 Resposta"]
        B2 --> C2["🔗 Citacao"]
        C2 --> D2["😊 Verificavel"]
    end`}
              </div>
            </div>
          </Card>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Como Funciona</h3>
            <div className="bg-slate-900 text-slate-100 p-6 rounded-lg font-mono text-sm">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-blue-400">👤</span>
                  <p>"Qual a taxa de juros máxima permitida?"</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-400">🤖</span>
                  <div>
                    <p>"De acordo com a legislação vigente, a taxa máxima de juros permitida é de <span className="bg-blue-500/30 px-1 rounded">12% ao ano [1]</span>. No entanto, para operações de crédito consignado, o limite é de <span className="bg-blue-500/30 px-1 rounded">2.14% ao mês [2]</span>, conforme <span className="bg-blue-500/30 px-1 rounded">Instrução Normativa 28/2023 [3]</span>."</p>
                  </div>
                </div>
                <div className="border-t border-slate-700 pt-4 mt-4">
                  <p className="text-slate-400 text-xs mb-2">📚 FONTES</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">1</span>
                      <span>Código Civil, Art. 591</span>
                      <span className="text-slate-500">→ Tabela: Legislação {'>'} Limites de Juros</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">2</span>
                      <span>Resolução CMN 4.765/2020</span>
                      <span className="text-slate-500">→ Tabela: Normas Bancárias {'>'} Consignado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">3</span>
                      <span>IN INSS 28/2023</span>
                      <span className="text-slate-500">→ Tabela: Instruções Normativas {'>'} 2023</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Tipos de Citação</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Tipo</th>
                    <th className="text-left py-3 px-4 font-semibold">Exemplo</th>
                    <th className="text-left py-3 px-4 font-semibold">Uso</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Citação Direta</td>
                    <td className="py-3 px-4"><code className="bg-blue-100 text-blue-700 px-2 py-1 rounded">[1]</code> → Link para célula</td>
                    <td className="py-3 px-4 text-muted-foreground">Afirmações factuais</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Citação de Contexto</td>
                    <td className="py-3 px-4"><code className="bg-green-100 text-green-700 px-2 py-1 rounded">[Fonte: Tabela X]</code></td>
                    <td className="py-3 px-4 text-muted-foreground">Referência geral</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Citação Múltipla</td>
                    <td className="py-3 px-4"><code className="bg-purple-100 text-purple-700 px-2 py-1 rounded">[1,2,3]</code> → Consolidação</td>
                    <td className="py-3 px-4 text-muted-foreground">Análises comparativas</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Citação com Score</td>
                    <td className="py-3 px-4"><code className="bg-orange-100 text-orange-700 px-2 py-1 rounded">[1] (95%)</code></td>
                    <td className="py-3 px-4 text-muted-foreground">Transparência de confiança</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 border-t-4 border-t-blue-500">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <span className="text-xl">👤</span> Para o Usuário
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Confiança nas respostas</li>
                <li>✓ Verificação instantânea</li>
                <li>✓ Auditoria e compliance</li>
                <li>✓ Aprendizado contextualizado</li>
              </ul>
            </Card>
            <Card className="p-6 border-t-4 border-t-green-500">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <span className="text-xl">💰</span> Para o Criador
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Valor percebido aumentado</li>
                <li>✓ Menor suporte pós-venda</li>
                <li>✓ Justifica preço premium</li>
                <li>✓ Diferenciação de mercado</li>
              </ul>
            </Card>
            <Card className="p-6 border-t-4 border-t-purple-500">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <span className="text-xl">🏢</span> Para a Plataforma
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Diferenciação competitiva</li>
                <li>✓ Redução de reclamações</li>
                <li>✓ Trust score para ranking</li>
                <li>✓ Compliance automático</li>
              </ul>
            </Card>
          </div>

          <Card className="p-8">
            <h3 className="text-xl font-bold mb-4">Onde Citações são Críticas</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <h4 className="font-semibold text-red-700 mb-2">⚖️ Jurídico</h4>
                <p className="text-sm text-red-600">"Art. 5º, CF [1]" deve estar correto - responsabilidade legal</p>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <h4 className="font-semibold text-blue-700 mb-2">💰 Financeiro</h4>
                <p className="text-sm text-blue-600">Taxas citadas devem ser auditáveis - compliance regulatório</p>
              </div>
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <h4 className="font-semibold text-green-700 mb-2">🏥 Saúde</h4>
                <p className="text-sm text-green-600">Dosagens precisam de fonte confiável - segurança do paciente</p>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                <h4 className="font-semibold text-purple-700 mb-2">👥 RH</h4>
                <p className="text-sm text-purple-600">Direitos citados devem ser verificáveis - políticas trabalhistas</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 08: Seller Payout (Cash-out) */}
        <section id="seller-payout" className="mb-20 scroll-mt-20">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-6xl font-black text-primary/20">08</span>
            <h2 className="text-3xl font-bold">Sistema de Saque (Cash-out)</h2>
          </div>

          <Card className="p-8 mb-8 bg-muted/30">
            <h3 className="text-xl font-bold mb-4">Fluxo Econômico dos Créditos</h3>
            <p className="text-muted-foreground mb-6">
              O modelo econômico da Snack Prompt é transparente: quando um usuário compra créditos,
              esse valor é <strong className="text-foreground">distribuído proporcionalmente</strong> entre
              custos de IA, plataforma e criador do agente.
            </p>
            <div className="bg-white p-6 rounded-lg">
              <div className="mermaid text-sm">
{`flowchart LR
    subgraph Compra["Compra de Creditos"]
        U["Usuario"]
        PAY["$10 USD"]
        CR["10 Creditos"]
    end

    subgraph Uso["Uso do Agente"]
        AG["Agente Premium"]
        COST["Custo: 5 creditos"]
    end

    subgraph Dist["Distribuicao"]
        AI["IA: 2 cr"]
        PLAT["Plataforma: 2 cr"]
        SELL["Seller: 1 cr"]
    end

    subgraph Saque["Cash-out"]
        BAL["Saldo: 1 cr"]
        QUAR["Quarentena 14d"]
        CASH["$1 USD"]
    end

    U --> PAY
    PAY --> CR
    CR --> AG
    AG --> COST
    COST --> AI
    COST --> PLAT
    COST --> SELL
    SELL --> BAL
    BAL --> QUAR
    QUAR --> CASH`}
              </div>
            </div>
          </Card>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Modelo de Distribuição por Uso</h3>
            <div className="bg-slate-900 text-slate-100 p-6 rounded-lg font-mono text-sm mb-6">
              <div className="mb-4">
                <span className="text-blue-400">👤</span> Usuário usa o Agente "Advogado Sênior"
              </div>
              <div className="mb-4">
                <span className="text-green-400">💳</span> Custo da interação: <span className="text-yellow-400">5 créditos</span>
              </div>
              <div className="border-t border-slate-700 pt-4 mt-4">
                <p className="text-slate-400 text-xs mb-3">📊 DISTRIBUIÇÃO DOS 5 CRÉDITOS:</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-800 p-3 rounded text-center">
                    <div className="text-2xl mb-1">🤖</div>
                    <div className="text-sm font-bold">2 créditos</div>
                    <div className="text-xs text-slate-400">(40%)</div>
                    <div className="text-xs text-slate-500 mt-1">Custo IA</div>
                  </div>
                  <div className="bg-slate-800 p-3 rounded text-center">
                    <div className="text-2xl mb-1">🏢</div>
                    <div className="text-sm font-bold">2 créditos</div>
                    <div className="text-xs text-slate-400">(40%)</div>
                    <div className="text-xs text-slate-500 mt-1">Plataforma</div>
                  </div>
                  <div className="bg-green-900/50 p-3 rounded text-center border border-green-500/30">
                    <div className="text-2xl mb-1">💼</div>
                    <div className="text-sm font-bold text-green-400">1 crédito</div>
                    <div className="text-xs text-green-400">(20%)</div>
                    <div className="text-xs text-green-500 mt-1">Seller</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Destino</th>
                    <th className="text-left py-3 px-4 font-semibold">% Padrão</th>
                    <th className="text-left py-3 px-4 font-semibold">Descrição</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Custo IA</td>
                    <td className="py-3 px-4"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">40%</span></td>
                    <td className="py-3 px-4 text-muted-foreground">Tokens GPT-4, embeddings, etc.</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Plataforma</td>
                    <td className="py-3 px-4"><span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">40%</span></td>
                    <td className="py-3 px-4 text-muted-foreground">Infraestrutura, R&D, suporte</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Seller</td>
                    <td className="py-3 px-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">20%</span></td>
                    <td className="py-3 px-4 text-muted-foreground">Comissão do criador do agente</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-4 italic">
              Nota: Sellers com agentes de alta qualidade podem negociar splits mais favoráveis (ex: 30% para o seller).
            </p>
          </Card>

          <Card className="p-8 mb-8 border-l-4 border-l-amber-500">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-amber-500">⏳</span> Sistema de Quarentena (Modelo Hotmart/Monetizze)
            </h3>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-amber-800 mb-2">⚠️ Por que existe a quarentena?</h4>
              <p className="text-sm text-amber-700">
                <strong>Problema:</strong> Um usuário compra créditos com cartão de crédito, usa o agente do seller,
                e depois solicita chargeback. Sem quarentena, a plataforma perderia dinheiro.
              </p>
              <p className="text-sm text-amber-700 mt-2">
                <strong>Solução:</strong> Período de quarentena de 14 dias antes do saldo ficar liberado para saque.
              </p>
            </div>
            <div className="bg-slate-100 p-6 rounded-lg mb-6">
              <h4 className="font-semibold mb-4">📅 Timeline do Saldo</h4>
              <div className="flex items-center justify-between text-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                    <span className="text-red-600 font-bold">0</span>
                  </div>
                  <div className="font-medium">Venda</div>
                  <div className="text-xs text-muted-foreground">🔒 Bloqueado</div>
                </div>
                <div className="flex-1 h-1 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 mx-4"></div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                    <span className="text-yellow-600 font-bold">14</span>
                  </div>
                  <div className="font-medium">Liberação</div>
                  <div className="text-xs text-muted-foreground">🔓 Disponível</div>
                </div>
                <div className="flex-1 h-1 bg-green-200 mx-4"></div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                    <span className="text-green-600 font-bold">30</span>
                  </div>
                  <div className="font-medium">Seguro</div>
                  <div className="text-xs text-muted-foreground">✅ Totalmente</div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Estado</th>
                    <th className="text-left py-3 px-4 font-semibold">Ícone</th>
                    <th className="text-left py-3 px-4 font-semibold">Descrição</th>
                    <th className="text-left py-3 px-4 font-semibold">Ação Disponível</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Pendente</td>
                    <td className="py-3 px-4">🔒</td>
                    <td className="py-3 px-4 text-muted-foreground">Em quarentena (0-14 dias)</td>
                    <td className="py-3 px-4 text-muted-foreground">Apenas visualização</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Disponível</td>
                    <td className="py-3 px-4">🔓</td>
                    <td className="py-3 px-4 text-muted-foreground">Liberado para saque</td>
                    <td className="py-3 px-4 text-green-600 font-medium">Pode solicitar saque</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Em transferência</td>
                    <td className="py-3 px-4">⏳</td>
                    <td className="py-3 px-4 text-muted-foreground">Saque solicitado</td>
                    <td className="py-3 px-4 text-muted-foreground">Aguardando processamento</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Sacado</td>
                    <td className="py-3 px-4">✅</td>
                    <td className="py-3 px-4 text-muted-foreground">Transferido para conta</td>
                    <td className="py-3 px-4 text-muted-foreground">Completo</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">💳 Métodos de Saque</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🇧🇷</span> Brasil
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <div className="flex items-center gap-2">
                      <span>⚡</span>
                      <span className="font-medium">PIX</span>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-green-600 font-medium">Instantâneo</div>
                      <div className="text-xs text-muted-foreground">Sem taxa* | Min: R$ 20</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <div className="flex items-center gap-2">
                      <span>🏦</span>
                      <span className="font-medium">TED</span>
                    </div>
                    <div className="text-right text-sm">
                      <div>1 dia útil</div>
                      <div className="text-xs text-muted-foreground">R$ 5,00 | Min: R$ 100</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <div className="flex items-center gap-2">
                      <span>💳</span>
                      <span className="font-medium">Conta Corrente</span>
                    </div>
                    <div className="text-right text-sm">
                      <div>2 dias úteis</div>
                      <div className="text-xs text-muted-foreground">R$ 3,00 | Min: R$ 50</div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3 italic">* PIX sem taxa para sellers PRO (acima de R$ 500/mês)</p>
              </div>
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🌎</span> Internacional
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <div className="flex items-center gap-2">
                      <span>🅿️</span>
                      <span className="font-medium">PayPal</span>
                    </div>
                    <div className="text-right text-sm">
                      <div>1-3 dias</div>
                      <div className="text-xs text-muted-foreground">2.5% | Min: $10</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <div className="flex items-center gap-2">
                      <span>🏦</span>
                      <span className="font-medium">Wire Transfer</span>
                    </div>
                    <div className="text-right text-sm">
                      <div>3-5 dias</div>
                      <div className="text-xs text-muted-foreground">$15 fixo | Min: $100</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <div className="flex items-center gap-2">
                      <span>🪙</span>
                      <span className="font-medium">Crypto (USDC)</span>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-green-600 font-medium">Minutos</div>
                      <div className="text-xs text-muted-foreground">Gas fee | Min: $50</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">📊 Limites por Tipo de Conta</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Aspecto</th>
                    <th className="text-left py-3 px-4 font-semibold">Seller Básico</th>
                    <th className="text-left py-3 px-4 font-semibold">Seller PRO</th>
                    <th className="text-left py-3 px-4 font-semibold">Seller Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Quarentena</td>
                    <td className="py-3 px-4">14 dias</td>
                    <td className="py-3 px-4 text-primary font-medium">7 dias</td>
                    <td className="py-3 px-4 text-green-600 font-medium">3 dias</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Saque mínimo</td>
                    <td className="py-3 px-4">R$ 50</td>
                    <td className="py-3 px-4 text-primary font-medium">R$ 20</td>
                    <td className="py-3 px-4 text-green-600 font-medium">Sem mínimo</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Saques/mês</td>
                    <td className="py-3 px-4">2</td>
                    <td className="py-3 px-4 text-primary font-medium">Ilimitado</td>
                    <td className="py-3 px-4 text-green-600 font-medium">Ilimitado</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Taxa PIX</td>
                    <td className="py-3 px-4">2%</td>
                    <td className="py-3 px-4 text-primary font-medium">Grátis</td>
                    <td className="py-3 px-4 text-green-600 font-medium">Grátis</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Taxa Wire</td>
                    <td className="py-3 px-4">$15</td>
                    <td className="py-3 px-4 text-primary font-medium">$10</td>
                    <td className="py-3 px-4 text-green-600 font-medium">Grátis</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Suporte</td>
                    <td className="py-3 px-4">Email</td>
                    <td className="py-3 px-4 text-primary font-medium">Prioritário</td>
                    <td className="py-3 px-4 text-green-600 font-medium">Dedicado</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Critérios para upgrade:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong className="text-foreground">PRO:</strong> R$ 500+/mês em vendas ou 6 meses de conta ativa</li>
                <li>• <strong className="text-foreground">Enterprise:</strong> R$ 5.000+/mês ou contrato corporativo</li>
              </ul>
            </div>
          </Card>

          <Card className="p-8 mb-8 bg-amber-50 border-amber-200">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-amber-600">🧾</span> Aspectos Fiscais (Brasil)
            </h3>
            <div className="bg-white border border-amber-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-amber-800 font-medium mb-2">
                ⚠️ A SNACK PROMPT NÃO É SUBSTITUTO TRIBUTÁRIO
              </p>
              <p className="text-sm text-amber-700">
                O seller é responsável por declarar os ganhos em seu IR.
                Fornecemos relatórios mensais para facilitar a declaração.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border">
                <h4 className="font-semibold mb-2">📋 O que fornecemos:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Relatório mensal de ganhos (PDF)</li>
                  <li>• Extrato anual para declaração de IR</li>
                  <li>• Informe de rendimentos (para PJ)</li>
                </ul>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <h4 className="font-semibold mb-2">💡 Recomendações:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>PF:</strong> "Rendimentos recebidos de PJ"</li>
                  <li>• <strong>MEI:</strong> Receita de prestação de serviços</li>
                  <li>• <strong>ME/EPP:</strong> Nota fiscal de serviços digitais</li>
                </ul>
              </div>
            </div>
            <p className="text-xs text-amber-700 mt-4">
              🔗 Consulte um contador para orientação específica.
            </p>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <h3 className="text-xl font-bold mb-4">📅 Exemplo: Ciclo de Vida Completo</h3>
            <p className="text-slate-300 text-sm mb-6">Timeline de uma venda até o saque:</p>
            <div className="space-y-4">
              <div className="border-l-4 border-l-blue-500 pl-4 py-2">
                <div className="text-xs text-blue-400 font-semibold">DIA 1 (01/12/2024)</div>
                <ul className="text-sm text-slate-300 mt-1 space-y-1">
                  <li>• 👤 Usuário compra 100 créditos por $100</li>
                  <li>• 👤 Usuário usa Agente "Advogado Sênior" (50 créditos)</li>
                  <li>• 💼 Seller recebe: 10 créditos (20% de 50)</li>
                  <li>• 📊 Status: <span className="text-red-400">🔒 R$ 50 PENDENTE</span></li>
                </ul>
              </div>
              <div className="border-l-4 border-l-yellow-500 pl-4 py-2">
                <div className="text-xs text-yellow-400 font-semibold">DIA 7 (08/12/2024)</div>
                <ul className="text-sm text-slate-300 mt-1 space-y-1">
                  <li>• 👤 Mais usos do agente: +30 créditos gastos</li>
                  <li>• 💼 Seller recebe: +6 créditos</li>
                  <li>• 📊 Status: <span className="text-red-400">🔒 R$ 80 PENDENTE</span> (16 créditos total)</li>
                </ul>
              </div>
              <div className="border-l-4 border-l-green-500 pl-4 py-2">
                <div className="text-xs text-green-400 font-semibold">DIA 15 (15/12/2024)</div>
                <ul className="text-sm text-slate-300 mt-1 space-y-1">
                  <li>• ⏰ Quarentena do Dia 1 expira!</li>
                  <li>• 📊 Status: <span className="text-green-400">🔓 R$ 50 DISPONÍVEL</span> + <span className="text-red-400">🔒 R$ 30 PENDENTE</span></li>
                </ul>
              </div>
              <div className="border-l-4 border-l-purple-500 pl-4 py-2">
                <div className="text-xs text-purple-400 font-semibold">DIA 16 (16/12/2024)</div>
                <ul className="text-sm text-slate-300 mt-1 space-y-1">
                  <li>• 💸 Seller solicita saque de R$ 50 via PIX</li>
                  <li>• ✅ PIX processado em 5 minutos!</li>
                  <li>• 📊 Status: <span className="text-red-400">🔒 R$ 30 PENDENTE</span> (aguardando quarentena)</li>
                </ul>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 09: AI Costs */}
        <section id="ai-costs" className="mb-20 scroll-mt-20">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-6xl font-black text-primary/20">09</span>
            <h2 className="text-3xl font-bold">Custos de IA e Infraestrutura</h2>
          </div>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Breakdown de Custos por Mensagem</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Análise detalhada dos custos de infraestrutura para uma mensagem típica com RAG (5 chunks recuperados, resposta de 200 tokens).
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Componente</th>
                    <th className="text-left py-3 px-4 font-semibold">Serviço</th>
                    <th className="text-left py-3 px-4 font-semibold">Custo Unitário</th>
                    <th className="text-left py-3 px-4 font-semibold">% do Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Embedding da Query</td>
                    <td className="py-3 px-4 text-muted-foreground">Jina AI v3</td>
                    <td className="py-3 px-4">
                      <code className="text-xs bg-muted px-2 py-1 rounded">R$ 0,001</code>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">2%</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Busca Vetorial</td>
                    <td className="py-3 px-4 text-muted-foreground">Qdrant Cloud</td>
                    <td className="py-3 px-4">
                      <code className="text-xs bg-muted px-2 py-1 rounded">R$ 0,002</code>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">4%</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Geração LLM (GPT-4o)</td>
                    <td className="py-3 px-4 text-muted-foreground">OpenAI</td>
                    <td className="py-3 px-4">
                      <code className="text-xs bg-muted px-2 py-1 rounded">R$ 0,045</code>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">90%</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Infraestrutura (Backend + AI Engine)</td>
                    <td className="py-3 px-4 text-muted-foreground">AWS/GCP</td>
                    <td className="py-3 px-4">
                      <code className="text-xs bg-muted px-2 py-1 rounded">R$ 0,002</code>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">4%</td>
                  </tr>
                  <tr className="border-t-2 border-primary/20 bg-primary/5">
                    <td className="py-3 px-4 font-bold">Custo Total</td>
                    <td className="py-3 px-4"></td>
                    <td className="py-3 px-4">
                      <code className="text-xs bg-primary/20 px-2 py-1 rounded font-bold">R$ 0,050</code>
                    </td>
                    <td className="py-3 px-4 font-bold">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm">
                <strong className="text-foreground">Preço ao Usuário:</strong> 3-5 créditos (R$ 0,30 - R$ 0,50)
                <br />
                <strong className="text-foreground">Margem de Lucro:</strong> 500-900% (R$ 0,25 - R$ 0,45 de lucro bruto)
              </p>
            </div>
          </Card>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Estratégias de Otimização de Custos</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Caching Inteligente</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Embeddings de queries similares são cacheados por 24h, reduzindo custo de Jina em 70%
                </p>
                <div className="text-xs text-primary font-semibold">Economia: R$ 0,0007/msg</div>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Modelos Menores para Tarefas Simples</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  GPT-4o-mini para reformulação de queries (10x mais barato que GPT-4o)
                </p>
                <div className="text-xs text-primary font-semibold">Economia: R$ 0,004/msg</div>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Quantização de Vetores</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Reduz custo de armazenamento no Qdrant em 75% sem perda significativa de qualidade
                </p>
                <div className="text-xs text-primary font-semibold">Economia: R$ 0,0015/msg</div>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Contratos de Volume</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Negociação com OpenAI para desconto de 20% em volumes acima de $10k/mês
                </p>
                <div className="text-xs text-primary font-semibold">Economia: R$ 0,009/msg</div>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-muted/30">
            <h3 className="text-xl font-bold mb-4">Projeção de Custos Mensais (10.000 usuários ativos)</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-background rounded-lg">
                <div>
                  <h4 className="font-semibold">Custos de IA (LLMs + Embeddings)</h4>
                  <p className="text-xs text-muted-foreground">~500.000 mensagens/mês</p>
                </div>
                <div className="text-2xl font-black text-primary">R$ 25.000</div>
              </div>
              <div className="flex justify-between items-center p-4 bg-background rounded-lg">
                <div>
                  <h4 className="font-semibold">Infraestrutura (Servidores, DB, Storage)</h4>
                  <p className="text-xs text-muted-foreground">AWS/GCP multi-region</p>
                </div>
                <div className="text-2xl font-black text-primary">R$ 8.000</div>
              </div>
              <div className="flex justify-between items-center p-4 bg-background rounded-lg">
                <div>
                  <h4 className="font-semibold">Processamento de Pagamentos</h4>
                  <p className="text-xs text-muted-foreground">Stripe (2.9% + R$ 0,30)</p>
                </div>
                <div className="text-2xl font-black text-primary">R$ 4.500</div>
              </div>
              <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
                <div>
                  <h4 className="font-bold">Custo Total Mensal</h4>
                  <p className="text-xs text-muted-foreground">Variável conforme uso</p>
                </div>
                <div className="text-3xl font-black text-primary">R$ 37.500</div>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 10: Pricing */}
        <section id="pricing" className="mb-20 scroll-mt-20">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-6xl font-black text-primary/20">10</span>
            <h2 className="text-3xl font-bold">Planos e Precificação</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="text-sm font-semibold text-primary mb-2">GRATUITO</div>
              <div className="text-3xl font-black mb-4">R$ 0</div>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>50 créditos/mês</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>1 tabela (max 1.000 células)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>Chat básico sem RAG</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-muted-foreground/40">✗</span>
                  <span>Agentes do marketplace</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">Começar Grátis</Button>
            </Card>

            <Card className="p-6 border-2 border-primary">
              <div className="text-sm font-semibold text-primary mb-2">PRO</div>
              <div className="text-3xl font-black mb-4">R$ 49<span className="text-sm font-normal text-muted-foreground">/mês</span></div>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>500 créditos/mês inclusos</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>10 tabelas (ilimitadas células)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>RAG Híbrido completo</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>Acesso a agentes gratuitos</span>
                </li>
              </ul>
              <Button className="w-full">Assinar PRO</Button>
            </Card>

            <Card className="p-6">
              <div className="text-sm font-semibold text-primary mb-2">PREMIUM</div>
              <div className="text-3xl font-black mb-4">R$ 149<span className="text-sm font-normal text-muted-foreground">/mês</span></div>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>2.000 créditos/mês inclusos</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>Tabelas ilimitadas</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>Todos os agentes do marketplace</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>API externa (10k calls/mês)</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">Assinar Premium</Button>
            </Card>

            <Card className="p-6 bg-muted/50">
              <div className="text-sm font-semibold text-primary mb-2">ENTERPRISE</div>
              <div className="text-3xl font-black mb-4">Custom</div>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>Créditos ilimitados</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>Infraestrutura dedicada</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>SLA 99.9% uptime</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>Suporte prioritário 24/7</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">Falar com Vendas</Button>
            </Card>
          </div>

          <Card className="p-8">
            <h3 className="text-xl font-bold mb-4">Estratégia de Precificação</h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                A precificação foi desenhada seguindo o modelo <strong className="text-foreground">freemium com upsell progressivo</strong>. O plano gratuito permite que usuários experimentem o valor da plataforma sem fricção, enquanto os planos pagos desbloqueiam funcionalidades essenciais para uso corporativo.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h4 className="font-semibold mb-2">Ancoragem de Preço</h4>
                  <p className="text-xs">
                    Plano Premium a R$ 149 torna o PRO (R$ 49) parecer mais acessível, aumentando conversão
                  </p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h4 className="font-semibold mb-2">Créditos Inclusos</h4>
                  <p className="text-xs">
                    Usuários pagam pela conveniência e previsibilidade, não apenas pelos créditos
                  </p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h4 className="font-semibold mb-2">Upsell Natural</h4>
                  <p className="text-xs">
                    Quando usuário atinge limite de tabelas ou créditos, oferta de upgrade é contextual
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 11: Projections */}
        <section id="projections" className="mb-20 scroll-mt-20">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-6xl font-black text-primary/20">11</span>
            <h2 className="text-3xl font-bold">Projeções Financeiras</h2>
          </div>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Projeção de Receita (12 meses)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Métrica</th>
                    <th className="text-left py-3 px-4 font-semibold">Mês 3</th>
                    <th className="text-left py-3 px-4 font-semibold">Mês 6</th>
                    <th className="text-left py-3 px-4 font-semibold">Mês 12</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Usuários Totais</td>
                    <td className="py-3 px-4">1.500</td>
                    <td className="py-3 px-4">5.000</td>
                    <td className="py-3 px-4">15.000</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Conversão Gratuito → PRO</td>
                    <td className="py-3 px-4">5%</td>
                    <td className="py-3 px-4">8%</td>
                    <td className="py-3 px-4">12%</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Usuários PRO</td>
                    <td className="py-3 px-4">75</td>
                    <td className="py-3 px-4">400</td>
                    <td className="py-3 px-4">1.800</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Usuários Premium</td>
                    <td className="py-3 px-4">15</td>
                    <td className="py-3 px-4">100</td>
                    <td className="py-3 px-4">450</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Contratos Enterprise</td>
                    <td className="py-3 px-4">0</td>
                    <td className="py-3 px-4">2</td>
                    <td className="py-3 px-4">8</td>
                  </tr>
                  <tr className="border-t-2 border-primary/20 bg-primary/5">
                    <td className="py-3 px-4 font-bold">MRR (Receita Recorrente Mensal)</td>
                    <td className="py-3 px-4 font-bold text-primary">R$ 5.910</td>
                    <td className="py-3 px-4 font-bold text-primary">R$ 44.300</td>
                    <td className="py-3 px-4 font-bold text-primary">R$ 235.200</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-8">
              <h3 className="text-xl font-bold mb-4">Break-Even Point</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Custos Fixos Mensais</span>
                    <span className="font-semibold">R$ 25.000</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Time (5 pessoas), infraestrutura base, marketing
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Custos Variáveis</span>
                    <span className="font-semibold">40% da receita</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    IA, infraestrutura escalável, comissões
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold">Break-Even MRR</span>
                    <span className="text-2xl font-black text-primary">R$ 41.667</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Esperado entre mês 6 e 7
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-primary/5 border-primary/20">
              <h3 className="text-xl font-bold mb-4">Projeção de Lucro (Ano 1)</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Receita Total (12 meses)</span>
                  <span className="text-lg font-bold">R$ 850.000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Custos Variáveis (40%)</span>
                  <span className="text-lg font-bold text-destructive">-R$ 340.000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Custos Fixos</span>
                  <span className="text-lg font-bold text-destructive">-R$ 300.000</span>
                </div>
                <div className="pt-4 border-t-2 border-primary/20">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">Lucro Líquido (Ano 1)</span>
                    <span className="text-3xl font-black text-primary">R$ 210.000</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Margem de 24.7%
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-8">
            <h3 className="text-xl font-bold mb-4">Cenários de Crescimento</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold text-sm mb-2 text-destructive">Pessimista</h4>
                <div className="text-2xl font-black mb-2">5.000</div>
                <p className="text-xs text-muted-foreground mb-3">usuários em 12 meses</p>
                <div className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">MRR:</span>
                    <span className="font-semibold">R$ 80.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lucro:</span>
                    <span className="font-semibold">-R$ 50.000</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-2 border-primary rounded-lg bg-primary/5">
                <h4 className="font-semibold text-sm mb-2 text-primary">Realista</h4>
                <div className="text-2xl font-black mb-2">15.000</div>
                <p className="text-xs text-muted-foreground mb-3">usuários em 12 meses</p>
                <div className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">MRR:</span>
                    <span className="font-semibold">R$ 235.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lucro:</span>
                    <span className="font-semibold text-primary">R$ 210.000</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold text-sm mb-2 text-primary">Otimista</h4>
                <div className="text-2xl font-black mb-2">30.000</div>
                <p className="text-xs text-muted-foreground mb-3">usuários em 12 meses</p>
                <div className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">MRR:</span>
                    <span className="font-semibold">R$ 470.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lucro:</span>
                    <span className="font-semibold text-primary">R$ 680.000</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 12: Metrics */}
        <section id="metrics" className="mb-20 scroll-mt-20">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-6xl font-black text-primary/20">12</span>
            <h2 className="text-3xl font-bold">Métricas de Sucesso</h2>
          </div>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">KPIs Principais</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-primary/5 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">LTV (Lifetime Value)</div>
                <div className="text-3xl font-black text-primary mb-2">R$ 2.400</div>
                <p className="text-xs text-muted-foreground">
                  Valor médio por usuário PRO ao longo de 24 meses (churn de 5%/mês)
                </p>
              </div>
              <div className="p-6 bg-primary/5 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">CAC (Customer Acquisition Cost)</div>
                <div className="text-3xl font-black text-primary mb-2">R$ 180</div>
                <p className="text-xs text-muted-foreground">
                  Custo médio para adquirir um usuário pagante (marketing + vendas)
                </p>
              </div>
              <div className="p-6 bg-primary/5 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">LTV/CAC Ratio</div>
                <div className="text-3xl font-black text-primary mb-2">13.3x</div>
                <p className="text-xs text-muted-foreground">
                  Excelente (benchmark SaaS: 3x). Indica modelo sustentável e escalável
                </p>
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-8">
              <h3 className="text-xl font-bold mb-4">Métricas de Produto</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Taxa de Ativação (7 dias)</span>
                  <span className="text-lg font-bold text-primary">65%</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Usuários Ativos Mensais (MAU)</span>
                  <span className="text-lg font-bold text-primary">70%</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Frequência de Uso (msgs/semana)</span>
                  <span className="text-lg font-bold text-primary">15</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">NPS (Net Promoter Score)</span>
                  <span className="text-lg font-bold text-primary">+45</span>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <h3 className="text-xl font-bold mb-4">Métricas de Marketplace</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Agentes Ativos</span>
                  <span className="text-lg font-bold text-primary">250</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Taxa de Compra (visitantes → compra)</span>
                  <span className="text-lg font-bold text-primary">8%</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Ticket Médio (agente pago)</span>
                  <span className="text-lg font-bold text-primary">R$ 85</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Criadores Ativos (vendas no mês)</span>
                  <span className="text-lg font-bold text-primary">60</span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-8 bg-muted/30">
            <h3 className="text-xl font-bold mb-4">Churn e Retenção</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-primary mb-3">Taxa de Churn Mensal</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Plano Gratuito</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-destructive" style={{ width: "40%" }}></div>
                      </div>
                      <span className="text-sm font-semibold">40%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Plano PRO</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: "5%" }}></div>
                      </div>
                      <span className="text-sm font-semibold">5%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Plano Premium</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: "3%" }}></div>
                      </div>
                      <span className="text-sm font-semibold">3%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Enterprise</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: "1%" }}></div>
                      </div>
                      <span className="text-sm font-semibold">1%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-primary mb-3">Estratégias de Retenção</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      <strong className="text-foreground">Onboarding Guiado:</strong> Tutorial interativo nos primeiros 7 dias
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      <strong className="text-foreground">Alertas de Uso:</strong> Notificação quando créditos estão acabando
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      <strong className="text-foreground">Win-Back Campaigns:</strong> Oferta especial para usuários inativos
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      <strong className="text-foreground">Success Team:</strong> Check-ins proativos com clientes Premium/Enterprise
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 13: GTM */}
        <section id="gtm" className="mb-20 scroll-mt-20">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-6xl font-black text-primary/20">13</span>
            <h2 className="text-3xl font-bold">Go-to-Market Strategy</h2>
          </div>

          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Fases de Lançamento</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  Q1
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">Beta Fechado (Meses 1-2)</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Onboarding de 50 empresas early adopters para validação de produto e coleta de feedback intensivo. Foco em PMF (Product-Market Fit).
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Waitlist</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Entrevistas de Usuário</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Iteração Rápida</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  Q2
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">Lançamento Público (Meses 3-4)</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Abertura da plataforma para público geral. Campanha de marketing digital agressiva (Google Ads, LinkedIn, Product Hunt). Meta: 5.000 usuários.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Product Hunt Launch</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Content Marketing</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Webinars</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  Q3
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">Marketplace e Escala (Meses 5-8)</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Lançamento oficial do marketplace de agentes. Recrutamento ativo de criadores de conteúdo. Parcerias com consultorias e integradores. Meta: 15.000 usuários.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Creator Program</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Parcerias B2B</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Case Studies</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  Q4
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">Enterprise e Expansão (Meses 9-12)</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Foco em vendas enterprise com time dedicado. Expansão internacional (LATAM). Certificações de segurança (SOC 2, ISO 27001). Meta: 30.000 usuários + 10 clientes enterprise.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Sales Team</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Compliance</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">International</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-8">
              <h3 className="text-xl font-bold mb-4">Canais de Aquisição</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold">Content Marketing (SEO + Blog)</span>
                    <span className="text-sm text-primary font-bold">30%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Artigos técnicos sobre RAG, IA corporativa, casos de uso. Meta: 50k visitas/mês
                  </p>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold">Performance Ads (Google + LinkedIn)</span>
                    <span className="text-sm text-primary font-bold">25%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Campanhas segmentadas para decisores de TI e inovação. CPA target: R$ 150
                  </p>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold">Parcerias e Integrações</span>
                    <span className="text-sm text-primary font-bold">20%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Co-marketing com ferramentas complementares (Notion, Slack, Zapier)
                  </p>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold">Community e Eventos</span>
                    <span className="text-sm text-primary font-bold">15%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Meetups, hackathons, conferências de IA e inovação
                  </p>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold">Referral Program</span>
                    <span className="text-sm text-primary font-bold">10%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Incentivo para usuários indicarem colegas (50 créditos por indicação)
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-primary/5 border-primary/20">
              <h3 className="text-xl font-bold mb-4">Orçamento de Marketing (Ano 1)</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Performance Ads</span>
                  <span className="text-lg font-bold">R$ 120.000</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Content & SEO</span>
                  <span className="text-lg font-bold">R$ 60.000</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Eventos e Parcerias</span>
                  <span className="text-lg font-bold">R$ 40.000</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Tools & Analytics</span>
                  <span className="text-lg font-bold">R$ 20.000</span>
                </div>
                <div className="pt-3 border-t-2 border-primary/20">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">Total Marketing</span>
                    <span className="text-2xl font-black text-primary">R$ 240.000</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    CAC target: R$ 180 | Meta: 1.333 usuários pagantes
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-8">
            <h3 className="text-xl font-bold mb-4">Posicionamento Competitivo</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Aspecto</th>
                    <th className="text-left py-3 px-4 font-semibold">Snack Prompt 3.0</th>
                    <th className="text-left py-3 px-4 font-semibold">ChatGPT Enterprise</th>
                    <th className="text-left py-3 px-4 font-semibold">Microsoft Copilot</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Dados Corporativos</td>
                    <td className="py-3 px-4 text-primary">✓ RAG Híbrido Nativo</td>
                    <td className="py-3 px-4 text-muted-foreground">Limitado</td>
                    <td className="py-3 px-4 text-muted-foreground">Apenas M365</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Marketplace de Agentes</td>
                    <td className="py-3 px-4 text-primary">✓ Especialistas</td>
                    <td className="py-3 px-4 text-muted-foreground">Não</td>
                    <td className="py-3 px-4 text-muted-foreground">Não</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Proteção de IP</td>
                    <td className="py-3 px-4 text-primary">✓ Proxy Blindado</td>
                    <td className="py-3 px-4 text-muted-foreground">Parcial</td>
                    <td className="py-3 px-4 text-muted-foreground">Parcial</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">Preço Inicial</td>
                    <td className="py-3 px-4 text-primary">R$ 0 (Freemium)</td>
                    <td className="py-3 px-4 text-muted-foreground">USD 60/usuário</td>
                    <td className="py-3 px-4 text-muted-foreground">USD 30/usuário</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </section>
      </>
    );
  }
}
