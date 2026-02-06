import { useRef, useMemo, useState, useEffect, forwardRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useWheelScaleOnRef } from "../../hooks/useWheelScale";

/**
 * Molecule 컴포넌트
 * - 5개의 강점 구슬과 이를 연결하는 '빛의 관' 시각화
 * - 직선 연결 + 투명한 유리관 + 흐르는 앰버 에너지
 */

type MoleculeProps = {
  color?: string;
  type?: "protein" | "material";
  onGrabStart?: () => void;
  onGrabEnd?: () => void;
  containerRef?: React.RefObject<HTMLElement | null>;
  onHover?: (index: number | null) => void;
  onClickSphere?: (index: number) => void;
};

const STRENGTHS = [
  { name: "Connectedness", position: [0, 0, 0], color: "#C8A2C8" },
  { name: "Responsibility", position: [1.3, 1.1, 0], color: "#E8C8A0" },
  { name: "Empathy", position: [-1.3, 1.1, 0], color: "#A8D8DC" },
  { name: "Belief", position: [1.3, -1.1, 0], color: "#F0C8A0" },
  { name: "Intellection", position: [-1.3, -1.1, 0], color: "#B8C8E0" },
] as const;

// ─── Liquid Light (흐르는 빛) 설정 ───
const STREAKS_PER_LINE = 4; // 각 선당 빛줄기 수
const STREAK_RESOLUTION = 60; // 부드러운 그라데이션을 위해 증가
const STREAK_MIN_LEN = 0.35;
const STREAK_MAX_LEN = 0.5; // 긴 빛줄기
const STREAK_MIN_SPEED = 0.15;
const STREAK_MAX_SPEED = 0.25;

// 앰버 색상 (#FFBF00)
const AMBER_COLOR = new THREE.Color("#FFBF00");
const AMBER_GLOW = new THREE.Color("#FFD54F"); // 밝은 앰버
const BREATHING_SPEED = 0.8; // 부드러운 호흡

// ─── 완벽한 직선 경로 생성 (Straight Line) ───
function createStraightLine(
  start: THREE.Vector3,
  end: THREE.Vector3,
): THREE.LineCurve3 {
  return new THREE.LineCurve3(start, end);
}

