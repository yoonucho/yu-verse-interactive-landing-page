import { useState, useEffect, useMemo } from "react";
import {
  Container,
  ASSETS,
  useActiveSection,
  throttle,
  Typography,
  Button,
  LINKS,
} from "../shared";
import { SquareArrowOutUpRight } from "lucide-react";
import styles from "./Header.module.css";

/**
 * Header 위젯 컴포넌트
 * 높이 117px, sticky 헤더
 */
export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);

  const throttledScroll = useMemo(
    () =>
      throttle(() => {
        setIsScrolled(window.scrollY > 50);
      }, 100),
    [],
  );

  useEffect(() => {
    window.addEventListener("scroll", throttledScroll);
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [throttledScroll]);

  // 가이드 액션 이벤트 리스너 (GNB 하이라이트)
  useEffect(() => {
    const handleGuideAction = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.action === "highlight_gnb") {
        setIsGlowing(true);
      } else {
        setIsGlowing(false);
      }
    };

    window.addEventListener("YU_VERSE_GUIDE_ACTION", handleGuideAction);
    return () => {
      window.removeEventListener("YU_VERSE_GUIDE_ACTION", handleGuideAction);
    };
  }, []);

  const handleCtaClick = () => {
    window.open(LINKS.CTA, "_blank", "noopener,noreferrer");
  };

  const navItems = [
    { label: "Origin", id: "origin" },
    { label: "Constellations", id: "projects" },
    { label: "Core Sources", id: "strengths" },
    { label: "Signal", id: "contact" },
  ];

  const activeSectionId = useActiveSection(navItems.map((item) => item.id));

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`${styles.header} ${isScrolled ? styles.scrolled : ""} ${isGlowing ? styles.glow : ""}`}
    >
      <Container>
        <div className={styles.headerInner}>
          {/* Logo */}
          <div className={styles.logo}>
            <a
              href="/"
              onClick={handleLogoClick}
              className={styles.logoLink}
              aria-label="YU Verse Home"
            >
              <img
                src={ASSETS.IMAGES.LOGO}
                alt="YU Verse"
                className={styles.logoImg}
              />
              <Typography variant="h1" className={styles.logoText}>
                YU verse
              </Typography>
            </a>
          </div>

          {/* Navigation */}
          <nav className={styles.nav} aria-label="Main Navigation">
            <ul className={styles.navList}>
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`${styles.navLink} ${activeSectionId === item.id ? styles.active : ""}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                  >
                    <Typography
                      variant="body"
                      as="span"
                      className={styles.navLinkLabel}
                    >
                      {item.label}
                    </Typography>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            <Button
              variant="brand"
              size="medium"
              onClick={handleCtaClick}
              className={`${styles.btnContact} gap-2`}
              aria-label="Let's Connect"
            >
              NOTION PORTFOLIO
              <SquareArrowOutUpRight size={16} strokeWidth={2} />
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
