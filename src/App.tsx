import { lazy, Suspense } from 'react';
import { Header, Footer, SectionSkeleton, Hero, LifeScience } from './widgets';
import { ScrollToTop } from './shared';

// Lazy loaded widgets
const MaterialsScience = lazy(() => import('./widgets/MaterialsScience').then(m => ({ default: m.MaterialsScience })));
const Pipeline = lazy(() => import('./widgets/Pipeline').then(m => ({ default: m.Pipeline })));
const Education = lazy(() => import('./widgets/Education').then(m => ({ default: m.Education })));
const Company = lazy(() => import('./widgets/Company').then(m => ({ default: m.Company })));
const Events = lazy(() => import('./widgets/Events').then(m => ({ default: m.Events })));
const News = lazy(() => import('./widgets/News').then(m => ({ default: m.News })));

function App() {
    return (
        <>
            <Header />

            <main role="main">
                <Hero />
                <LifeScience />

                <Suspense fallback={<SectionSkeleton reverse />}>
                    <MaterialsScience />
                </Suspense>

                <Suspense fallback={<SectionSkeleton />}>
                    <Pipeline />
                </Suspense>

                <Suspense fallback={<SectionSkeleton reverse />}>
                    <Education />
                </Suspense>

                <Suspense fallback={<SectionSkeleton />}>
                    <Company />
                </Suspense>

                <Suspense fallback={<SectionSkeleton reverse />}>
                    <Events />
                </Suspense>

                <Suspense fallback={<SectionSkeleton />}>
                    <News />
                </Suspense>
            </main>

            <Footer />
            <ScrollToTop />
        </>
    );
}

export default App;
