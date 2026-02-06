import { forwardRef } from "react";
import * as THREE from "three";

interface CharacterGlowProps {
  texture: THREE.Texture;
  size: number;
  imageAspect: number;
}

export const CharacterGlow = forwardRef<THREE.Mesh, CharacterGlowProps>(
  ({ texture, size, imageAspect }, ref) => {
    return (
      <mesh ref={ref} scale={[1.04, 1.04, 1]} position={[0, 0, 0]}>
        <planeGeometry args={[size, size / imageAspect]} />
        <meshBasicMaterial
          map={texture}
          transparent={true}
          color={new THREE.Color("#FF10F0").multiplyScalar(3.5)}
          toneMapped={false}
          opacity={0}
          alphaTest={0.38}
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    );
  },
);
