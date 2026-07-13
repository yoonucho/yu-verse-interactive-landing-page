import { forwardRef } from "react";
import * as THREE from "three";

interface CharacterMeshProps {
  texture: THREE.Texture;
  size: number;
  imageAspect: number;
  onClick: () => void;
  onHoverChange?: (isHovered: boolean) => void;
}

export const CharacterMesh = forwardRef<THREE.Mesh, CharacterMeshProps>(
  ({ texture, size, imageAspect, onClick, onHoverChange }, ref) => {
    return (
      <mesh
        ref={ref}
        position={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
          onHoverChange?.(true);
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
          onHoverChange?.(false);
        }}
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
