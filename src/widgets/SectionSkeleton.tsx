import { Container, Section, Skeleton } from '../shared';

/**
 * 일반적인 2컬럼 섹션용 로딩 스켈레톤 컴포넌트
 */
export function SectionSkeleton({ reverse = false }: { reverse?: boolean }) {
    return (
        <Section variant="light" spacing="lg">
            <Container>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '6rem',
                    alignItems: 'center',
                    direction: reverse ? 'rtl' : 'ltr'
                }}>
                    <div style={{ direction: 'ltr' }}>
                        <Skeleton variant="title" width="80%" />
                        <Skeleton variant="text" />
                        <Skeleton variant="text" width="95%" />
                        <Skeleton variant="text" width="50%" />
                        <div style={{ marginTop: '2rem' }}>
                            <Skeleton variant="button" />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ width: '80%', aspectRatio: '1' }}>
                            <Skeleton variant="circle" />
                        </div>
                    </div>
                </div>
            </Container>
        </Section>
    );
}
