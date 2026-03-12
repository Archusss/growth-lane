import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import Library from "@/pages/Library";
import EbookDetail from "@/pages/EbookDetail";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Admin from "@/pages/Admin";

function Router() {
  return (
    <Switch>
      {/* Public Pages wrapped in Layout */}
      <Route path="/">
        <Layout><Home /></Layout>
      </Route>
      <Route path="/library">
        <Layout><Library /></Layout>
      </Route>
      <Route path="/ebook/:id">
        <Layout><EbookDetail /></Layout>
      </Route>
      <Route path="/contact">
        <Layout><Contact /></Layout>
      </Route>
      
      {/* Auth & Admin Routes */}
      <Route path="/login" component={Login} />
      <Route path="/admin" component={Admin} />
      
      <Route>
        <Layout><NotFound /></Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
