import { Html } from "@react-three/drei";
import { useEffect, useState } from "react";
import styles from "./DialogueBubble.module.css";

interface DialogueBubbleProps {
  /** 대사 텍스트 (HTML 포함 가능) */
  text: string;
  /** 표시 여부 */
  visible: boolean;
  /** 말풍선 위치 (Character 위쪽) */
  position?: [number, number, number];
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 다음 대사 힌트 표시 여부 */
  showNextHint?: boolean;
}

/**
 * 3D 캐릭터 머리 위에 띄울 2D 말풍선 컴포넌트
 * - HTML 태그를 인식하는 타이핑 애니메이션 포함
 */
export function DialogueBubble({
  text,
  visible,
  position = [0, 8, 0],
  onClick,
  showNextHint = true,
}: DialogueBubbleProps) {
  const [displayedText, setDisplayedText] = useState("");
  const typingSpeed = 30; // ms per char

  // 타이핑 애니메이션 로직
  useEffect(() => {
    if (!visible) {
      setDisplayedText("");
      return;
    }

    setDisplayedText("");
    let isCancelled = false;

    // HTML 태그와 일반 텍스트를 분리하는 정규식
    // <...> 태그 OR 일반 텍스트
    const regex = /(<[^>]*>)|([^<]+)/g;
    const tokens = text.match(regex) || [];

    let currentString = "";
    let tokenIndex = 0;
    let charIndex = 0;

    const typeNext = () => {
      if (isCancelled) return;
      if (tokenIndex >= tokens.length) return;

      const token = tokens[tokenIndex];
      const isTag = token.startsWith("<");

      if (isTag) {
        // 태그는 한 번에 추가
        currentString += token;
        setDisplayedText(currentString);
        tokenIndex++;
        // 태그 추가 후 바로 다음 토큰 처리 (딜레이 없음)
        requestAnimationFrame(typeNext);
      } else {
        // 텍스트는 한 글자씩 추가
        currentString += token[charIndex];
        setDisplayedText(currentString);
        charIndex++;

        if (charIndex >= token.length) {
          tokenIndex++;
          charIndex = 0;
        }

        setTimeout(typeNext, typingSpeed);
      }
    };

    // 애니메이션 시작
    typeNext();

    return () => {
      isCancelled = true;
    };
  }, [text, visible]);

  if (!visible) return null;

  return (
    <Html
      position={position}
      center
      style={{ pointerEvents: "none" }}
      portal={{ current: document.body }} // 캔버스 밖으로 렌더링 (잘림 방지)
      zIndexRange={[100, 0]}
    >
      <div
        className={styles.bubble}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        style={{ zIndex: 1000, cursor: "pointer", pointerEvents: "auto" }}
      >
        {/* HTML 태그 렌더링을 위해 dangerouslySetInnerHTML 사용 */}
        <div dangerouslySetInnerHTML={{ __html: displayedText }} />

        {/* 텍스트가 모두 출력되었을 때만 힌트 표시 (선택사항) */}
        {showNextHint &&
          displayedText.replace(/<[^>]*>/g, "").length ===
            text.replace(/<[^>]*>/g, "").length && (
            <div className={styles.nextHint}>Click Next ➔</div>
          )}
      </div>
    </Html>
  );
}
