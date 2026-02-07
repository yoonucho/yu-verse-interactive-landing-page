# YU Verse | Interactive Portfolio Landing

따뜻한 기술로 사람과 디지털을 잇는 인터랙티브 포트폴리오 랜딩 페이지입니다.
React Three Fiber를 활용한 3D 경험과 감성적 UX로 만드는 YU Verse의 세계.

## Demo

https://gist.github.com/user-attachments/assets/71da8970-4a1e-43c4-8e8d-4ac59e3c7ca3

## Quick Start

```bash
# 의존성 설치
npm install

# 로컬 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 주요 기능

- **Paper Portal & Character Guide**: 3D 포털 속 캐릭터 가이드가 대화형으로 사이트를 안내하는 인터랙션.
- **3D Flip Cards**: Projects 섹션의 3D 뒤집기 카드로 프로젝트를 소개.
- **Interactive Molecule Visualization**: Strengths 섹션에서 구체 클릭 시 해당 카드로 연결되는 3D 시각화.
- **FSD Architecture**: Feature-Sliced Design 패턴을 적용한 확장성과 유지보수성을 고려한 구조.
- **Lazy Loading & Performance**: Projects, Footer의 지연 로딩과 WebGL 컨텍스트 최적화.
- **A11y (Accessibility)**: WAI-ARIA 표준을 준수하는 시맨틱한 웹 접근성.

## 섹션 구성

| 섹션      | Nav Label      | 설명                                             |
| --------- | -------------- | ------------------------------------------------ |
| Hero      | Origin         | 헤드라인 + Paper Portal 3D 캐릭터 가이드         |
| Projects  | Constellations | 5개 프로젝트 3D 플립 카드                        |
| Strengths | Core Sources   | "The 5 Sources of Warmth" 인터랙티브 강점 시각화 |
| Footer    | Signal         | CTA + 소셜 링크 (GitHub, Email)                  |

## Project Structure (FSD)

```text
src/
 ├── App.tsx                    # 메인 앱 컴포넌트
 ├── main.tsx                   # 엔트리 포인트
 ├── index.css                  # 글로벌 스타일
 │
 ├── widgets/                   # 독립적인 비즈니스 블록
 │    ├── Header.tsx            # 스티키 네비게이션 헤더
 │    ├── Hero/
 │    │    └── Hero.tsx         # Hero 섹션 (헤드라인 + 3D 포털)
 │    ├── PaperPortal/          # 3D 포털 + 캐릭터 가이드 시스템
 │    │    ├── PaperPortal.tsx  # 포털 메인 컴포넌트
 │    │    ├── PortalScene.tsx  # 씬 관리
 │    │    ├── PortalCharacter.tsx # 캐릭터 로직
 │    │    ├── PaperLayer.tsx   # 종이 레이어 애니메이션
 │    │    ├── Star.tsx         # 별 파티클
 │    │    └── usePortalAnimation.ts # 애니메이션 훅
 │    ├── Projects.tsx          # 프로젝트 3D 플립 카드 섹션
 │    ├── ProjectCard.tsx       # 개별 프로젝트 카드
 │    ├── Strengths.tsx         # 강점 인터랙티브 시각화 섹션
 │    ├── Footer.tsx            # CTA + 소셜 링크 푸터
 │    └── SectionSkeleton.tsx   # 지연 로딩 스켈레톤
 │
 ├── shared/                    # 공통 재사용 요소
 │    ├── ui/
 │    │    ├── Section.tsx      # 섹션 래퍼 (variant, spacing)
 │    │    ├── Container.tsx    # 최대 너비 컨테이너
 │    │    ├── Typography.tsx   # 타이포그래피 컴포넌트
 │    │    ├── Button.tsx       # 버튼 컴포넌트
 │    │    ├── Card.tsx         # 카드 래퍼
 │    │    ├── ScrollToTop.tsx  # 스크롤 투 탑 버튼
 │    │    ├── Skeleton.tsx     # 로딩 스켈레톤 UI
 │    │    ├── Character/       # 캐릭터 시스템
 │    │    │    ├── Character.tsx
 │    │    │    ├── CharacterMesh.tsx
 │    │    │    ├── CharacterGlow.tsx
 │    │    │    ├── CharacterShadow.tsx
 │    │    │    └── DialogueBubble.tsx  # 말풍선 (타이핑 애니메이션)
 │    │    ├── VisualScene/     # 3D 분자 시각화
 │    │    │    ├── VisualScene.tsx
 │    │    │    ├── Molecule.tsx
 │    │    │    └── ThreeErrorBoundary.tsx
 │    │    └── guide.json       # 캐릭터 대화 데이터
 │    ├── hooks/                # 공통 훅
 │    │    ├── useActiveSection.ts
 │    │    ├── useCharacterAnimation.ts
 │    │    ├── useCharacterTilt.ts
 │    │    ├── useDialogueState.ts
 │    │    ├── useInView.ts
 │    │    └── useWheelScale.ts
 │    ├── lib/                  # 범용 유틸리티
 │    │    ├── throttle.ts
 │    │    └── utils.ts
 │    └── constants/            # 상수 및 설정
 │         ├── assets.ts        # 자산 경로
 │         ├── design-system.ts # 디자인 시스템 토큰
 │         ├── links.ts         # 외부 링크
 │         └── physics.ts       # 3D 물리 상수
 │
 └── assets/                    # 정적 이미지 및 캐릭터 자산
```

## Tech Stack

- **Framework**: React 19 + TypeScript
- **3D**: React Three Fiber, Drei, Postprocessing
- **Build**: Vite
- **Styling**: TailwindCSS, Shacdn UI, CSS Modules,
