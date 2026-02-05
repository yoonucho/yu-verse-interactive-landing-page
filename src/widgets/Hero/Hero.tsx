import { useRef, useState } from "react";
import { Container, Section } from "../../shared";
import { PaperPortal } from "../PaperPortal";
import styles from "./Hero.module.css";

/**
 * Hero 섹션 위젯
 * YU Verse 디자인: 다크 배경, 큰 헤드라인, 오른쪽에 3D 모델
 */
export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <Section
      variant="dark"
      spacing="lg"
      className={styles.hero}
      id="platform"
      aria-labelledby="hero-title"
    >
      <Container>
        <div className={styles.content} ref={containerRef}>
          {/* 왼쪽: 텍스트 컨텐츠 */}
          <div className={styles.textContent}>
            <h1 id="hero-title" className={styles.heroTitle}>
              Accelerating Therapeutic Discovery
            </h1>
            <p className={styles.heroSubtitle}>
              Transform drug discovery with our cutting-edge digital chemistry
              platform. Leverage computational power to design better molecules
              faster.
            </p>
          </div>

          {/* 비주얼 요소이므로 스크린 리더에서 무시 */}
          <div className={styles.sceneContainer} aria-hidden="true">
            {/* Paper Portal  */}
            <PaperPortal />
          </div>
        </div>
      </Container>
    </Section>
  );
}
