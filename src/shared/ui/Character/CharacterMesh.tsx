import { forwardRef } from "react";
import * as THREE from "three";

interface CharacterMeshProps {
  texture: THREE.Texture;
  size: number;
  imageAspect: number;
  onClick: () => void;
}

export const CharacterMesh = forwardRef<THREE.Mesh, CharacterMeshProps>(
  ({ texture, size, imageAspect, onClick }, ref) => {
    return (
      <mesh
        ref={ref}
        position={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        <planeGeometry args={[size, size / imageAspect]} />
        <meshBasicMaterial
          map={texture}
          transparent={true}
          alphaTest={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
    );
  },
);
