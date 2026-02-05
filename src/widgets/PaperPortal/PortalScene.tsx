import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
} from "@react-three/drei";
import { Suspense, useState } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { PaperLayer } from "./PaperLayer";
import { Character } from "./Character";
import styles from "./PaperPortal.module.css";

/**
 * Portal Scene Canvas 설정
 * 10개 레이어를 Z축으로 촘촘하게 배치 (귀여운 팝업북 스타일)
 */
export function PortalScene() {
  const [isExpanded, setIsExpanded] = useState(false);

  // 파스텔 색상 팔레트
  const pastelColors = [
    "#FFC8DD", // 핑크
    "#FFAFCC", // 연핑크
    "#BDE0FE", // 하늘
    "#A2D2FF", // 라벤더블루
    "#CDB4DB", // 연보라
    "#FFC8DD", // 핑크 (반복)
    "#BDE0FE", // 하늘 (반복)
    "#FFD6A5", // 피치
    "#CDB4DB", // 연보라 (반복)
    "#A2D2FF", // 라벤더블루 (반복)
  ];

  // 10개 레이어 구성 (Z축 간격을 넓혀서 깊이감 강화)
  const layers = Array.from({ length: 10 }, (_, i) => ({
    z: -i * 2.0,
    color: pastelColors[i % pastelColors.length],
    scale: 1 - i * 0.05,
    rotation: 0, // 회전 제거로 그림자 깔끔하게
  }));

  return (
    <Canvas
      className={styles.canvas}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
      shadows
    >
      {/* 배경색을 아주 어두운 남색/검정으로 설정해 포탈의 깊이감을 살립니다 */}
      <color attach="background" args={["#050508"]} />

      <PerspectiveCamera makeDefault position={[0, 0, 25]} fov={50} />

      {/* 조명은 너무 세지 않게! */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />

      {/* 조명 설정 - 자연스러운 음영 */}
      <ambientLight intensity={0.6} />

      {/* 메인 DirectionalLight - 부드러운 그림자 */}
      <directionalLight
        position={[0, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0005}
      />
      <pointLight position={[-10, 5, 5]} intensity={0.3} color="#FFC8DD" />
      <pointLight position={[10, -5, 5]} intensity={0.3} color="#BDE0FE" />

      {/* 캐릭터 입체감을 위한 측면 상단 조명 */}
      <spotLight
        position={[3, 4, 3]}
        angle={0.5}
        penumbra={0.8}
        intensity={0.8}
        color="#ffffff"
        target-position={[0, 0, 0]}
      />
      <spotLight
        position={[-3, 4, 3]}
        angle={0.5}
        penumbra={0.8}
        intensity={0.5}
        color="#FFC8DD"
        target-position={[0, 0, 0]}
      />

      {/* 캐릭터 전용 강한 정면 상단 조명 */}
      <pointLight
        position={[0, 2, 5]}
        intensity={1.5}
        color="#ffffff"
        distance={10}
        decay={2}
      />

      <Suspense fallback={null}>
        {layers.map((layer, index) => (
          <PaperLayer
            key={index}
            layerIndex={index}
            // 간격을 확 벌려야 터널처럼 보입니다 (0.5 -> 2.5)
            baseZ={-index * 2.5}
            color={layer.color}
            scale={1} // 애니메이션 훅에서 조절되도록 1로 고정
            rotation={0}
            onExpand={() => setIsExpanded(!isExpanded)}
          />
        ))}

        {/* 캐릭터는 가장 깊은 곳 앞에 배치 */}
        <Character isExpanded={isExpanded} />
      </Suspense>

      {/* Bloom 효과 - 강력한 네온 발광 */}
      <EffectComposer>
        <Bloom
          // [강도 조절] 빛이 얼마나 강하게 퍼질지 결정합니다. 1.5 ~ 2.0 사이 추천
          intensity={0.8}
          // [반경 조절] 빛이 얼마나 넓게 퍼질지 결정합니다.
          // 레퍼런스처럼 부드러운 오오라 느낌을 내려면 이 값을 키워보세요 (0.5 ~ 0.8)
          radius={0.3}
          // [임계값] 이 값보다 밝은 부분만 빛나게 합니다.
          // 캐릭터 본체는 안 빛나고 테두리만 빛나게 하는 핵심 설정입니다.
          luminanceThreshold={1.2}
          //Smoothing을 낮춰서 빛의 번짐 경계를 더 명확하게 잡습니다.
          luminanceSmoothing={0.1}
          mipmapBlur
        />
      </EffectComposer>

      <Environment preset="city" />
    </Canvas>
  );
}
