import { lazy, Suspense } from "react";
import { Header, Hero, SectionSkeleton, Strengths } from "./widgets";
import { ScrollToTop } from "./shared";

// 섹션 레이지 로딩 (Strengths는 3D Canvas 초기화 충돌 방지를 위해 즉시 로딩)
const Projects = lazy(() =>
  import("./widgets/Projects").then((m) => ({ default: m.Projects })),
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

        <Strengths />
      </main>

      <Suspense fallback={<SectionSkeleton />}>
        <Footer />
      </Suspense>

      <ScrollToTop />
    </>
  );
}

export default App;
