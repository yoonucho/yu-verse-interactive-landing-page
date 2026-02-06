import { useState, useEffect, useMemo } from "react";
import {
  Container,
  ASSETS,
  useActiveSection,
  throttle,
  Typography,
  Button,
} from "../shared";
import styles from "./Header.module.css";

/**
 * Header 위젯 컴포넌트
 * 높이 117px, sticky 헤더
 */
export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

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

  const handleCtaClick = () => {
    alert("준비중입니다 🚀");
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
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
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
              className={styles.btnContact}
              aria-label="Let's Connect"
            >
              LET'S CONNECT
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
