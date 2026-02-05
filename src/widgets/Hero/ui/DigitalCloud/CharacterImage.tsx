import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

interface CharacterImageProps {
  opacity: number; // 0-1 for cross-fade
}

/**
 * 2D Character Image Component
 * Displays a PNG image as a plane in 3D space
 * Supports opacity for smooth cross-fade transitions
 */
export function CharacterImage({ opacity }: CharacterImageProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Load texture from public folder
  const texture = useLoader(THREE.TextureLoader, "/character-particles.png");

  // Optional: Add subtle floating animation
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating motion
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;

      // Subtle scale pulse
      const scale = 1.0 + Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[8, 8]} />
      <meshBasicMaterial
        map={texture}
        transparent={true}
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}
