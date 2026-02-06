import { Container, Section, ASSETS, Typography, Button } from "../shared";
import { Mail } from "lucide-react";
import styles from "./Footer.module.css";

/**
 * Github 커스텀 아이콘 (Lucide v0.400+ 브랜드 아이콘 deprecated 대응)
 */
const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

/**
 * Footer 위젯 컴포넌트
 * 'Signal' 컨셉: 임팩트 있는 중앙 텍스트와 심플한 푸터 구성
 */
export function Footer() {
  const handleExplore = () => {
    alert("준비중입니다 🚀");
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} id="contact">
      <Section
        variant="dark"
        className={styles.signalSection}
        aria-labelledby="footer-title"
      >
        {/* 배경 오버레이 */}
        <div className={styles.backgroundOverlay} aria-hidden="true" />

        <Container>
          <div className={styles.content}>
            <Typography
              variant="h2"
              id="footer-title"
              className="section-title"
              style={{
                background:
                  "linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.7) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Signal
            </Typography>
            <Typography
              as="p"
              variant={null}
              className="section-subtitle"
              style={{ color: "rgba(255, 255, 255, 0.9)" }}
            >
              I'm always ready to connect. <br />
              Let's create digital experiences that hearts and technology
              exchange.
            </Typography>
            <Button
              variant="brand"
              size="large"
              className={styles.btnExplore}
              onClick={handleExplore}
            >
              LET'S CONNECT
            </Button>
          </div>
        </Container>
      </Section>

      <div className={styles.bottomBar}>
        <Container>
          <div className={styles.bottomInner}>
            <div className={styles.brand}>
              <img
                src={ASSETS.IMAGES.LOGO}
                alt="YU Verse"
                className={styles.logoImg}
              />
              <Typography variant="caption" className={styles.copyright}>
                © {currentYear} YU verse. All rights reserved.
              </Typography>
            </div>
            <div className={styles.socialLinks}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
                aria-label="GitHub"
              >
                <GithubIcon size={20} />
              </a>
              <a
                href="mailto:contact@example.com"
                className={styles.socialIcon}
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
