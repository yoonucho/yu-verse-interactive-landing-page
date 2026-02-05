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

    // 반짝임 효과: 사인파를 사용하여 부드럽게 밝아졌다 어두워짐
    const twinkle =
      Math.sin(state.clock.elapsedTime * twinkleSpeed + twinkleOffset) * 0.5 +
      0.5;
    const opacity = baseOpacity * (0.4 + twinkle * 0.6); // 40%~100% 사이로 변화

    if (meshRef.current.material instanceof THREE.MeshBasicMaterial) {
      meshRef.current.material.opacity = opacity;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={baseOpacity} />
    </mesh>
  );
}
