import { lazy, Suspense } from "react";
import { Header, Hero, SectionSkeleton } from "./widgets";
import { ScrollToTop } from "./shared";

// 섹션 레이지 로딩
const Projects = lazy(() =>
  import("./widgets/Projects").then((m) => ({ default: m.Projects })),
);
const Strengths = lazy(() =>
  import("./widgets/Strengths").then((m) => ({ default: m.Strengths })),
);
const Footer = lazy(() =>
  import("./widgets/Footer").then((m) => ({ default: m.Footer })),
);

function App() {
  return (
    <>
      <Header />

      <main role="main">
        <Hero />

        <Suspense fallback={<SectionSkeleton />}>
          <Projects />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <Strengths />
        </Suspense>
      </main>

      <Suspense fallback={<SectionSkeleton />}>
        <Footer />
      </Suspense>

      <ScrollToTop />
    </>
  );
}

export default App;
