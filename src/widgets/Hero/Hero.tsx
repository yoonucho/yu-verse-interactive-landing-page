import { useRef } from "react";
import { Container, Section, Typography, Button } from "../../shared";
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
      id="origin"
      aria-labelledby="hero-title"
    >
      <Container>
        <div className={styles.content} ref={containerRef}>
          {/* 왼쪽: 텍스트 컨텐츠 */}
          <div className={styles.textContent}>
            <Typography
              variant="h2"
              id="hero-title"
              className="section-title"
              style={{ color: "var(--color-white)" }}
            >
              Finding Warmth in the Digital Universe
            </Typography>
            <Typography
              as="p"
              variant={null}
              className="section-subtitle"
              style={{ color: "rgba(255, 255, 255, 0.9)" }}
            >
              Technology can be cold, but interaction should be warm. I carve
              out windows of 'Value' in the vast digital space. This YU verse
              was co-piloted by AI to bridge the gap between imagination and
              reality.
            </Typography>
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
