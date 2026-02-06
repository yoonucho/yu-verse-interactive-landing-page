/**
 * 물리 시뮬레이션 및 레이아웃 관련 상수 모음
 */
export const PHYSICS = {
  // 중력 가속도
  GRAVITY: 60,

  // 경계값 (Molecule 기반)
  BOUNDS: {
    LIMIT_X: 3.5,
    LIMIT_Y: 3.5,
    FLOOR_Y: -4,
  },

  // 충돌 계수 (에너지 보존 비율)
  REBOUND: {
    FLOOR: -0.3,
    WALL: -0.4,
  },

  // 애니메이션 보간 속도 (lerp)
  LERP: {
    HOVER: 0.15,
    GRAB: 0.15,
    RETURN_FAST: 0.04,
    RETURN_SLOW: 0.02,
    RESET: 0.08,
  },

  // 마우스/드래그 관련
  GRAB: {
    POWER_MIN: 8,
    POWER_MAX: 20,
    POWER_MULTIPLIER: 3.5,
    DISTANCE_THRESHOLD: 0.05,
  },
} as const;

export const HERO_SCENE = {
  SCROLL_THRESHOLD: 50,
  ROTATION_SPEED: 0.5,
  NORMAL_ROTATION_SPEED: 0.2,
  LERP_SPEED: 0.1,
  TILT_SPEED: 0.05,
} as const;
