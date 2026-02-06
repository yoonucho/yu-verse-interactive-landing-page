import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface UsePortalAnimationProps {
  layerIndex: number;
  baseZ: number;
  isExpanded: boolean;
}

interface AnimationRefs {
  rotation: { current: number };
  positionZ: { current: number };
  scale: { current: number };
}

/**
 * Portal 애니메이션 커스텀 훅
 * 통통 튀는 귀여운 팝업북 애니메이션 + 순차적 확장
 */
export function usePortalAnimation(
  meshRef: React.RefObject<THREE.Mesh | null>,
  { layerIndex, baseZ, isExpanded }: UsePortalAnimationProps,
) {
  // 애니메이션 상태를 저장하는 ref
  const animationRefs = useRef<AnimationRefs>({
    rotation: { current: 0 },
    positionZ: { current: baseZ },
    scale: { current: 1 },
  });

  // 순차적 시작 시간 제거 - 모두 동시에 부드럽게 확장
  const animationProgressRef = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // 부드러운 애니메이션 progress (0 → 1)
    if (isExpanded) {
      animationProgressRef.current = Math.min(
        animationProgressRef.current + delta * 1.2, // 속도 조절
        1,
      );
    } else {
      animationProgressRef.current = Math.max(
        animationProgressRef.current - delta * 2,
        0,
      );
    }

    // easeOutCubic으로 스무스한 확장
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const progress = easeOutCubic(animationProgressRef.current);

    // 펼쳐진 상태일 때의 목표값
    const targetRotation = layerIndex * 0.05 * progress; // 미세한 회전
    const targetZ = baseZ - layerIndex * 1.5 * progress; // Z축 확장
    const targetScale = 1 + (1.5 + layerIndex * 0.1) * progress; // 2배 이상 확대

    // 부드럽게 보간 (lerp)
    const lerpFactor = 0.1;
    animationRefs.current.rotation.current +=
      (targetRotation - animationRefs.current.rotation.current) * lerpFactor;
    animationRefs.current.positionZ.current +=
      (targetZ - animationRefs.current.positionZ.current) * lerpFactor;
    animationRefs.current.scale.current +=
      (targetScale - animationRefs.current.scale.current) * lerpFactor;

    // 메시에 적용
    meshRef.current.rotation.z = animationRefs.current.rotation.current;
    meshRef.current.position.z = animationRefs.current.positionZ.current;
    meshRef.current.scale.setScalar(animationRefs.current.scale.current);

    // 귀여운 idle 애니메이션 (펼쳐지지 않았을 때만)
    if (!isExpanded) {
      const bounce =
        Math.sin(state.clock.elapsedTime * 1.5 + layerIndex * 0.5) * 0.03;
      const float =
        Math.cos(state.clock.elapsedTime * 0.8 + layerIndex * 0.3) * 0.02;
      meshRef.current.position.y = bounce;
      meshRef.current.position.z =
        animationRefs.current.positionZ.current + float;
    }
  });
}
