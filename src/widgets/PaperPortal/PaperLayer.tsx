import { useRef, useMemo, useState } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { usePortalAnimation } from "./usePortalAnimation";

interface PaperLayerProps {
  layerIndex: number;
  baseZ: number;
  color: string;
  scale: number;
  rotation: number;
  onExpand?: () => void;
}

export function PaperLayer({
  layerIndex,
  baseZ,
  color,
  onExpand,
}: PaperLayerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const { viewport } = useThree();

  // 그룹 전체(종이+네온)에 애니메이션 적용
  usePortalAnimation(groupRef as any, { layerIndex, baseZ, isExpanded });

  // 1. 입체 종이 및 네온 테두리 생성 (한 번에 계산!)
  const { paperGeo, neonGeo, thickness } = useMemo(() => {
    const w = Math.min(viewport.width, 20);
    const h = Math.min(viewport.height, 20);
    const shape = new THREE.Shape();

    // 외곽 사각형
    shape.moveTo(-w / 2, -h / 2);
    shape.lineTo(w / 2, -h / 2);
    shape.lineTo(w / 2, h / 2);
    shape.lineTo(-w / 2, h / 2);
    shape.closePath();

    // 별 구멍
    const holeRadius = Math.min(w, h) * 0.15 + layerIndex * 0.2;
    const hole = createRoundedStar(holeRadius, 5, 0.4);
    shape.holes.push(hole);

    // [두께 설정] 변수를 따로 빼지 않고 여기서 바로 정의해요!
    const depth = 0.4; // 종이 두께
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: depth,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 3,
    });

    // 네온 테두리 (구멍보다 아주 살짝 크게 만든 띠)
    const neonShape = createRoundedStar(holeRadius + 0.05, 5, 0.4);
    const innerHole = createRoundedStar(holeRadius - 0.05, 5, 0.4);
    neonShape.holes.push(innerHole);
    const nGeo = new THREE.ShapeGeometry(neonShape);

    return { paperGeo: geo, neonGeo: nGeo, thickness: depth };
  }, [layerIndex, viewport]);

  return (
    <group ref={groupRef}>
      {/* 1. 메인 파스텔 종이 */}
      <mesh
        geometry={paperGeo}
        onClick={() => {
          setIsExpanded(true);
          onExpand?.();
        }}
        onPointerEnter={() => (document.body.style.cursor = "pointer")}
        onPointerLeave={() => (document.body.style.cursor = "auto")}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={color}
          roughness={1.0}
          metalness={0}
          // [수정] 종이 자체가 빛나지 않게 하여 파스텔 색감을 복구합니다.
          emissive={new THREE.Color(color)}
          emissiveIntensity={0.01}
          transparent
        />
      </mesh>

      {/* [2] 별 모양 네온 테두리 (클릭 후에만) */}
      {isExpanded && (
        <mesh
          geometry={neonGeo}
          position={[0, 0, thickness / 2 + 0.01]} // 종이 두께만큼 앞으로 배치
        >
          <meshBasicMaterial
            // [수정] 강도를 20에서 5로 낮추어 화이트아웃을 방지합니다.
            color={new THREE.Color(color).multiplyScalar(5)} // 5배 정도만 밝게 (화이트아웃 방지)
            toneMapped={false}
            transparent
            opacity={0.9}
          />
        </mesh>
      )}
    </group>
  );
}

// 별 생성 함수 (생략 없이 그대로 사용하세요)
function createRoundedStar(
  radius: number,
  points: number,
  roundness: number,
): THREE.Shape {
  const shape = new THREE.Shape();
  const innerRadius = radius * 0.5;
  for (let i = 0; i < points * 2; i++) {
    const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? radius : innerRadius;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) shape.moveTo(x, y);
    else {
      const prevAngle = ((i - 1) / (points * 2)) * Math.PI * 2 - Math.PI / 2;
      const prevR = (i - 1) % 2 === 0 ? radius : innerRadius;
      const prevX = Math.cos(prevAngle) * prevR;
      const prevY = Math.sin(prevAngle) * prevR;
      const cpX = prevX + (x - prevX) * roundness;
      const cpY = prevY + (y - prevY) * roundness;
      shape.quadraticCurveTo(cpX, cpY, x, y);
    }
  }
  shape.closePath();
  return shape;
}
