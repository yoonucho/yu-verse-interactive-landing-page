// YU Verse Design System Constants

export const LAYOUT_CONSTANTS = {
  // 컨테이너 너비
  CONTAINER_MAX_WIDTH: 1574, // px
  CONTAINER_PADDING_X: 100, // px

  // 섹션 간격
  SECTION_SPACING_SM: 100, // px
  SECTION_SPACING_MD: 120, // px
  SECTION_SPACING_LG: 150, // px

  // 헤더
  HEADER_HEIGHT: 117, // px
  HEADER_HEIGHT_REM: 7.3125, // rem (117px / 16)
  LOGO_HEIGHT_DESKTOP: 1.8, // rem
  LOGO_HEIGHT_MOBILE: 1.5, // rem
  LOGO_TEXT_SIZE: 1.0, // rem

  // 푸터
  FOOTER_LOGO_HEIGHT: 2.0, // rem (32px / 16)
  SIGNAL_SECTION_MIN_HEIGHT: 31.25, // rem (500px / 16)
} as const;

export const COLORS = {
  NAVY_DARK: "#12122D",
  NAVY_DARKER: "#080816",
  PURPLE_ACCENT: "#53469C",
  LAVENDER_ACCENT: "#D4D0FF",
  WHITE: "#FFFFFF",
} as const;

export const TYPOGRAPHY = {
  FONT_FAMILY:
    'Lato, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',

  // Font sizes (rem 기준, 1rem = 16px)
  FONT_SIZE_XS: 0.75, // 12px (12/16)
  FONT_SIZE_SM: 0.875, // 14px (14/16)
  FONT_SIZE_BASE: 1.125, // 18px (18/16)
  FONT_SIZE_MD: 1.25, // 20px (20/16) - 섹션 서브타이틀
  FONT_SIZE_LG: 1.5, // 24px (24/16)
  FONT_SIZE_XL: 1.875, // 30px (30/16)
  FONT_SIZE_2XL: 3.0, // 48px (48/16)

  // Font weights
  FONT_WEIGHT_LIGHT: 300,
  FONT_WEIGHT_REGULAR: 400,
  FONT_WEIGHT_BOLD: 700,
  FONT_WEIGHT_BLACK: 900,
} as const;

export const BORDER_RADIUS = {
  SM: 0.5, // 8px (8/16)
  MD: 1.25, // 20px (20/16)
  LG: 2.5, // 40px (40/16)
} as const;
