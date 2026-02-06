import { Container, Section, VisualScene } from "../shared";
import styles from "./Strengths.module.css";

/**
 * Strengths 섹션 위젯
 * 5개 카드 그리드: 온라인 인증, 무료 리소스, 교육 프로그램
 */
export function Strengths() {
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
    >
      {/* 3D 이미지 영역 (비주얼 요소) */}
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
            <VisualScene type="protein" color="#4e54c8" />
          </div>
        </div>
      </Container>

      <Container>
        {/* 카드 그리드 */}
        <div className={styles.cardsGrid} role="list">
          {cards.map((card, index) => (
            <article key={index} className={styles.card} role="listitem">
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
