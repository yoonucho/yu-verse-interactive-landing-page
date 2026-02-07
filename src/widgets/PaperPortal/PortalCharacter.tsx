import {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useCallback,
} from "react";
import * as THREE from "three";
import { Character } from "../../shared/ui/Character/Character";
import { useCharacterAnimation } from "../../shared/hooks/useCharacterAnimation";
import { useCharacterTilt } from "../../shared/hooks/useCharacterTilt";
import { useDialogueState } from "../../shared/hooks/useDialogueState";
import { throttle } from "../../shared/lib";
import guideData from "../../shared/ui/guide.json";

interface PortalCharacterProps {
  isExpanded: boolean;
  isClosing?: boolean;
  onClose?: () => void;
}

export interface PortalCharacterHandle {
  sayGoodbye: () => void;
}

export const PortalCharacter = forwardRef<
  PortalCharacterHandle,
  PortalCharacterProps
>(({ isExpanded, isClosing, onClose }, ref) => {
  const groupRef = useRef<THREE.Group>(null);

  /** goodbye 시퀀스 진행 중 잠금 (클릭 충돌 방지) */
  const isGoodbyeSequenceRef = useRef(false);

  // 1. 애니메이션 Hook
  const {
    meshRef,
    glowRef,
    shadowRef,
    hasEmerged,
    triggerJump,
    triggerMotion,
    texture,
    isDisappearing,
  } = useCharacterAnimation({ isExpanded });

  // 2. 틸트 Hook
  useCharacterTilt({
    groupRef,
    isActive: hasEmerged && !isDisappearing, // 사라지는 중이면 틸트 비활성화
  });

  // 3. 대사 Hook
  const { currentDialogue, nextDialogue, jumpToId, setDialogueIndex } =
    useDialogueState({
      dialogues: guideData.dialogues,
    });

  // 포털이 열릴 때 대사 초기화 및 goodbye 잠금 해제
  useEffect(() => {
    if (isExpanded) {
      setDialogueIndex(0);
      isGoodbyeSequenceRef.current = false; // 새로 열릴 때 잠금 해제
    }
  }, [isExpanded, setDialogueIndex]);

  // 외부에서 호출 가능한 메서드 노출
  useImperativeHandle(ref, () => ({
    sayGoodbye: () => {
      // 이미 goodbye 시퀀스 진행 중이면 무시
      if (isGoodbyeSequenceRef.current) return;
      // 이미 굿바이 상태면 무시
      if (currentDialogue.id === "goodbye") return;

      isGoodbyeSequenceRef.current = true; // 잠금 활성화
      jumpToId("goodbye");
      triggerMotion("nod"); // 작별 인사 제스처
    },
  }));

  // 대사 변경 시 효과 트리거
  useEffect(() => {
    if (!hasEmerged) return;

    // 0. 종료 액션 처리
    if (currentDialogue.action === "close_portal") {
      const timer = setTimeout(() => {
        onClose?.();
      }, 1500);
      return () => clearTimeout(timer);
    }

    // 1. GNB 하이라이트 이벤트
    if (currentDialogue.action) {
      window.dispatchEvent(
        new CustomEvent("YU_VERSE_GUIDE_ACTION", {
          detail: { action: currentDialogue.action },
        }),
      );
    } else {
      window.dispatchEvent(
        new CustomEvent("YU_VERSE_GUIDE_ACTION", {
          detail: { action: null },
        }),
      );
    }

    // 2. 캐릭터 모션
    if (currentDialogue.motion) {
      triggerMotion(currentDialogue.motion);
    }
  }, [currentDialogue, hasEmerged, triggerMotion, onClose]);

  // 핸들러 코어: goodbye 시퀀스 중이거나 닫힘 중에는 대사 진행 불가
  const handleInteractionCore = useCallback(() => {
    if (isClosing) return; // 닫힘 중 클릭 무시
    if (isGoodbyeSequenceRef.current) return; // goodbye 중 클릭 무시
    triggerJump();
    nextDialogue();
  }, [isClosing, triggerJump, nextDialogue]);

  // throttle 적용된 인터랙션 핸들러 (300ms 간격 제한)
  const handleInteraction = useMemo(
    () => throttle(handleInteractionCore, 300),
    [handleInteractionCore],
  );

  const animationState = {
    meshRef,
    glowRef,
    shadowRef,
    hasEmerged,
    texture,
    isDisappearing,
  };

  return (
    <Character
      animationState={animationState}
      groupRef={groupRef}
      dialogueText={currentDialogue.text}
      onNext={handleInteraction}
      showNextHint={currentDialogue.id !== "goodbye"}
    />
  );
});
