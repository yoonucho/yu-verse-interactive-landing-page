import { useState, useRef, useCallback } from "react";
import { Network, ShieldCheck, Heart, Anchor, Brain } from "lucide-react";
import {
  cn,
  Container,
  Section,
  VisualScene,
  Typography,
  Skeleton,
  LINKS,
} from "../shared";
import { useInView } from "../shared/hooks";
import styles from "./Strengths.module.css";

/**
 * Strengths 섹션 위젯
 * 5개 카드 그리드: 연결성, 책임, 공감, 신념, 지적 사고
 */
export function Strengths() {
  const {
    ref: sceneRef,
    isVisible,
    hasBeenVisible,
  } = useInView({
    threshold: 0.1,
    rootMargin: "200px",
  });
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

  const cards = [
    {
      icon: <Network size={32} strokeWidth={1.5} />,
      title: "Connectedness",
      description:
        "I understand the organic flow of teams and projects, coordinating the relationships between people and processes.",
      link: LINKS.STRENGTHS,
    },
    {
      icon: <ShieldCheck size={32} strokeWidth={1.5} />,
      title: "Responsibility",
      description:
        "With trusted execution and accountability, I complete every task I take on to the end.",
      link: LINKS.STRENGTHS,
    },
    {
      icon: <Heart size={32} strokeWidth={1.5} />,
      title: "Empathy",
      description:
        "I intuitively understand others' emotions, designing warm, user-centered experiences.",
      link: LINKS.STRENGTHS,
    },
    {
      icon: <Anchor size={32} strokeWidth={1.5} />,
      title: "Belief",
      description:
        "I infuse all projects with a firm philosophy that 'people come before technology.'",
      link: LINKS.STRENGTHS,
    },
    {
      icon: <Brain size={32} strokeWidth={1.5} />,
      title: "Intellection",
      description:
        "Through deep thinking and reflection, I design architectures with logical foundations.",
      link: LINKS.STRENGTHS,
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
            <Typography
              variant="h2"
              id="edu-title"
              className="section-title text-white opacity-80"
            >
              The 5 Sources of Warmth
            </Typography>
            <Typography
              as="p"
              variant={null}
              className="section-subtitle text-white/90"
            >
              My strengths that create meaningful connections in the digital
              space
            </Typography>
          </div>

          {/* 3D 이미지 영역 (비주얼 요소) */}
          <div
            ref={sceneRef}
            className={styles.imageContainer}
            aria-hidden="true"
          >
            {hasBeenVisible ? (
              <VisualScene
                type="protein"
                color="#4e54c8"
                paused={!isVisible}
                onHover={setHoveredIndex}
                onClickSphere={handleSphereClick}
              />
            ) : (
              <Skeleton variant="rect" />
            )}
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
              <Typography
                variant="h3"
                className={cn(styles.cardTitle, "text-white")}
              >
                {card.title}
              </Typography>
              <Typography
                variant="body"
                className={cn(styles.cardDescription, "text-white/90")}
              >
                {card.description}
              </Typography>
              <a
                href={card.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.cardLink}
              >
                Link
              </a>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
