import { Container, Section, Typography, LINKS } from "../shared";
import { useInView } from "../shared/hooks";
import { ProjectCard } from "./ProjectCard";
import styles from "./Projects.module.css";

/**
 * Projects 섹션 위젯
 * 5개 프로젝트 카드 그리드 - 3D 플립 카드
 */
export function Projects() {
  const { ref, isVisible } = useInView({ threshold: 0.1 });

  const projects = [
    {
      id: 1,
      title: "Youth Suicide Prevention Campaign",
      subtitle: "Empathy through Interaction",
      description:
        "Designing <strong>digital experiences</strong> that embrace the inner emotions of teenagers through <strong>emotion expression training</strong> games and school culture development.",
      color: { from: "#8B7BE8", to: "#53469C" },
      link: LINKS.PROJECT01,
    },
    {
      id: 2,
      title: "Samsung Smart School",
      subtitle: "Immersive Strengths",
      description:
        "Developing <strong>immersive educational content</strong> where children participate proactively through <strong>chatbots, storytelling</strong> and interactive quizzes.",
      color: { from: "#4A90E2", to: "#2E5C8A" },
      link: LINKS.PROJECT02,
    },
    {
      id: 3,
      title: "Micro-Investment Origin",
      subtitle: "Delightful UX",
      description:
        "Implementing <strong>interactive financial interfaces</strong> with 3D flip effects and <strong>delightful animations</strong> that bring joy to users.",
      color: { from: "#FFBF00", to: "#CC8800" },
      link: LINKS.PROJECT03,
    },
    {
      id: 4,
      title: "YU Verse",
      subtitle: "Interactive branding",
      description:
        "Developing an <strong>immersive landing page</strong> that translates abstract values into interactive 3D experiences, bridging the gap between users and digital warmth.",
      color: { from: "#9B91E2", to: "#6B5FB3" },
      link: LINKS.PROJECT04,
    },
    {
      id: 5,
      title: "Dopaminetto",
      subtitle: "Developer community hub",
      description:
        "Established the <strong>automated development foundation</strong> using Husky and lint-staged while designing the <strong>FSD architecture</strong>. Crafted an <strong>empathetic Chat UX</strong> to restore community warmth after Gather.town.",
      color: { from: "#D4D0FF", to: "#A9A3E8" },
      link: LINKS.PROJECT05,
    },
  ];

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
            Selected Constellations of Value
          </Typography>
          <Typography
            as="p"
            variant={null}
            className="section-subtitle text-text-secondary"
          >
            Projects where warmth and technology meet
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
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