// ─── Liquid Light Flow (부드러운 앰버 빛줄기) ───
function LiquidLightFlow({
  connections,
  hoveredIndex,
}: {
  connections: {
    start: THREE.Vector3;
    end: THREE.Vector3;
    index: number;
    curve: THREE.LineCurve3;
  }[];
  hoveredIndex: number | null;
}) {
  // 전역 심장 박동(Pulse) 효과를 위한 레프
  const globalPulseRef = useRef(0);

  // 각 연결선마다 여러 개의 빛줄기
  const streaks = useMemo(() => {
    const arr = [];
    for (let c = 0; c < connections.length; c++) {
      for (let s = 0; s < STREAKS_PER_LINE; s++) {
        arr.push({
          connIdx: c,
          len: THREE.MathUtils.lerp(
            STREAK_MIN_LEN,
            STREAK_MAX_LEN,
            Math.random(),
          ),
          speed: THREE.MathUtils.lerp(
            STREAK_MIN_SPEED,
            STREAK_MAX_SPEED,
            Math.random(),
          ),
          phase: Math.random(),
          breathOffset: Math.random() * Math.PI * 2,
        });
      }
    }
    return arr;
  }, [connections.length]);

  const totalVerts = streaks.length * STREAK_RESOLUTION;
  const positions = useMemo(
    () => new Float32Array(totalVerts * 3),
    [totalVerts],
  );
  const alphas = useMemo(() => new Float32Array(totalVerts), [totalVerts]);
  const colors = useMemo(() => new Float32Array(totalVerts * 3), [totalVerts]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, alphas, colors]);

  // 애니메이션 루프
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    globalPulseRef.current = Math.sin(t * 2.0) * 0.2 + 0.8; // 0.6 ~ 1.0 박동
    let v = 0;

    for (let i = 0; i < streaks.length; i++) {
      const { connIdx, len, speed, phase, breathOffset } = streaks[i];
      const conn = connections[connIdx];

      // 호버 시 활성화 (중앙 구체 호버 시 모든 선 활성화)
      const isActive = hoveredIndex === 0 || hoveredIndex === conn.index;
      const effSpeed = speed * (isActive ? 1.5 : 1.0);

      // 개별 빛줄기 호흡 효과
      const breathing =
        0.8 + Math.sin(t * BREATHING_SPEED + breathOffset) * 0.2;

      // 빛줄기 헤드 위치 (0~1)
      const head = (t * effSpeed + phase) % 1;

      for (let j = 0; j < STREAK_RESOLUTION; j++, v++) {
        const frac = j / (STREAK_RESOLUTION - 1);
        let posT = head - frac * len;

        // 경계 래핑
        if (posT < 0) posT += 1;
        if (posT > 1) posT -= 1;

        // 에너지가 중앙(start)에서 바깥(end)으로 흐르도록 보장 (posT=0 이 중앙)
        const point = conn.curve.getPointAt(posT);

        positions[v * 3] = point.x;
        positions[v * 3 + 1] = point.y;
        positions[v * 3 + 2] = point.z;

        // ─── 그라데이션 페이드아웃 (Soft Melting Tail) ───
        // 헤드(frac=0)는 밝고, 테일(frac=1)로 갈수록 공기 중으로 녹아듦
        const headFade = Math.pow(1.0 - frac, 1.5);
        const edgeFade = Math.sin(frac * Math.PI); // 양 끝단 페이드

        const combinedAlpha = headFade * edgeFade;

        // 최종 알파값: 전역 박동 + 개별 호흡 + 상태 효과 적용
        alphas[v] =
          combinedAlpha *
          breathing *
          globalPulseRef.current *
          (isActive ? 1.0 : 0.6);

        // 앰버 색상 보간 (헤드가 더 고온의 밝은 느낌)
        const colorIntensity = headFade * 0.7 + 0.3;
        const mixedColor = new THREE.Color().lerpColors(
          AMBER_COLOR,
          AMBER_GLOW,
          colorIntensity,
        );
        colors[v * 3] = mixedColor.r;
        colors[v * 3 + 1] = mixedColor.g;
        colors[v * 3 + 2] = mixedColor.b;
      }
    }

    geometry.getAttribute("position").needsUpdate = true;
    geometry.getAttribute("alpha").needsUpdate = true;
    geometry.getAttribute("color").needsUpdate = true;
  });

  // Liquid Light 셰이더 (더 부드러운 광원 효과)
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uGlowIntensity: { value: 0.6 },
        },
        vertexShader: `
          attribute float alpha;
          attribute vec3 color;
          varying float vAlpha;
          varying vec3 vColor;
          void main() {
            vAlpha = alpha;
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            
            // 거리에 따른 포인트 크기 조절 + 알파 반비례
            gl_PointSize = (12.0 * alpha + 2.0) * (2.0 / -mvPosition.z);
          }
        `,
        fragmentShader: `
          uniform float uGlowIntensity;
          varying float vAlpha;
          varying vec3 vColor;
          void main() {
            // 부드러운 가우시안 느낌의 발광 원형 포인트
            vec2 center = gl_PointCoord - vec2(0.5);
            float dist = length(center);
            float mask = exp(-dist * dist * 10.0); // 더 부드러운 외곽선
            
            // 자체 발광 강화
            vec3 emissive = vColor * (1.2 + uGlowIntensity * vAlpha);

            // 알파 투명도 처리 (Melting 효과)
            float finalAlpha = mask * vAlpha;

            gl_FragColor = vec4(emissive, finalAlpha);

            if (gl_FragColor.a < 0.005) discard;
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  return <points geometry={geometry} material={material} />;
}

// ─── 투명한 유리관 (Light Tubes with MeshPhysicalMaterial) ───
function GlassTubes({
  connections,
}: {
  connections: {
    start: THREE.Vector3;
    end: THREE.Vector3;
    index: number;
    curve: THREE.LineCurve3;
  }[];
}) {
  return (
    <group>
      {connections.map((conn, idx) => (
        <GlassTube key={idx} start={conn.start} end={conn.end} />
      ))}
    </group>
  );
}

// ─── 개별 유리관 (투명한 빛의 관) ───
const GlassTube = forwardRef<
  THREE.Mesh,
  { start: THREE.Vector3; end: THREE.Vector3 }
>(({ start, end }, ref) => {
  const geometry = useMemo(() => {
    // 직선 경로를 따르는 아주 얇은 튜브
    const path = new THREE.LineCurve3(start, end);
    return new THREE.TubeGeometry(path, 32, 0.012, 8, false);
  }, [start, end]);

  return (
    <mesh ref={ref} geometry={geometry}>
      <meshPhysicalMaterial
        color="#FFFFFF"
        transparent
        opacity={0.15}
        roughness={0}
        metalness={0}
        transmission={0.95}
        thickness={0.5}
        ior={1.45}
        clearcoat={1}
        clearcoatRoughness={0}
        envMapIntensity={0.5}
        depthWrite={false}
      />
    </mesh>
  );
});

export function Molecule({
  containerRef,
  onHover,
  onClickSphere,
}: MoleculeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const pulseRef = useRef(1);
  const glowRef = useRef(0.35);
  const sphereRefs = useRef<(THREE.Group | null)[]>([]);
  const hoverScalesRef = useRef<number[]>(STRENGTHS.map(() => 1));

  // ─── 드래그 관성 및 탄성 복귀 (Spring Back) ───
  const isDragging = useRef(false);
  const previousMousePos = useRef({ x: 0, y: 0 });
  const rotationVelocity = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  // ─── 클릭/드래그 판정 분리 ───
  const dragStartPos = useRef({ x: 0, y: 0 });
  const totalDragDistance = useRef(0);
  const wasDragging = useRef(false);
  const CLICK_THRESHOLD = 5; // 5px 이하 이동은 클릭으로 인식

  // Spring Back 설정: 무중력 상태의 쫀득한 복구 느낌
  const INERTIA_DAMPING = 0.96; // 관성 감쇠 (높을수록 오래 지속)
  const SPRING_STIFFNESS = 0.015; // 탄성 강도 (정면으로 당기는 힘)
  const SPRING_DAMPING = 0.92; // 복귀 시 부드러움 (높을수록 천천히)
  const VELOCITY_THRESHOLD = 0.0001; // 정지 판정 임계값

  const { gl } = useThree();

  // 마우스 이벤트 핸들러
  useEffect(() => {
    const canvas = gl.domElement;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      previousMousePos.current = { x: e.clientX, y: e.clientY };
      dragStartPos.current = { x: e.clientX, y: e.clientY };
      totalDragDistance.current = 0;
      wasDragging.current = false;
      rotationVelocity.current = { x: 0, y: 0 };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;

      const deltaX = e.clientX - previousMousePos.current.x;
      const deltaY = e.clientY - previousMousePos.current.y;

      // 총 이동 거리 누적
      totalDragDistance.current += Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // 임계값 초과 시 드래그로 판정
      if (totalDragDistance.current > CLICK_THRESHOLD) {
        wasDragging.current = true;
      }

      // 회전 속도 계산 (부드러운 드래그)
      rotationVelocity.current.x = deltaY * 0.003;
      rotationVelocity.current.y = deltaX * 0.003;

      previousMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [gl]);

  useWheelScaleOnRef(groupRef, {
    initial: 0.55,
    min: 0.4,
    max: 0.9,
    damping: 8,
    step: 0.0008,
    containerRef,
  });

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    pulseRef.current = Math.sin(t * 1.5) * 0.15 + 1;
    glowRef.current = Math.sin(t * 0.8) * 0.15 + 0.35;

    // ─── 드래그 관성 및 탄성 복귀 (Spring Back) ───
    if (groupRef.current) {
      if (isDragging.current) {
        // 드래그 중: 회전 속도를 현재 회전값에 적용
        currentRotation.current.x += rotationVelocity.current.x;
        currentRotation.current.y += rotationVelocity.current.y;
      } else {
        // ─── 드래그 릴리스: 관성 + 탄성 복귀 ───

        // 1. 관성 감쇠: 속도가 점점 줄어듦
        rotationVelocity.current.x *= INERTIA_DAMPING;
        rotationVelocity.current.y *= INERTIA_DAMPING;

        // 2. 탄성력: 정면(0,0,0)을 향해 당기는 힘 (Spring Force)
        const springForceX = -currentRotation.current.x * SPRING_STIFFNESS;
        const springForceY = -currentRotation.current.y * SPRING_STIFFNESS;

        // 3. 속도에 탄성력 추가 + 댐핑 적용
        rotationVelocity.current.x =
          (rotationVelocity.current.x + springForceX) * SPRING_DAMPING;
        rotationVelocity.current.y =
          (rotationVelocity.current.y + springForceY) * SPRING_DAMPING;

        // 4. 속도를 회전값에 적용
        currentRotation.current.x += rotationVelocity.current.x;
        currentRotation.current.y += rotationVelocity.current.y;

        // 5. 정지 판정: 충분히 작으면 정확히 0으로 고정
        if (
          Math.abs(currentRotation.current.x) < VELOCITY_THRESHOLD &&
          Math.abs(currentRotation.current.y) < VELOCITY_THRESHOLD &&
          Math.abs(rotationVelocity.current.x) < VELOCITY_THRESHOLD &&
          Math.abs(rotationVelocity.current.y) < VELOCITY_THRESHOLD
        ) {
          currentRotation.current.x = 0;
          currentRotation.current.y = 0;
          rotationVelocity.current.x = 0;
          rotationVelocity.current.y = 0;
        }
      }

      // 부드러운 회전 보간 (Lerp로 쫀득한 느낌)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        currentRotation.current.x,
        0.12,
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        currentRotation.current.y,
        0.12,
      );
    }

    // 심장 바운스: 호버된 구슬만 두근두근 스케일 애니메이션
    STRENGTHS.forEach((_, index) => {
      const group = sphereRefs.current[index];
      if (!group) return;

      if (hoveredIndex === index) {
        const beat = Math.sin(t * 6) * 0.5 + 0.5; // 0~1
        const heartbeat = 1 + beat * 0.15; // 1.0 ~ 1.15
        hoverScalesRef.current[index] = heartbeat;
      } else {
        hoverScalesRef.current[index] = THREE.MathUtils.lerp(
          hoverScalesRef.current[index],
          1,
          0.12,
        );
      }
      group.scale.setScalar(hoverScalesRef.current[index]);
    });
  });

  // ─── 완벽한 직선 연결 생성 ───
  const connections = useMemo(() => {
    return STRENGTHS.slice(1).map((strength, idx) => {
      const start = new THREE.Vector3(
        ...(STRENGTHS[0].position as [number, number, number]),
      );
      const end = new THREE.Vector3(
        ...(strength.position as [number, number, number]),
      );
      const curve = createStraightLine(start, end);

      return {
        start,
        end,
        index: idx + 1,
        curve,
      };
    });
  }, []);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {STRENGTHS.map((strength, index) => {
        const isCenter = index === 0;
        const isHovered = hoveredIndex === index;
        const radius = isCenter ? 0.45 : 0.35;
        const pos = new THREE.Vector3(
          ...(strength.position as [number, number, number]),
        );

        return (
          <group
            key={strength.name}
            position={pos}
            ref={(el) => {
              sphereRefs.current[index] = el;
            }}
          >
            {isHovered && (
              <pointLight
                color="#FFF0D0"
                intensity={0.6}
                distance={2.5}
                decay={2}
              />
            )}

            <mesh scale={0.6}>
              <sphereGeometry args={[radius, 32, 32]} />
              <meshBasicMaterial
                color={strength.color}
                transparent
                opacity={isHovered ? 0.6 : glowRef.current}
                depthWrite={false}
              />
            </mesh>

            <mesh
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredIndex(index);
                onHover?.(index);
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                setHoveredIndex(null);
                onHover?.(null);
                document.body.style.cursor = "auto";
              }}
              onClick={(e) => {
                e.stopPropagation();
                // 드래그 후에는 클릭 무시 (임계값 초과 시)
                if (wasDragging.current) {
                  wasDragging.current = false;
                  return;
                }
                onClickSphere?.(index);
              }}
            >
              <sphereGeometry args={[radius, 64, 64]} />
              <meshPhysicalMaterial
                color={strength.color}
                roughness={0.05}
                metalness={0.1}
                transmission={0.85}
                thickness={1.2}
                ior={1.5}
                clearcoat={1}
                clearcoatRoughness={0.05}
                iridescence={0.3}
                iridescenceIOR={1.3}
                emissive={strength.color}
                emissiveIntensity={isHovered ? 0.4 : 0.1}
                envMapIntensity={1.5}
                transparent
                opacity={0.95}
              />
            </mesh>

            {isHovered && (
              <Text
                position={[0, radius + 0.25, 0]}
                fontSize={0.12}
                color="#E0D8CC"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.008}
                outlineColor="#FFC860"
                outlineOpacity={0.4}
                letterSpacing={0.15}
                maxWidth={2}
              >
                {strength.name}
              </Text>
            )}
          </group>
        );
      })}

      {/* 투명한 유리관 (Light Tubes) */}
      <GlassTubes connections={connections} />

      {/* 흐르는 앰버 빛줄기 (Liquid Light) */}
      <LiquidLightFlow connections={connections} hoveredIndex={hoveredIndex} />
    </group>
  );
}
