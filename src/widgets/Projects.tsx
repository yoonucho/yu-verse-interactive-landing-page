import { Container, Section, Typography, LINKS, useLanguage } from "../shared";
import { useInView } from "../shared/hooks";
import { ProjectCard } from "./ProjectCard";
import styles from "./Projects.module.css";

/**
 * Projects 섹션 위젯
 * 5개 프로젝트 카드 그리드 - 3D 플립 카드
 */
export function Projects() {
  const { t } = useLanguage();
  const { ref, isVisible } = useInView({ threshold: 0.1 });

  const projectLinks = [
    LINKS.PROJECT01,
    LINKS.PROJECT02,
    LINKS.PROJECT03,
    LINKS.PROJECT04,
    LINKS.PROJECT05,
  ];

  const projectColors = [
    { from: "#8B7BE8", to: "#53469C" },
    { from: "#4A90E2", to: "#2E5C8A" },
    { from: "#FFBF00", to: "#CC8800" },
    { from: "#9B91E2", to: "#6B5FB3" },
    { from: "#D4D0FF", to: "#A9A3E8" },
  ];

  const projects = t.projects.items.map((project, index) => ({
    id: index + 1,
    ...project,
    color: projectColors[index],
    link: projectLinks[index],
  }));

  return (
    <Section
      variant="light"
      spacing="lg"
      id="projects"
      aria-labelledby="projects-title"
    >
      <Container>
        {/* 헤더 */}
        <div className={styles.header}>
          <Typography
            variant="h2"
            id="projects-title"
            className="section-title text-center opacity-80"
          >
            {t.projects.title}
          </Typography>
          <Typography
            as="p"
            variant={null}
            className="section-subtitle text-text-secondary"
          >
            {t.projects.subtitle}
          </Typography>
        </div>

        {/* 프로젝트 카드 그리드 */}
        <div className={styles.projectGrid} role="list" ref={ref}>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.title}
              subtitle={project.subtitle}
              description={project.description}
              color={project.color}
              link={project.link}
              isVisible={isVisible}
              linkLabel={t.projects.viewDetails}
              ariaLabel={`${project.title} ${t.projects.cardAriaLabel}`}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
