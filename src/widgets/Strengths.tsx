import { useState, useRef, useCallback } from "react";
import { Container, Section, VisualScene } from "../shared";
import styles from "./Strengths.module.css";

/**
 * Strengths 섹션 위젯
 * 5개 카드 그리드: 연결성, 책임, 공감, 신념, 지적 사고
 */
export function Strengths() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSphereClick = useCallback((index: number) => {
    // 이전 타이머 정리
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    // 해당 카드로 스크롤
    cardRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    // 활성 상태 설정
    setClickedIndex(index);

    // 3초 후 자동 해제
    clickTimerRef.current = setTimeout(() => {
      setClickedIndex(null);
    }, 3000);
  }, []);

  const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    alert("준비중입니다 🚀");
  };

  const cards = [
    {
      icon: "�",
      title: "Connectedness",
      description:
        "I understand the organic flow of teams and projects, coordinating the relationships between people and processes.",
      link: "Learn More",
    },
    {
      icon: "✅",
      title: "Responsibility",
      description:
        "With trusted execution and accountability, I complete every task I take on to the end.",
      link: "Learn More",
    },
    {
      icon: "💚",
      title: "Empathy",
      description:
        "I intuitively understand others' emotions, designing warm, user-centered experiences.",
      link: "Learn More",
    },
    {
      icon: "💙",
      title: "Belief",
      description:
        "I infuse all projects with a firm philosophy that 'people come before technology.'",
      link: "Learn More",
    },
    {
      icon: "🧠",
      title: "Intellection",
      description:
        "Through deep thinking and reflection, I design architectures with logical foundations.",
      link: "Learn More",
    },
  ];

  return (
    <Section
      variant="light"
      spacing="lg"
      id="strengths"
      aria-labelledby="edu-title"
      className={styles.strengths}
    >
      <Container>
        <div className={styles.content}>
          {/* 텍스트 컨텐츠 */}
          {/* 헤더 */}
          <div className={styles.header}>
            <h2 id="edu-title" className={styles.title}>
              The 5 Sources of Warmth
            </h2>
            <p className={styles.subtitle}>
              My strengths that create meaningful connections in the digital
              space
            </p>
          </div>

          {/* 3D 이미지 영역 (비주얼 요소) */}
          <div className={styles.imageContainer} aria-hidden="true">
            <VisualScene
              type="protein"
              color="#4e54c8"
              onHover={setHoveredIndex}
              onClickSphere={handleSphereClick}
            />
          </div>
        </div>
      </Container>

      <Container>
        {/* 카드 그리드 */}
        <div className={styles.cardsGrid} role="list">
          {cards.map((card, index) => (
            <article
              key={index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className={`${styles.card} ${hoveredIndex === index ? styles.cardActive : ""} ${clickedIndex === index ? styles.cardClicked : ""}`}
              role="listitem"
            >
              <div className={styles.cardIcon} aria-hidden="true">
                {card.icon}
              </div>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDescription}>{card.description}</p>
              <a href="#" className={styles.cardLink} onClick={handleCardClick}>
                {card.link} →
              </a>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
