import { forwardRef } from "react";
import * as THREE from "three";

interface CharacterShadowProps {
  size: number;
}

export const CharacterShadow = forwardRef<THREE.Mesh, CharacterShadowProps>(
  ({ size }, ref) => {
    return (
      <mesh
        ref={ref}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -5.5, -0.5]}
      >
        <circleGeometry args={[size * 0.3, 32]} />
        <meshBasicMaterial
          color="#000000"
          transparent={true}
          opacity={0}
          depthWrite={false}
        />
      </mesh>
    );
  },
);
