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
  /** 다음 힌트 표시 여부 */
  showNextHint?: boolean;
}

export function Character({
  animationState,
  groupRef,
  dialogueText,
  onNext,
  showNextHint = true,
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
        onClick={() => {
          // 등장 완료 전이나 사라지는 중에는 클릭 무시
          if (animationState.hasEmerged && !animationState.isDisappearing) {
            onNext();
          }
        }}
      />

      <DialogueBubble
        text={dialogueText}
        visible={animationState.hasEmerged && !animationState.isDisappearing}
        position={[-2 + characterSize * 0.85, characterSize * 0.6, 0]}
        onClick={onNext}
        showNextHint={showNextHint}
      />
    </group>
  );
}
