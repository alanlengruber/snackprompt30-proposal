import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  Search,
  Download,
  Filter,
  LayoutGrid,
  List,
  X,
} from "lucide-react";
import {
  phases,
  getAllStories,
  sprints,
  responsibles,
  type Story,
  type StoryStatus,
  type Complexity,
  type StoryType,
  type Team,
  type Responsible,
} from "@/data/roadmap";

type ViewMode = "table" | "cards";

const complexityConfig: Record<Complexity, { label: string; color: string; flags: string }> = {
  simple: { label: "Simple", color: "bg-green-100 text-green-800 border-green-200", flags: "🚩" },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-800 border-yellow-200", flags: "🚩🚩" },
  hard: { label: "Hard", color: "bg-orange-100 text-orange-800 border-orange-200", flags: "🚩🚩🚩" },
  very_hard: { label: "Very Hard", color: "bg-red-100 text-red-800 border-red-200", flags: "🚩🚩🚩🚩" },
};

const statusConfig: Record<StoryStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-slate-100 text-slate-700 border-slate-200" },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-700 border-blue-200" },
  completed: { label: "Completed", color: "bg-green-100 text-green-700 border-green-200" },
};

const typeConfig: Record<StoryType, { color: string }> = {
  Core: { color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  UI: { color: "bg-pink-100 text-pink-800 border-pink-200" },
  UX: { color: "bg-purple-100 text-purple-800 border-purple-200" },
  Integration: { color: "bg-cyan-100 text-cyan-800 border-cyan-200" },
  Security: { color: "bg-red-100 text-red-800 border-red-200" },
  Tool: { color: "bg-amber-100 text-amber-800 border-amber-200" },
  Compliance: { color: "bg-gray-100 text-gray-800 border-gray-200" },
  Product: { color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
};

const teamConfig: Record<Team, { color: string }> = {
  Engineering: { color: "bg-blue-50 text-blue-700 border-blue-200" },
  Product: { color: "bg-violet-50 text-violet-700 border-violet-200" },
};

const phaseConfig: Record<string, { label: string; color: string }> = {
  "phase-0": { label: "Fase 0", color: "bg-slate-100 text-slate-800 border-slate-300" },
  "phase-1": { label: "Fase 1", color: "bg-blue-100 text-blue-800 border-blue-300" },
  "phase-2": { label: "Fase 2", color: "bg-green-100 text-green-800 border-green-300" },
  "phase-3": { label: "Fase 3", color: "bg-purple-100 text-purple-800 border-purple-300" },
};

interface StoryWithPhase extends Story {
  phase: string;
  phaseName: string;
}

export default function FeaturesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [search, setSearch] = useState("");
  const [filterPhase, setFilterPhase] = useState<string>("all");
  const [filterSprint, setFilterSprint] = useState<string>("all");
  const [filterResponsible, setFilterResponsible] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterComplexity, setFilterComplexity] = useState<string>("all");
  const [filterTeam, setFilterTeam] = useState<string>("all");

  // Get all stories with phase info
  const allStoriesWithPhase: StoryWithPhase[] = useMemo(() => {
    return phases.flatMap((phase) =>
      phase.epics.flatMap((epic) =>
        epic.stories.map((story) => ({
          ...story,
          phase: phase.id,
          phaseName: phase.shortTitle,
        }))
      )
    );
  }, []);

  // Filter stories
  const filteredStories = useMemo(() => {
    return allStoriesWithPhase.filter((story) => {
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          story.item.toLowerCase().includes(searchLower) ||
          story.id.toLowerCase().includes(searchLower) ||
          story.feature.toLowerCase().includes(searchLower) ||
          story.note.toLowerCase().includes(searchLower) ||
          story.functionality.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      if (filterPhase !== "all" && story.phase !== filterPhase) return false;
      if (filterSprint !== "all" && story.sprint !== filterSprint) return false;
      if (filterResponsible !== "all" && story.responsible !== filterResponsible) return false;
      if (filterStatus !== "all" && story.status !== filterStatus) return false;
      if (filterType !== "all" && story.type !== filterType) return false;
      if (filterComplexity !== "all" && story.complexity !== filterComplexity) return false;
      if (filterTeam !== "all" && story.team !== filterTeam) return false;
      return true;
    });
  }, [allStoriesWithPhase, search, filterPhase, filterSprint, filterResponsible, filterStatus, filterType, filterComplexity, filterTeam]);

  // Stats
  const stats = useMemo(() => {
    const total = filteredStories.length;
    const totalPoints = filteredStories.reduce((sum, s) => sum + s.points, 0);
    const byComplexity = {
      simple: filteredStories.filter((s) => s.complexity === "simple"),
      medium: filteredStories.filter((s) => s.complexity === "medium"),
      hard: filteredStories.filter((s) => s.complexity === "hard"),
      very_hard: filteredStories.filter((s) => s.complexity === "very_hard"),
    };
    return { total, totalPoints, byComplexity };
  }, [filteredStories]);

  const hasActiveFilters =
    filterPhase !== "all" ||
    filterSprint !== "all" ||
    filterResponsible !== "all" ||
    filterStatus !== "all" ||
    filterType !== "all" ||
    filterComplexity !== "all" ||
    filterTeam !== "all" ||
    search !== "";

  const clearFilters = () => {
    setSearch("");
    setFilterPhase("all");
    setFilterSprint("all");
    setFilterResponsible("all");
    setFilterStatus("all");
    setFilterType("all");
    setFilterComplexity("all");
    setFilterTeam("all");
  };

  const exportToCSV = () => {
    const headers = ["Reference", "Item", "Feature", "Version", "Person", "Type", "Complexity", "Note", "Device", "Team", "Functionality", "Status", "Points"];
    const rows = filteredStories.map((s) => [
      s.id,
      s.item,
      s.feature,
      s.sprint,
      s.responsible,
      s.type,
      complexityConfig[s.complexity].label,
      `"${s.note.replace(/"/g, '""')}"`,
      s.device,
      s.team,
      `"${s.functionality.replace(/"/g, '""')}"`,
      statusConfig[s.status].label,
      s.points,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "snackprompt-features.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/roadmap">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Feature List</h1>
                <p className="text-sm text-muted-foreground">
                  Snack Prompt 3.0 - {stats.total} features | {stats.totalPoints} story points
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex border rounded-lg p-1">
                <Button
                  variant={viewMode === "table" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "cards" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={exportToCSV} className="gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-6 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          <Card className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total Features</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold">{stats.totalPoints}</div>
            <div className="text-xs text-muted-foreground">Story Points</div>
          </Card>
          <Card className="p-4 border-l-4 border-l-green-500">
            <div className="text-2xl font-bold">{stats.byComplexity.simple.length}</div>
            <div className="text-xs text-muted-foreground">Simple</div>
          </Card>
          <Card className="p-4 border-l-4 border-l-yellow-500">
            <div className="text-2xl font-bold">{stats.byComplexity.medium.length}</div>
            <div className="text-xs text-muted-foreground">Medium</div>
          </Card>
          <Card className="p-4 border-l-4 border-l-orange-500">
            <div className="text-2xl font-bold">{stats.byComplexity.hard.length}</div>
            <div className="text-xs text-muted-foreground">Hard</div>
          </Card>
          <Card className="p-4 border-l-4 border-l-red-500">
            <div className="text-2xl font-bold">{stats.byComplexity.very_hard.length}</div>
            <div className="text-xs text-muted-foreground">Very Hard</div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters</span>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs gap-1">
                <X className="h-3 w-3" />
                Clear all
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            <div className="col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search features..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={filterPhase} onValueChange={setFilterPhase}>
              <SelectTrigger>
                <SelectValue placeholder="Phase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Phases</SelectItem>
                {phases.map((phase) => (
                  <SelectItem key={phase.id} value={phase.id}>
                    {phase.shortTitle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterSprint} onValueChange={setFilterSprint}>
              <SelectTrigger>
                <SelectValue placeholder="Sprint" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sprints</SelectItem>
                {sprints.map((sprint) => (
                  <SelectItem key={sprint} value={sprint}>
                    {sprint}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterResponsible} onValueChange={setFilterResponsible}>
              <SelectTrigger>
                <SelectValue placeholder="Person" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All People</SelectItem>
                {responsibles.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Core">Core</SelectItem>
                <SelectItem value="UI">UI</SelectItem>
                <SelectItem value="UX">UX</SelectItem>
                <SelectItem value="Integration">Integration</SelectItem>
                <SelectItem value="Security">Security</SelectItem>
                <SelectItem value="Tool">Tool</SelectItem>
                <SelectItem value="Compliance">Compliance</SelectItem>
                <SelectItem value="Product">Product</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterComplexity} onValueChange={setFilterComplexity}>
              <SelectTrigger>
                <SelectValue placeholder="Complexity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Complexity</SelectItem>
                <SelectItem value="simple">Simple</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
                <SelectItem value="very_hard">Very Hard</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterTeam} onValueChange={setFilterTeam}>
              <SelectTrigger>
                <SelectValue placeholder="Team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Product">Product</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Content */}
        {viewMode === "table" ? (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="table-fixed w-[1600px]">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[70px] font-bold">Ref</TableHead>
                    <TableHead className="w-[180px] font-bold">Item</TableHead>
                    <TableHead className="w-[140px] font-bold">Feature</TableHead>
                    <TableHead className="w-[50px] font-bold">Ver</TableHead>
                    <TableHead className="w-[110px] font-bold">Person</TableHead>
                    <TableHead className="w-[85px] font-bold">Type</TableHead>
                    <TableHead className="w-[85px] font-bold">Complexity</TableHead>
                    <TableHead className="w-[350px] font-bold">Note</TableHead>
                    <TableHead className="w-[90px] font-bold">Device</TableHead>
                    <TableHead className="w-[90px] font-bold">Team</TableHead>
                    <TableHead className="w-[250px] font-bold">Functionality</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStories.map((story) => (
                    <TableRow key={story.id} className="hover:bg-muted/30 align-top">
                      <TableCell className="w-[70px]">
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                          {story.id}
                        </code>
                      </TableCell>
                      <TableCell className="w-[180px]">
                        <div className="font-medium text-sm whitespace-normal break-words">{story.item}</div>
                      </TableCell>
                      <TableCell className="w-[140px]">
                        <span className="text-xs text-muted-foreground whitespace-normal break-words">{story.feature}</span>
                      </TableCell>
                      <TableCell className="w-[50px]">
                        <Badge variant="outline" className="font-mono text-xs">
                          {story.sprint}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[110px]">
                        <span className="text-xs whitespace-normal break-words">{story.responsible}</span>
                      </TableCell>
                      <TableCell className="w-[85px]">
                        <Badge className={`${typeConfig[story.type].color} border text-xs`}>
                          {story.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[85px]">
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge className={`${complexityConfig[story.complexity].color} border text-xs`}>
                              {complexityConfig[story.complexity].flags}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            {complexityConfig[story.complexity].label} ({story.points} pts)
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="w-[350px]">
                        <p className="text-xs text-muted-foreground whitespace-normal break-words">{story.note}</p>
                      </TableCell>
                      <TableCell className="w-[90px]">
                        <span className="text-xs text-muted-foreground">{story.device}</span>
                      </TableCell>
                      <TableCell className="w-[90px]">
                        <Badge className={`${teamConfig[story.team].color} border text-xs`}>
                          {story.team}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[250px]">
                        <p className="text-xs text-muted-foreground whitespace-normal break-words">{story.functionality}</p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStories.map((story) => (
              <Card key={story.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                    {story.id}
                  </code>
                  <div className="flex gap-1">
                    <Badge className={`${phaseConfig[story.phase].color} text-xs`}>
                      {story.phaseName}
                    </Badge>
                    <Badge variant="outline" className="font-mono text-xs">
                      {story.sprint}
                    </Badge>
                  </div>
                </div>
                <h3 className="font-semibold mb-1">{story.item}</h3>
                <p className="text-sm text-muted-foreground mb-3">{story.feature}</p>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-3">{story.note}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <Badge className={`${typeConfig[story.type].color} border text-xs`}>
                    {story.type}
                  </Badge>
                  <Badge className={`${complexityConfig[story.complexity].color} border text-xs`}>
                    {complexityConfig[story.complexity].flags} {complexityConfig[story.complexity].label}
                  </Badge>
                  <Badge className={`${teamConfig[story.team].color} border text-xs`}>
                    {story.team}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                  <span>{story.responsible}</span>
                  <span>{story.device}</span>
                  <Badge variant="secondary">{story.points} pts</Badge>
                </div>
              </Card>
            ))}
          </div>
        )}

        {filteredStories.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No features match your filters.</p>
            <Button variant="link" onClick={clearFilters}>
              Clear all filters
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
}
