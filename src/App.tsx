import { Header, Hero, Projects, Strengths, Footer } from "./widgets";
import { LanguageProvider, ScrollToTop } from "./shared";

function App() {
  return (
    <LanguageProvider>
      <Header />

      <main role="main">
        <Hero />
        <Projects />
        <Strengths />
      </main>

      <Footer />

      <ScrollToTop />
    </LanguageProvider>
  );
}

export default App;
