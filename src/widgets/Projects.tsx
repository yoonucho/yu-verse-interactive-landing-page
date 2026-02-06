import { cn, Container, Section, Typography } from "../shared";
import styles from "./Projects.module.css";

/**
 * Projects 섹션 위젯
 * 5개 프로젝트 카드 그리드
 */
export function Projects() {
  const handleProjectClick = (projectId: number) => {
    alert(`프로젝트 ${projectId} 상세 페이지 준비중입니다 🚀`);
  };

  const projects = [
    {
      id: 1,
      title: "Youth Suicide Prevention Campaign",
      focus: "Empathy through Interaction",
      description:
        "Designing digital experiences that embrace the inner emotions of teenagers through emotion expression training games and school culture development.",
    },
    {
      id: 2,
      title: "Samsung Smart School",
      focus: "Immersive Strengths",
      description:
        "Developing immersive strengthsal content where children participate proactively through chatbots, storytelling and interactive quizzes.",
    },
    {
      id: 3,
      title: "Micro-Investment Origin",
      focus: "Delightful UX",
      description:
        "Implementing interactive financial interfaces with 3D flip effects and delightful animations that bring joy to users.",
    },
    {
      id: 4,
      title: "Project 04",
      focus: "Coming Soon",
      description:
        "A new constellation of value is forming. Stay tuned for more details about this exciting project.",
    },
    {
      id: 5,
      title: "Project 05",
      focus: "Coming Soon",
      description:
        "Another meaningful journey is about to begin. More information will be revealed soon.",
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
        <div className={styles.projectGrid} role="list">
          {projects.map((project) => (
            <article
              key={project.id}
              className={styles.projectCard}
              role="listitem"
              onClick={() => handleProjectClick(project.id)}
            >
              <div className={styles.cardContent}>
                <Typography
                  as="span"
                  className={cn(styles.projectNumber, "leading-none")}
                >
                  0{project.id}
                </Typography>
                <Typography
                  variant="h3"
                  className={cn(styles.projectTitle, "text-text-primary")}
                >
                  {project.title}
                </Typography>
                <Typography
                  as="p"
                  className={cn(
                    styles.projectFocus,
                    "mb-4 text-text-secondary opacity-80",
                  )}
                >
                  {project.focus}
                </Typography>
                <Typography
                  variant="body"
                  className={cn(
                    styles.projectDescription,
                    "text-text-secondary",
                  )}
                >
                  {project.description}
                </Typography>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
