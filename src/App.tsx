import { Header, Hero, Projects, Strengths, Footer } from "./widgets";
import { ScrollToTop } from "./shared";

function App() {
  return (
    <>
      <Header />

      <main role="main">
        <Hero />
        <Projects />
        <Strengths />
      </main>

      <Footer />

      <ScrollToTop />
    </>
  );
}

export default App;
