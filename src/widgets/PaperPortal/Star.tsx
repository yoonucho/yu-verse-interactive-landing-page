import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface StarProps {
  position: [number, number, number];
  size: number;
  color: string;
  baseOpacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

export function Star({
  position,
  size,
  color,
  baseOpacity,
  twinkleSpeed,
  twinkleOffset,
}: StarProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    // 강력한 반짝임 효과: 거의 꺼졌다가 완전히 켜지는 느낌
    const twinkle =
      Math.sin(state.clock.elapsedTime * twinkleSpeed + twinkleOffset) * 0.5 +
      0.5;
    const opacity = baseOpacity * (0.1 + twinkle * 0.9); // 10%~100% 사이로 큰 변화

    // 크기도 함께 변화시켜 더 생동감 있게
    const scale = 1 + twinkle * 0.3; // 1.0~1.3배 크기 변화

    if (meshRef.current.material instanceof THREE.MeshBasicMaterial) {
      meshRef.current.material.opacity = opacity;
    }
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={baseOpacity} />
    </mesh>
  );
}
