import { useRef, useState } from "react";
import { Container, Section, HeroMascot } from "../../shared";
import { PaperPortal } from "../PaperPortal";
import styles from "./Hero.module.css";

/**
 * Hero 섹션 위젯
 * YU Verse 디자인: 다크 배경, 큰 헤드라인, 오른쪽에 3D 모델
 */
export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mascotJumpTrigger, setMascotJumpTrigger] = useState(0);

  const handleCtaClick = () => {
    setMascotJumpTrigger((prev) => prev + 1);
    alert("YU Verse와 함께 새로운 발견을 시작합니다! 🚀");
  };

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
            <button
              type="button"
              className={styles.heroCta}
              onClick={handleCtaClick}
            >
              Get Started
            </button>
          </div>

          {/* 오른쪽: 3D 모델 (비주얼 요소이므로 스크린 리더에서 무시) */}
          <div className={styles.sceneContainer} aria-hidden="true">
            {/* 기존 DigitalCloud - 주석 처리 */}
            {/* <DigitalCloud /> */}
            {/* Paper Portal - 일상의실천 스타일 */}
            <PaperPortal />
          </div>
        </div>
      </Container>
      {/* 마스코트: 섹션 기준 오른쪽 하단 고정 */}
      <HeroMascot externalJumpTrigger={mascotJumpTrigger} />
    </Section>
  );
}
