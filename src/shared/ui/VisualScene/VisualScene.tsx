import { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Float,
  Environment,
  PerspectiveCamera,
  OrbitControls,
} from "@react-three/drei";
import { Molecule } from "./Molecule";
import { ThreeErrorBoundary } from "./ThreeErrorBoundary";

type VisualSceneProps = {
  color?: string;
  type?: "protein" | "material";
  onHover?: (index: number | null) => void;
};

/**
 * VisualScene: 3D 오브젝트를 화면에 그리기 위한 전체 공간(Scene)을 설정하는 컴포넌트입니다.
 */
export function VisualScene({ color, type, onHover }: VisualSceneProps) {
  // 사용자가 마우스로 원자를 잡고 있을 때, 화면 전체가 회전하거나 흔들리는 것을 멈추기 위한 상태 값입니다.
  const [controlsEnabled, setControlsEnabled] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null!);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", position: "relative" }}
      aria-hidden="true"
    >
      {/* Canvas: 3D 그래픽을 그리는 도화지입니다. */}
      <Canvas
        gl={{
          alpha: true,
          powerPreference: "high-performance",
          antialias: false,
        }}
        dpr={1}
        eventSource={containerRef.current as HTMLElement}
        style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          zIndex: 10,
          pointerEvents: "auto",
        }}
      >
        <ThreeErrorBoundary>
          {/* PerspectiveCamera: 카메라의 위치를 설정합니다. (z=10 만큼 뒤에서 보고 있음) */}
          <PerspectiveCamera makeDefault position={[0, 0, 10]} />
          {/* OrbitControls: 마우스 드래그로 화면 전체를 회전시킬 수 있게 해주는 기능입니다. */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            makeDefault
            enabled={controlsEnabled}
          />
          {/* 조명 설정: 3D 물체가 입체적으로 보이도록 여러 방향에서 빛을 비춥니다. */}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <spotLight
            position={[-10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
          />

          {/* Float: 물체를 공중에 둥둥 떠 있는 것처럼 부드럽게 움직이게 만듭니다. */}
          <Float
            speed={2}
            rotationIntensity={controlsEnabled ? 0.5 : 0}
            floatIntensity={controlsEnabled ? 1 : 0}
          >
            {/* [가장 중요한 부분!] Molecule: 실제 분자(구슬과 선)를 그리는 핵심 로직이 들어있는 컴포넌트입니다. */}
            <Molecule
              color={color}
              type={type}
              onGrabStart={() => setControlsEnabled(false)} // 원자를 잡기 시작하면 화면 회전을 멈춤
              onGrabEnd={() => setControlsEnabled(true)} // 원자를 놓으면 다시 화면 회전을 허용
              containerRef={containerRef} // 휠 확대를 프레임 안에서만 동작하게 함
              onHover={onHover} // 호버 시 카드 하이라이트를 위한 콜백
            />
          </Float>

          {/* Environment: 주변 배경 환경 광원을 추가하여 금속 질감 등을 더 예쁘게 표현합니다. */}
          <Environment preset="city" />
        </ThreeErrorBoundary>
      </Canvas>
    </div>
  );
}
