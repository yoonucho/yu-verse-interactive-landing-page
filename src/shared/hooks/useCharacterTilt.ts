import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface UseCharacterTiltProps {
  groupRef: React.RefObject<THREE.Group | null>;
  isActive: boolean;
  maxTilt?: number;
}

export function useCharacterTilt({
  groupRef,
  isActive,
  maxTilt = 0.15,
}: UseCharacterTiltProps) {
  const tiltRef = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!groupRef.current) return;

    // 사라지는 중이거나 비활성 상태일 때는 틸트를 서서히 0으로
    if (!isActive) {
      tiltRef.current.x = THREE.MathUtils.lerp(tiltRef.current.x, 0, 0.1);
      tiltRef.current.y = THREE.MathUtils.lerp(tiltRef.current.y, 0, 0.1);
    } else {
      // 나타난 상태일 때만 마우스 따라가기
      const targetTiltX = -state.mouse.y * maxTilt;
      const targetTiltY = state.mouse.x * maxTilt;

      // 부드럽게 보간 (lerp factor: 0.05 = 매우 부드러움)
      tiltRef.current.x = THREE.MathUtils.lerp(
        tiltRef.current.x,
        targetTiltX,
        0.05,
      );
      tiltRef.current.y = THREE.MathUtils.lerp(
        tiltRef.current.y,
        targetTiltY,
        0.05,
      );
    }

    // 그룹에 틸트 적용 (기존 개별 회전은 유지)
    groupRef.current.rotation.x = tiltRef.current.x;
    groupRef.current.rotation.y = tiltRef.current.y;
  });
}
