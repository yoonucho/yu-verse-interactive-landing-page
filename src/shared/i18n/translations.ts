export type Locale = "ko" | "en";

export interface GuideDialogue {
  id: string;
  text: string;
  action?: string;
  motion?: string;
}

const PROJECT_NAMES = {
  dopaminetto: "Dopaminetto",
} as const;

export const translations = {
  ko: {
    language: {
      current: "한국어",
      toggleLabel: "언어 변경",
      menuLabel: "Language",
      ko: "KO",
      en: "EN",
    },
    header: {
      homeLabel: "YU Verse 홈",
      mainNavigationLabel: "주요 내비게이션",
      mobileNavigationLabel: "모바일 내비게이션",
      connectLabel: "연결하기",
      cta: "NOTION PORTFOLIO",
      openMenu: "메뉴 열기",
      closeMenu: "메뉴 닫기",
      nav: {
        origin: "Origin",
        projects: "Constellations",
        strengths: "Core Sources",
        contact: "Signal",
      },
    },
    hero: {
      title: "인터랙션으로 경험을 설계합니다",
      subtitle:
        "사용자가 이해하기 쉽고 자연스럽게 반응하는 웹 경험을 만듭니다. 3D 인터랙션, UI 구조, AI 협업을 활용해 아이디어를 실제 화면으로 구현합니다.",
    },
    projects: {
      title: "주요 프로젝트",
      subtitle: "문제 해결과 사용자 경험을 중심으로 진행한 작업들",
      viewDetails: "VIEW DETAILS",
      cardAriaLabel: "프로젝트 카드",
      items: [
        {
          title: "청소년 자살 예방 캠페인",
          subtitle: "Nuxt3 Migration",
          description:
            "Nuxt3 전환과 UX 개선으로 캠페인 운영 흐름을 개선했습니다.",
        },
        {
          title: "디지털 시민 교육 · 디지털 환경 교육",
          subtitle: "Learning Content",
          description:
            "퀴즈 템플릿과 참여형 학습 UI로 수업 경험을 확장했습니다.",
        },
        {
          title: "미술품 공동구매 플랫폼",
          subtitle: "Responsive UX",
          description:
            "미술품 공동구매 플랫폼의 반응형 UI와 3D 카드 인터랙션을 구현했습니다.",
        },
        {
          title: "YU 캘린더",
          subtitle: "Calendar UI",
          description:
            "공휴일 API와 FullCalendar 기반 일정 관리 UI를 구현했습니다.",
        },
        {
          title: PROJECT_NAMES.dopaminetto,
          subtitle: "Community MVP",
          description:
            "실시간 위치 동기화, 채팅, 음성 방송을 갖춘 커뮤니티 MVP를 만들었습니다.",
        },
      ],
    },
    strengths: {
      title: "5가지 강점",
      subtitle: "프로젝트에서 발휘하는 강점을 정리했습니다.",
      cta: "VIEW CORE SOURCES",
      items: [
        {
          title: "연결성",
          description:
            "사람, 일정, 기능의 흐름을 함께 보고 필요한 지점을 연결합니다.",
        },
        {
          title: "책임",
          description:
            "맡은 범위를 명확히 이해하고 끝까지 실행하는 것을 중요하게 생각합니다.",
        },
        {
          title: "공감",
          description:
            "사용자의 상황과 감정을 고려해 부담 없이 사용할 수 있는 경험을 설계합니다.",
        },
        {
          title: "신념",
          description: "기술 선택보다 사용자의 문제와 맥락을 먼저 확인합니다.",
        },
        {
          title: "사고",
          description:
            "왜 그렇게 만들어야 하는지 먼저 정리하고, 유지보수 가능한 구조로 구현합니다.",
        },
      ],
    },
    footer: {
      title: "Signal",
      subtitle:
        "프로젝트별 상세 과정과 성과는 노션 포트폴리오에서 확인할 수 있습니다.",
      cta: "NOTION PORTFOLIO",
    },
    portal: {
      openHint: "Click me",
      closeChat: "대화 닫기",
      closeChatAria: "채팅 종료",
    },
    dialogue: {
      nextHint: "다음",
    },
    scrollToTop: {
      ariaLabel: "맨 위로 이동",
    },
    guide: {
      mascotName: "YU Verse 가이드",
      dialogues: [
        {
          id: "welcome",
          text: "안녕하세요! 이 포트폴리오를 간단히 안내해드릴게요. 😊",
        },
        {
          id: "gnb_guide",
          text: "상단 메뉴에서 주요 섹션으로 바로 이동할 수 있어요. <span class='highlight'>Constellations</span>는 프로젝트, <span class='highlight'>Core Sources</span>는 일하는 방식, <span class='highlight'>Signal</span>은 연락 섹션입니다.",
          action: "highlight_gnb",
          motion: "look_up",
        },
        {
          id: "humanity",
          text: "이 페이지는 3D 인터랙션과 프로젝트 소개를 함께 보여주기 위해 만들었습니다. 천천히 둘러보세요.",
          motion: "nod",
        },
        {
          id: "start",
          text: "메뉴를 클릭하거나 아래로 스크롤해서 내용을 확인해보세요. 🌌✨",
          motion: "nod",
        },
        {
          id: "goodbye",
          text: "또 만나요! 👋",
          action: "close_portal",
        },
      ],
    },
  },
  en: {
    language: {
      current: "English",
      toggleLabel: "Change language",
      menuLabel: "Language",
      ko: "KO",
      en: "EN",
    },
    header: {
      homeLabel: "YU Verse Home",
      mainNavigationLabel: "Main Navigation",
      mobileNavigationLabel: "Mobile Navigation",
      connectLabel: "Let's Connect",
      cta: "NOTION PORTFOLIO",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      nav: {
        origin: "Origin",
        projects: "Constellations",
        strengths: "Core Sources",
        contact: "Signal",
      },
    },
    hero: {
      title: "Finding Warmth in the Digital Universe",
      subtitle:
        "I build interactive web experiences that make complex ideas easier to understand and use. With React, Three.js, and AI-assisted workflows, I turn early ideas into responsive, working interfaces.",
    },
    projects: {
      title: "Selected Constellations of Value",
      subtitle:
        "Selected work across platform migration, interactive learning, responsive UI, calendar systems, and real-time community experiences.",
      viewDetails: "VIEW DETAILS",
      cardAriaLabel: "project card",
      items: [
        {
          title: "Youth Suicide Prevention Campaign",
          subtitle: "Nuxt3 Migration",
          description:
            "Migrated a youth suicide prevention campaign to Nuxt 3 and refined key UX flows for more reliable campaign operations.",
        },
        {
          title: "Digital Citizenship & Environmental Education",
          subtitle: "Learning Content",
          description:
            "Created reusable quiz templates and participatory learning UI for digital citizenship and environmental education.",
        },
        {
          title: "Art Co-ownership Platform",
          subtitle: "Responsive UX",
          description:
            "Implemented responsive interfaces and 3D card interactions for an art co-ownership platform.",
        },
        {
          title: "YU Calendar",
          subtitle: "Calendar UI",
          description:
            "Built a scheduling interface with public holiday API integration and FullCalendar.",
        },
        {
          title: PROJECT_NAMES.dopaminetto,
          subtitle: "Community MVP",
          description:
            "Built a community MVP with real-time presence, chat, and voice broadcasting.",
        },
      ],
    },
    strengths: {
      title: "The 5 Sources of Warmth",
      subtitle:
        "Five strengths I apply when defining problems, collaborating, and building maintainable interfaces.",
      cta: "VIEW CORE SOURCES",
      items: [
        {
          title: "Connectedness",
          description:
            "I map relationships between people, schedules, and features to keep work moving as one coherent flow.",
        },
        {
          title: "Responsibility",
          description:
            "I clarify what I own, follow through on decisions, and carry implementation to completion.",
        },
        {
          title: "Empathy",
          description:
            "I consider the user's situation and emotional load when shaping interactions and content.",
        },
        {
          title: "Belief",
          description:
            "I evaluate technology through the user's problem and context before choosing an implementation.",
        },
        {
          title: "Intellection",
          description:
            "I clarify why a solution should exist, then structure it so the next change remains manageable.",
        },
      ],
    },
    footer: {
      title: "Signal",
      subtitle:
        "For detailed process notes and project outcomes, visit my Notion portfolio.",
      cta: "NOTION PORTFOLIO",
    },
    portal: {
      openHint: "Click me",
      closeChat: "Close Chat",
      closeChatAria: "Close chat",
    },
    dialogue: {
      nextHint: "Click Next",
    },
    scrollToTop: {
      ariaLabel: "Scroll to top",
    },
    guide: {
      mascotName: "YU Verse Guide",
      dialogues: [
        {
          id: "welcome",
          text: "Welcome! I'll give you a quick tour of this portfolio. 👋",
        },
        {
          id: "gnb_guide",
          text: "Use the top navigation to jump between sections. <span class='highlight'>Constellations</span> covers projects, <span class='highlight'>Core Sources</span> explains how I work, and <span class='highlight'>Signal</span> links to detailed work.",
          action: "highlight_gnb",
          motion: "look_up",
        },
        {
          id: "humanity",
          text: "This site combines 3D interaction with a concise overview of my work. Take your time and explore.",
          motion: "nod",
        },
        {
          id: "start",
          text: "Choose a section from the menu or scroll to continue. ✨",
          motion: "nod",
        },
        {
          id: "goodbye",
          text: "Thanks for visiting. 👋",
          action: "close_portal",
        },
      ],
    },
  },
} as const;

export type Translation = (typeof translations)[Locale];
