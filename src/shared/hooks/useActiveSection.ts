import { useState, useEffect } from 'react';

/**
 * Intersection Observer를 사용하여 현재 뷰포트에 보이는 섹션 ID를 추적하는 훅
 * @param sectionIds 감시할 섹션 ID 목록
 * @returns 현재 활성화된 섹션 ID
 */
export function useActiveSection(sectionIds: string[]) {
    const [activeSection, setActiveSection] = useState<string>('');

    useEffect(() => {
        const options = {
            // 화면의 중앙 20%~80% 영역을 기준으로 감지
            rootMargin: '-20% 0% -30% 0%',
            threshold: [0, 0.2, 0.5, 0.8] // 정밀한 감지를 위해 여러 임계값 설정
        };

        // 각 섹션의 노출도를 저장할 맵
        const intersectionMap = new Map<string, number>();

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                intersectionMap.set(entry.target.id, entry.intersectionRatio);
            });

            // 가장 많이 노출된 섹션 찾기
            let maxRatio = 0;
            let currentActive = '';

            intersectionMap.forEach((ratio, id) => {
                if (ratio > maxRatio) {
                    maxRatio = ratio;
                    currentActive = id;
                }
            });

            if (currentActive) {
                setActiveSection(currentActive);
            }
        }, options);

        sectionIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, [sectionIds]);

    return activeSection;
}
