import { PortalScene } from "./PortalScene";
import styles from "./PaperPortal.module.css";

/**
 * Paper Cutting Portal
 * Hero 섹션 우측에 배치되는 5층 레이어 포털
 */
export function PaperPortal() {
  return (
    <div className={styles.portalContainer} aria-hidden="true">
      <PortalScene />
    </div>
  );
}
