import logo from "../../assets/logo-w.webp";
import yoonuFull from "../../assets/yoonu-full.png";
import yoonuBack from "../../assets/yoonu-back.png";

/**
 * 프로젝트 내에서 사용하는 모든 정적 리소스 경로를 관리합니다.
 * public 폴더 내 파일은 하드코딩된 문자열 경로를 사용합니다.
 */
export const ASSETS = {
  IMAGES: {
    LOGO: logo,
    YOONU_FULL: yoonuFull,
    YOONU_BACK: yoonuBack,
  },
} as const;

export type AssetPath = string;
