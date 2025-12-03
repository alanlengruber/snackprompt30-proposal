import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Router as WouterRouter } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import TechnicalDocumentation from "./pages/TechnicalDocumentation";
import RoadmapPage from "./pages/RoadmapPage";
import FeaturesPage from "./pages/FeaturesPage";

const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "");

function Routes() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={TechnicalDocumentation} />
      <Route path={"/roadmap"} component={RoadmapPage} />
      <Route path={"/features"} component={FeaturesPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <WouterRouter base={BASE_PATH}>
          <TooltipProvider>
            <Toaster />
            <Routes />
          </TooltipProvider>
        </WouterRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
