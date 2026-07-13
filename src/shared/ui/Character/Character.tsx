import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CharacterMesh } from "./CharacterMesh";
import { CharacterGlow } from "./CharacterGlow";
import { CharacterShadow } from "./CharacterShadow";
import { DialogueBubble } from "./DialogueBubble";

export interface CharacterProps {
  /** 캐릭터 애니메이션 상태 */
  animationState: {
    meshRef: React.RefObject<THREE.Mesh | null>;
    glowRef: React.RefObject<THREE.Mesh | null>;
    shadowRef: React.RefObject<THREE.Mesh | null>;
    hasEmerged: boolean;
    texture: THREE.Texture;
    isDisappearing?: boolean;
  };
  /** 그룹 Ref (틸트용) */
  groupRef: React.RefObject<THREE.Group | null>;
  /** 대사 텍스트 */
  dialogueText: string;
  /** 다음 대사/상호작용 핸들러 */
  onNext: () => void;
  /** 캐릭터 등장 전 클릭 핸들러 */
  onInitialClick?: () => void;
  /** 캐릭터 호버 상태 전달 */
  onHoverChange?: (isHovered: boolean) => void;
  /** 다음 힌트 표시 여부 */
  showNextHint?: boolean;
  /** 다음 힌트 라벨 */
  nextHintLabel: string;
}

export function Character({
  animationState,
  groupRef,
  dialogueText,
  onNext,
  onInitialClick,
  onHoverChange,
  showNextHint = true,
  nextHintLabel,
}: CharacterProps) {
  const { viewport } = useThree();

  const characterSize = Math.min(viewport.width * 0.4, 8);
  const imageAspect = 500 / 631;

  return (
    <group ref={groupRef}>
      <CharacterShadow ref={animationState.shadowRef} size={characterSize} />
      <CharacterGlow
        ref={animationState.glowRef}
        texture={animationState.texture}
        size={characterSize}
        imageAspect={imageAspect}
      />
      <CharacterMesh
        ref={animationState.meshRef}
        texture={animationState.texture}
        size={characterSize}
        imageAspect={imageAspect}
        onHoverChange={onHoverChange}
        onClick={() => {
          if (animationState.hasEmerged && !animationState.isDisappearing) {
            onNext();
          } else if (!animationState.hasEmerged) {
            onInitialClick?.();
          }
        }}
      />

      <DialogueBubble
        text={dialogueText}
        visible={animationState.hasEmerged && !animationState.isDisappearing}
        position={[-2 + characterSize * 0.85, characterSize * 0.6, 0]}
        onClick={onNext}
        showNextHint={showNextHint}
        nextHintLabel={nextHintLabel}
      />
    </group>
  );
}
