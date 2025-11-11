import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import TrafficClients from "./pages/TrafficClients";
import SocialMediaClients from "./pages/SocialMediaClients";
import CRM from "./pages/CRM";
import WeekDetail from "./pages/WeekDetail";
import Clients from "./pages/Clients";
import TrafficClientDetail from "./pages/TrafficClientDetail";
import SocialMediaClientDetail from "./pages/SocialMediaClientDetail";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/tasks"} component={Tasks} />
      <Route path="/traffic" component={TrafficClients} />
      <Route path="/social-media" component={SocialMediaClients} />
      <Route path="/crm" component={CRM} />
      <Route path="/crm/week/:id" component={WeekDetail} />
      <Route path="/clients" component={Clients} />
      <Route path="/clients/traffic/:id" component={TrafficClientDetail} />
      <Route path="/clients/social/:id" component={SocialMediaClientDetail} />
      <Route path={"/404"} component={NotFound} />
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
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
