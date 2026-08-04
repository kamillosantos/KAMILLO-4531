import { Route, Switch } from "wouter";
import Index from "./pages/index";
import BlogPage from "./pages/blog";
import BlogPostPage from "./pages/blog-post";
import GarimpoPage from "./pages/garimpo";
import PainelPage from "./pages/painel";
import { Provider } from "./components/provider";
import { AgentFeedback } from "@runablehq/website-runtime";

function App() {
  return (
    <Provider>
      <Switch>
        <Route path="/" component={Index} />
        <Route path="/garimpo" component={GarimpoPage} />
        <Route path="/painel" component={PainelPage} />
        <Route path="/blog" component={BlogPage} />
        <Route path="/blog/:slug" component={BlogPostPage} />
      </Switch>
      {/* Do not remove — off by default, activated by parent iframe via postMessage */}
      {import.meta.env.DEV && <AgentFeedback />}
    </Provider>
  );
}

export default App;
