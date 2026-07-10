import { useState, useRef, useCallback } from "react";
import {
  Network,
  ShieldCheck,
  Heart,
  Anchor,
  Brain,
  SquareArrowOutUpRight,
} from "lucide-react";
import {
  Button,
  cn,
  Container,
  Section,
  VisualScene,
  Typography,
  Skeleton,
  LINKS,
  useLanguage,
} from "../shared";
import { useInView } from "../shared/hooks";
import styles from "./Strengths.module.css";

/**
 * Strengths 섹션 위젯
 * 5개 카드 그리드: 연결성, 책임, 공감, 신념, 지적 사고
 */
export function Strengths() {
  const { t } = useLanguage();
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

  const cardIcons = [
    <Network size={32} strokeWidth={1.5} />,
    <ShieldCheck size={32} strokeWidth={1.5} />,
    <Heart size={32} strokeWidth={1.5} />,
    <Anchor size={32} strokeWidth={1.5} />,
    <Brain size={32} strokeWidth={1.5} />,
  ];

  const cards = t.strengths.items.map((card, index) => ({
    ...card,
    icon: cardIcons[index],
  }));

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
              {t.strengths.title}
            </Typography>
            <Typography
              as="p"
              variant={null}
              className="section-subtitle text-white/90"
            >
              {t.strengths.subtitle}
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
            </article>
          ))}
        </div>
        <div className={styles.strengthsActions}>
          <Button
            asChild
            variant="brand"
            size="large"
            className={styles.strengthsCta}
          >
            <a
              href={LINKS.STRENGTHS}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.strengths.cta}
              <SquareArrowOutUpRight
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
            </a>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
