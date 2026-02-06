import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useWheelScaleOnRef } from "../../hooks/useWheelScale";
import { Ligand } from "./Ligand";

type MoleculeProps = {
  color?: string;
  type?: "protein" | "material";
  onGrabStart?: () => void;
  onGrabEnd?: () => void;
  containerRef?: React.RefObject<HTMLElement | null>;
};

// 5대 강점 데이터 구조
const STRENGTHS = [
  { name: "Connectedness", position: [0, 0, 0], color: "#FFB088" }, // 중심
  { name: "Responsibility", position: [1.2, 1.2, 0], color: "#FFA07A" }, // 오른쪽 위
  { name: "Empathy", position: [-1.2, 1.2, 0], color: "#FFDAB9" }, // 왼쪽 위
  { name: "Belief", position: [1.2, -1.2, 0], color: "#FFE4B5" }, // 오른쪽 아래
  { name: "Intellection", position: [-1.2, -1.2, 0], color: "#FFEFD5" }, // 왼쪽 아래
] as const;

/**
 * Molecule 컴포넌트: 5대 강점을 표현하는 3D 구조
 * - Connectedness를 중심으로 4개의 강점이 배치
 */
export function Molecule({ containerRef }: MoleculeProps) {
  const groupRef = useRef<THREE.Group>(null);

  // 마우스 휠 스케일 훅 적용
  useWheelScaleOnRef(groupRef, {
    initial: 0.6,
    min: 0.4,
    max: 0.9,
    damping: 8,
    step: 0.0008,
    containerRef,
  });

  // 연결선 데이터 생성 (중심에서 나머지 4개로)
  const connections = useMemo(() => {
    return STRENGTHS.slice(1).map((strength, idx) => ({
      start: new THREE.Vector3(
        ...(STRENGTHS[0].position as [number, number, number]),
      ),
      end: new THREE.Vector3(
        ...(strength.position as [number, number, number]),
      ),
      index: idx + 1,
    }));
  }, []);

  return (
    <group ref={groupRef} position={[1.5, 0, 0]}>
      {/* 5개의 강점 구체들 */}
      {STRENGTHS.map((strength, index) => {
        const isCenter = index === 0;
        const pos = new THREE.Vector3(
          ...(strength.position as [number, number, number]),
        );

        return (
          <group key={strength.name} position={pos}>
            <mesh>
              <sphereGeometry args={[isCenter ? 0.5 : 0.4, 32, 32]} />
              <meshStandardMaterial
                color={strength.color}
                roughness={0.8}
                metalness={0.1}
              />
            </mesh>

            {/* 리간드(작은 분자 스틱) 추가 */}
            <group>
              {/* 구체와 리간드를 연결하는 메인 스틱 */}
              <mesh
                position={[
                  (isCenter ? 0.5 : 0.4) * 0.8,
                  (isCenter ? 0.5 : 0.4) * 0.4,
                  0,
                ]}
                rotation={[0, 0, Math.PI / 4]}
              >
                <cylinderGeometry
                  args={[0.02, 0.02, (isCenter ? 0.5 : 0.4) * 0.8, 8]}
                />
                <meshStandardMaterial color="white" opacity={0.5} transparent />
              </mesh>
              <Ligand
                position={
                  new THREE.Vector3(
                    (isCenter ? 0.5 : 0.4) * 1.2,
                    (isCenter ? 0.5 : 0.4) * 0.6,
                    0,
                  )
                }
              />
            </group>
          </group>
        );
      })}

      {/* 골드 연결선들 (중심에서 4개 구체로) */}
      {connections.map(({ start, end, index: connIndex }) => {
        const direction = end.clone().sub(start);
        const length = direction.length();
        const midpoint = start.clone().add(end).multiplyScalar(0.5);

        return (
          <group key={connIndex} position={midpoint}>
            <mesh
              onUpdate={(self) => {
                self.lookAt(end);
                self.rotateX(Math.PI / 2);
              }}
            >
              <cylinderGeometry args={[0.03, 0.03, length, 16]} />
              <meshStandardMaterial
                color="#FFD700"
                roughness={0.3}
                metalness={0.5}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
