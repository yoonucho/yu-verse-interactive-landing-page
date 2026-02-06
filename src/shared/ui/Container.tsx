import { ReactNode } from "react";
import styles from "./Container.module.css";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * 컨텐츠 최대 너비를 제한하고 중앙 정렬하는 컨테이너 컴포넌트
 * YU Verse 디자인: max-width 1574px, 좌우 패딩 100px
 */
export function Container({ children, className = "" }: ContainerProps) {
  return <div className={`${styles.container} ${className}`}>{children}</div>;
}
