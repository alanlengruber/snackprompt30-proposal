import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronRight,
  Menu,
  X,
  Calendar,
  List,
  LayoutGrid,
  Target,
  Clock,
  Users,
  Zap,
  CheckCircle2,
  Circle,
  PlayCircle,
  FileText,
  Code,
  Briefcase,
} from "lucide-react";
import mermaid from "mermaid";
import {
  phases,
  getAllStories,
  getStoriesBySprint,
  getTotalPoints,
  getCompletedPoints,
  getProgressPercentage,
  sprints,
  responsibles,
  statusColors,
  statusLabels,
  complexityColors,
  complexityLabels,
  type Story,
  type StoryStatus,
  type Responsible,
  type Phase,
} from "@/data/roadmap";

type ViewMode = "overview" | "timeline" | "list";

const phaseColors: Record<string, { bg: string; text: string; border: string }> = {
  slate: { bg: "bg-slate-100", text: "text-slate-800", border: "border-slate-300" },
  blue: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
  green: { bg: "bg-green-100", text: "text-green-800", border: "border-green-300" },
  purple: { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-300" },
};

export default function RoadmapPage() {
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<ViewMode>("overview");
  const [activePhase, setActivePhase] = useState("phase-0");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterSprint, setFilterSprint] = useState<string>("all");
  const [filterResponsible, setFilterResponsible] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const totalPoints = getTotalPoints();
  const completedPoints = getCompletedPoints();
  const progressPercentage = getProgressPercentage();
  const allStories = getAllStories();

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
      const elements = document.querySelectorAll(".mermaid");
      elements.forEach((element, index) => {
        element.removeAttribute("data-processed");
        element.id = `mermaid-roadmap-${index}`;
      });

      if (elements.length > 0) {
        await mermaid.run();
      }
    };

    const timeoutId = setTimeout(() => {
      renderMermaid();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [viewMode]);

  const scrollToPhase = (id: string) => {
    setActivePhase(id);
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

  const getPhaseProgress = (phase: Phase): number => {
    const stories = phase.epics.flatMap((e) => e.stories);
    const completed = stories.filter((s) => s.status === "completed").length;
    return stories.length > 0 ? Math.round((completed / stories.length) * 100) : 0;
  };

  const getStatusIcon = (status: StoryStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "in_progress":
        return <PlayCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <Circle className="h-4 w-4 text-slate-400" />;
    }
  };

  const filteredStories = allStories.filter((story) => {
    if (filterSprint !== "all" && story.sprint !== filterSprint) return false;
    if (filterResponsible !== "all" && story.responsible !== filterResponsible) return false;
    if (filterStatus !== "all" && story.status !== filterStatus) return false;
    return true;
  });

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
          <p className="text-sm text-sidebar-foreground/70 mt-1">Roadmap de Desenvolvimento</p>

          {/* Navigation Links */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/")}
              className="flex-1 gap-2 text-white"
            >
              <FileText className="h-4 w-4" />
              <span className="text-xs">Docs</span>
            </Button>
            <Button variant="default" size="sm" className="flex-1 gap-2">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">Roadmap</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/features")}
              className="w-full gap-2 text-white"
            >
              <List className="h-4 w-4" />
              <span className="text-xs">Feature List</span>
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-sidebar-accent/50 rounded-lg p-3">
              <div className="text-2xl font-bold text-sidebar-foreground">{allStories.length}</div>
              <div className="text-xs text-sidebar-foreground/60">Features</div>
            </div>
            <div className="bg-sidebar-accent/50 rounded-lg p-3">
              <div className="text-2xl font-bold text-sidebar-foreground">{totalPoints}</div>
              <div className="text-xs text-sidebar-foreground/60">Story Points</div>
            </div>
            <div className="bg-sidebar-accent/50 rounded-lg p-3">
              <div className="text-2xl font-bold text-sidebar-foreground">{sprints.length}</div>
              <div className="text-xs text-sidebar-foreground/60">Sprints</div>
            </div>
            <div className="bg-sidebar-accent/50 rounded-lg p-3">
              <div className="text-2xl font-bold text-sidebar-foreground">22</div>
              <div className="text-xs text-sidebar-foreground/60">Semanas</div>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-sidebar-foreground/60 mb-1">
              <span>Progresso Geral</span>
              <span>{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-350px)]">
          <nav className="p-6 space-y-1">
            {phases.map((phase) => {
              const progress = getPhaseProgress(phase);
              const colors = phaseColors[phase.color] || phaseColors.slate;
              return (
                <button
                  key={phase.id}
                  onClick={() => scrollToPhase(phase.id)}
                  className={`w-full text-left px-4 py-3 rounded-md transition-all duration-200 group ${
                    activePhase === phase.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full ${colors.bg} ${
                        phase.status === "completed" ? "bg-green-500" : ""
                      }`}
                    />
                    <span className="text-sm font-medium flex-1">{phase.shortTitle}</span>
                    <Badge variant="secondary" className="text-xs">
                      {phase.storyPoints}pts
                    </Badge>
                  </div>
                  <div className="mt-2 ml-5">
                    <Progress value={progress} className="h-1" />
                  </div>
                </button>
              );
            })}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-80 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12 lg:py-20">
          {/* Header */}
          <header className="mb-12">
            <div className="inline-block px-4 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-4">
              ROADMAP DE DESENVOLVIMENTO
            </div>
            <h1 className="text-5xl lg:text-6xl font-black tracking-tight mb-6">
              Roadmap Snack Prompt 3.0
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Planejamento completo de desenvolvimento com {allStories.length} features, {totalPoints}{" "}
              story points distribuídos em {sprints.length} sprints ao longo de 22 semanas.
            </p>

            {/* View Mode Toggle */}
            <div className="flex flex-wrap gap-4 mt-8">
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "overview" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("overview")}
                  className="gap-2"
                >
                  <LayoutGrid className="h-4 w-4" />
                  Visão Geral
                </Button>
                <Button
                  variant={viewMode === "timeline" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("timeline")}
                  className="gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Timeline
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="gap-2"
                >
                  <List className="h-4 w-4" />
                  Lista
                </Button>
              </div>
            </div>
          </header>

          {viewMode === "overview" && renderOverviewContent()}
          {viewMode === "timeline" && renderTimelineContent()}
          {viewMode === "list" && renderListContent()}

          {/* Footer */}
          <footer className="border-t border-border pt-12 mt-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Timeline Total:</strong> 22 semanas (~5.5 meses)
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">MVP Completo:</strong> Final de Junho 2025
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Status:</strong> Em Planejamento
                </p>
              </div>
              <Button
                onClick={() => scrollToPhase("phase-0")}
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

  function renderOverviewContent() {
    return (
      <>
        {/* Summary Cards */}
        <section className="mb-12">
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-100 rounded-lg">
                  <Target className="h-6 w-6 text-slate-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{phases.length}</div>
                  <div className="text-sm text-muted-foreground">Fases</div>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{sprints.length}</div>
                  <div className="text-sm text-muted-foreground">Sprints</div>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{totalPoints}</div>
                  <div className="text-sm text-muted-foreground">Story Points</div>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold">4</div>
                  <div className="text-sm text-muted-foreground">Desenvolvedores</div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Gantt Chart */}
        <section className="mb-12">
          <Card className="p-8">
            <h3 className="text-xl font-bold mb-6">Timeline do Projeto</h3>
            <div className="mermaid">
              {`gantt
    title Roadmap Snack Prompt 3.0
    dateFormat  YYYY-MM-DD
    section Fase 0
    Setup AI Engine       :f0, 2025-01-06, 2w
    section Fase 1
    Ingestao              :f1a, after f0, 2w
    Chat RAG              :f1b, after f1a, 2w
    Citacoes              :f1c, after f1b, 2w
    section Fase 2
    Agent Runtime         :f2a, after f1c, 2w
    Tools                 :f2b, after f2a, 2w
    RAG Hibrido           :f2c, after f2b, 2w
    Agent Builder UI      :f2d, after f2c, 2w
    section Fase 3
    Creditos              :f3a, after f2d, 2w
    Marketplace           :f3b, after f3a, 2w
    Cash-out              :f3c, after f3b, 2w`}
            </div>
          </Card>
        </section>

        {/* Phases */}
        {phases.map((phase) => {
          const colors = phaseColors[phase.color] || phaseColors.slate;
          const progress = getPhaseProgress(phase);
          const totalStories = phase.epics.flatMap((e) => e.stories).length;

          return (
            <section key={phase.id} id={phase.id} className="mb-12 scroll-mt-20">
              <div className="flex items-baseline gap-4 mb-6">
                <span className={`text-6xl font-black ${colors.text} opacity-30`}>
                  {phase.id.replace("phase-", "0")}
                </span>
                <div>
                  <h2 className="text-3xl font-bold">{phase.title}</h2>
                  <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{phase.sprints} sprint(s)</span>
                    <span>{phase.duration}</span>
                    <span>{phase.storyPoints} pontos</span>
                  </div>
                </div>
              </div>

              {/* Phase Card */}
              <Card className={`p-6 mb-6 border-l-4 ${colors.border}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <Badge className={`${colors.bg} ${colors.text} mb-2`}>
                      {statusLabels[phase.status]}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      {totalStories} features | {phase.storyPoints} story points
                    </div>
                  </div>
                  <div className="w-full md:w-48">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Progresso</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </div>

                {/* Milestones */}
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-2">Milestones:</h4>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {phase.milestones.map((milestone, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {milestone}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>

              {/* Epics */}
              <Accordion type="multiple" className="space-y-4">
                {phase.epics.map((epic) => {
                  const epicCompleted = epic.stories.filter((s) => s.status === "completed").length;
                  const epicProgress =
                    epic.stories.length > 0
                      ? Math.round((epicCompleted / epic.stories.length) * 100)
                      : 0;

                  return (
                    <AccordionItem key={epic.id} value={epic.id} className="border rounded-lg">
                      <AccordionTrigger className="px-6 py-4 hover:no-underline">
                        <div className="flex items-center gap-4 w-full">
                          <div className="flex-1 text-left">
                            <div className="font-semibold">{epic.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {epic.stories.length} stories |{" "}
                              {epic.stories.reduce((sum, s) => sum + s.points, 0)} pontos
                            </div>
                          </div>
                          <div className="w-24">
                            <Progress value={epicProgress} className="h-1" />
                          </div>
                          <Badge variant="outline">{epicProgress}%</Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 pr-4">ID</th>
                                <th className="text-left py-2 pr-4">Feature</th>
                                <th className="text-left py-2 pr-4">Pts</th>
                                <th className="text-left py-2 pr-4">Responsável</th>
                                <th className="text-left py-2 pr-4">Sprint</th>
                                <th className="text-left py-2">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {epic.stories.map((story) => (
                                <tr key={story.id} className="border-b last:border-0">
                                  <td className="py-3 pr-4">
                                    <code className="text-xs bg-muted px-1 py-0.5 rounded">
                                      {story.id}
                                    </code>
                                  </td>
                                  <td className="py-3 pr-4">
                                    <div className="font-medium">{story.item}</div>
                                    <div className="text-xs text-muted-foreground line-clamp-2 max-w-md">
                                      {story.note}
                                    </div>
                                  </td>
                                  <td className="py-3 pr-4">
                                    <Badge
                                      variant="secondary"
                                      className={complexityColors[story.complexity]}
                                    >
                                      {story.points}
                                    </Badge>
                                  </td>
                                  <td className="py-3 pr-4 text-muted-foreground">
                                    {story.responsible}
                                  </td>
                                  <td className="py-3 pr-4">
                                    <Badge variant="outline">{story.sprint}</Badge>
                                  </td>
                                  <td className="py-3">
                                    <div className="flex items-center gap-2">
                                      {getStatusIcon(story.status)}
                                      <span className={statusColors[story.status] + " px-2 py-0.5 rounded text-xs"}>
                                        {statusLabels[story.status]}
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </section>
          );
        })}
      </>
    );
  }

  function renderTimelineContent() {
    return (
      <>
        {/* Sprint Timeline */}
        <section className="mb-12">
          <Card className="p-8">
            <h3 className="text-xl font-bold mb-6">Distribuição por Sprint</h3>
            <div className="space-y-4">
              {sprints.map((sprint) => {
                const sprintStories = getStoriesBySprint(sprint);
                const sprintPoints = sprintStories.reduce((sum, s) => sum + s.points, 0);
                const completedStories = sprintStories.filter((s) => s.status === "completed").length;
                const progress =
                  sprintStories.length > 0
                    ? Math.round((completedStories / sprintStories.length) * 100)
                    : 0;

                // Determine phase color
                const phase = phases.find((p) =>
                  p.epics.some((e) => e.stories.some((s) => s.sprint === sprint))
                );
                const colors = phaseColors[phase?.color || "slate"];

                return (
                  <div key={sprint} className="flex items-center gap-4">
                    <div className="w-12 text-center">
                      <Badge className={`${colors.bg} ${colors.text}`}>{sprint}</Badge>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">
                          {sprintStories.length} stories | {sprintPoints} pts
                        </span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-3" />
                    </div>
                    <div className="w-24 text-right text-sm text-muted-foreground">
                      {completedStories}/{sprintStories.length}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </section>

        {/* Team Distribution */}
        <section className="mb-12">
          <Card className="p-8">
            <h3 className="text-xl font-bold mb-6">Distribuição por Responsável</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {responsibles.map((responsible) => {
                const stories = allStories.filter((s) => s.responsible === responsible);
                const points = stories.reduce((sum, s) => sum + s.points, 0);
                const percentage = Math.round((points / totalPoints) * 100);

                return (
                  <div key={responsible} className="flex items-center gap-4">
                    <div className="w-36 text-sm font-medium">{responsible}</div>
                    <div className="flex-1">
                      <Progress value={percentage} className="h-3" />
                    </div>
                    <div className="w-20 text-right text-sm text-muted-foreground">
                      {points} pts ({percentage}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </section>

        {/* Dependencies Diagram */}
        <section className="mb-12">
          <Card className="p-8">
            <h3 className="text-xl font-bold mb-6">Caminho Crítico</h3>
            <div className="mermaid">
              {`flowchart LR
    subgraph F0["Fase 0: Fundacao"]
        A[AI Engine Base]
    end

    subgraph F1["Fase 1: MVP Chat"]
        B[Ingestao]
        C[Chat RAG]
        D[Citacoes]
    end

    subgraph F2["Fase 2: Agentes"]
        E[LangGraph]
        F[Tools]
        G[Agent Builder]
    end

    subgraph F3["Fase 3: Marketplace"]
        H[Creditos]
        I[Marketplace]
        J[Cash-out]
    end

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J`}
            </div>
          </Card>
        </section>
      </>
    );
  }

  function renderListContent() {
    return (
      <>
        {/* Filters */}
        <section className="mb-8">
          <Card className="p-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[150px]">
                <label className="text-sm font-medium mb-2 block">Sprint</label>
                <Select value={filterSprint} onValueChange={setFilterSprint}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os sprints" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {sprints.map((sprint) => (
                      <SelectItem key={sprint} value={sprint}>
                        {sprint}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="text-sm font-medium mb-2 block">Responsável</label>
                <Select value={filterResponsible} onValueChange={setFilterResponsible}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {responsibles.map((responsible) => (
                      <SelectItem key={responsible} value={responsible}>
                        {responsible}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="in_progress">Em Progresso</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Mostrando {filteredStories.length} de {allStories.length} features
            </div>
          </Card>
        </section>

        {/* Stories Table */}
        <section>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left py-3 px-4">ID</th>
                    <th className="text-left py-3 px-4">Feature</th>
                    <th className="text-left py-3 px-4">Pontos</th>
                    <th className="text-left py-3 px-4">Responsável</th>
                    <th className="text-left py-3 px-4">Sprint</th>
                    <th className="text-left py-3 px-4">Complexidade</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStories.map((story) => (
                    <tr key={story.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{story.id}</code>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{story.item}</div>
                        <div className="text-xs text-muted-foreground">{story.feature}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">{story.points}</Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{story.responsible}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{story.sprint}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={complexityColors[story.complexity]}>
                          {complexityLabels[story.complexity]}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(story.status)}
                          <span className={statusColors[story.status] + " px-2 py-0.5 rounded text-xs"}>
                            {statusLabels[story.status]}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>
      </>
    );
  }
}
