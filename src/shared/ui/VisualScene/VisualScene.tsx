import { useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Environment,
  PerspectiveCamera,
  Stars,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Molecule } from "./Molecule";
import { ThreeErrorBoundary } from "./ThreeErrorBoundary";

/** 마우스 움직임에 따라 카메라가 미세하게 반응하는 패럴랙스 */
function CameraRig() {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 8));

  useFrame((state) => {
    // pointer: -1 ~ 1 범위 → 카메라 오프셋으로 변환
    targetPos.current.set(state.pointer.x * 0.3, state.pointer.y * 0.2, 8);

    // 부드럽게 따라가기
    camera.position.lerp(targetPos.current, 0.05);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

type VisualSceneProps = {
  color?: string;
  type?: "protein" | "material";
  paused?: boolean;
  onHover?: (index: number | null) => void;
  onClickSphere?: (index: number) => void;
};

export function VisualScene({
  color,
  type,
  paused = false,
  onHover,
  onClickSphere,
}: VisualSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null!);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", position: "relative" }}
      aria-hidden="true"
    >
      <Canvas
        frameloop={paused ? "demand" : "always"}
        gl={{
          alpha: true,
          powerPreference: "high-performance",
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          preserveDrawingBuffer: true, // 컨텍스트 소실 방지에 도움
        }}
        dpr={[1, 2]} // 성능과 품질 밸런스 조정
        eventSource={containerRef.current || undefined}
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
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={40} />
          <CameraRig />

          <ambientLight intensity={0.15} />
          <pointLight position={[5, 5, 8]} intensity={0.3} color="#FFF8F0" />
          <pointLight position={[-5, -3, 5]} intensity={0.15} color="#8888CC" />

          <Stars
            radius={80}
            depth={60}
            count={2000}
            factor={2}
            saturation={0.1}
            fade
            speed={0.3}
          />

          <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
            <Molecule
              color={color}
              type={type}
              containerRef={containerRef}
              onHover={onHover}
              onClickSphere={onClickSphere}
            />
          </Float>

          <Environment preset="night" environmentIntensity={0.3} />

          <EffectComposer>
            <Bloom
              intensity={0.4}
              luminanceThreshold={0.6}
              luminanceSmoothing={0.4}
              mipmapBlur
              radius={0.6}
            />
          </EffectComposer>
        </ThreeErrorBoundary>
      </Canvas>
    </div>
  );
}
