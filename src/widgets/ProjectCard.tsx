import { useState } from "react";
import { cn, Typography } from "../shared";
import styles from "./ProjectCard.module.css";

/**
 * Hex 컬러를 RGB 문자열로 변환하는 헬퍼 함수
 */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "255, 255, 255";
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

/**
 * 3D 플립 카드 컴포넌트
 * 앞면: 넘버, 제목, 서브타이틀
 * 뒷면: 상세 설명, 링크
 */

interface ProjectCardProps {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  link?: string;
  color: {
    from: string;
    to: string;
  };
  isVisible: boolean;
}

export function ProjectCard({
  id,
  title,
  subtitle,
  description,
  link,
  color,
  isVisible,
}: ProjectCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped((prev) => !prev);
  };

  // 뒷면 스타일 - 하단에서 위로 스며나오는 광원
  const backStyle = {
    "--glow-gradient": `radial-gradient(ellipse 100% 60% at 50% 100%, ${color.from}60, ${color.to}30, transparent 70%)`,
    "--neon-color": color.from,
    "--neon-rgb": hexToRgb(color.from),
  } as React.CSSProperties;

  // 앞면 스타일 - 서브타이틀 컬러
  const frontStyle = {
    "--subtitle-color": color.from,
    "--subtitle-color-transparent": `${color.from}40`,
    "--subtitle-glow": `${color.from}60`,
  } as React.CSSProperties;

  return (
    <article
      className={cn(styles.cardContainer, { [styles.visible]: isVisible })}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`${title} 프로젝트 카드`}
    >
      <div className={cn(styles.cardFlipper, { [styles.flipped]: isFlipped })}>
        {/* 앞면 */}
        <div className={styles.cardFront} style={frontStyle}>
          <Typography
            as="span"
            className={cn(styles.projectNumber, "leading-none")}
          >
            0{id}
          </Typography>
          <Typography variant="h3" className={styles.projectTitle}>
            {title}
          </Typography>
          <Typography as="span" className={styles.projectSubtitle}>
            {subtitle}
          </Typography>
        </div>

        {/* 뒷면 */}
        <div className={styles.cardBack} style={backStyle}>
          <p
            className={styles.projectDescription}
            dangerouslySetInnerHTML={{ __html: description }}
          />
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.projectLink}
              onClick={(e) => e.stopPropagation()}
            >
              View Details
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
