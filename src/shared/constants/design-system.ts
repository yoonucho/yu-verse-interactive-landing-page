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
} as const;

export const COLORS = {
  NAVY_DARK: "#12122D",
  PURPLE_ACCENT: "#53469C",
  WHITE: "#FFFFFF",
} as const;

export const TYPOGRAPHY = {
  FONT_FAMILY:
    'Lato, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',

  // Font sizes (rem 기준, 1rem = 10px)
  FONT_SIZE_XS: 1.2, // 12px
  FONT_SIZE_SM: 1.4, // 14px
  FONT_SIZE_BASE: 1.8, // 18px
  FONT_SIZE_LG: 2.4, // 24px
  FONT_SIZE_XL: 3.0, // 30px
  FONT_SIZE_2XL: 4.8, // 48px (H2)

  // Font weights
  FONT_WEIGHT_LIGHT: 300,
  FONT_WEIGHT_REGULAR: 400,
  FONT_WEIGHT_BOLD: 700,
  FONT_WEIGHT_BLACK: 900,
} as const;

export const BORDER_RADIUS = {
  SM: 0.8, // rem
  MD: 2.0, // rem
  LG: 4.0, // rem (버튼용)
} as const;
