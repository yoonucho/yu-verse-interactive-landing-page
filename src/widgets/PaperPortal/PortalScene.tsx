import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
} from "@react-three/drei";
import { Suspense, useState, useMemo, useRef } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { PaperLayer } from "./PaperLayer";
import { PortalCharacter } from "./PortalCharacter";
import { Star } from "./Star";
import styles from "./PaperPortal.module.css";

/**
 * Portal Scene Canvas 설정
 * 10개 레이어를 Z축으로 촘촘하게 배치 (귀여운 팝업북 스타일)
 */
export function PortalScene() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasBeenExpanded, setHasBeenExpanded] = useState(false);
  const [layerExpandStates, setLayerExpandStates] = useState<boolean[]>(
    Array(10).fill(false),
  );
  const [isAnimating, setIsAnimating] = useState(false);

  // 파스텔 색상 팔레트 (첫 번째 레이어는 배경색과 동일)
  const pastelColors = [
    "#12122d", // 배경색과 동일 (투명 효과)
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

  // 캐릭터 Ref 생성
  const characterRef = useRef<{ sayGoodbye: () => void }>(null);

  // 클릭 핸들러: 순차적 레이어 확장/축소
  const handleClick = () => {
    if (isAnimating) return; // 애니메이션 중이면 무시

    setIsAnimating(true);

    if (!isExpanded) {
      // 확장: 0→9 순차적으로 (30ms 간격으로 더 빠르게!)
      layers.forEach((_, index) => {
        setTimeout(() => {
          setLayerExpandStates((prev) => {
            const newStates = [...prev];
            newStates[index] = true;
            return newStates;
          });

          // 마지막 레이어면 캐릭터 표시
          if (index === layers.length - 1) {
            setTimeout(() => {
              setIsExpanded(true);
              if (!hasBeenExpanded) setHasBeenExpanded(true);
              setIsAnimating(false);
            }, 30);
          }
        }, index * 30);
      });
    } else {
      // 배경 클릭 시 로직 분기

      // 1. 캐릭터가 아직 'goodbye' 상태가 아니라면 작별 인사를 먼저 시킴
      if (characterRef.current) {
        characterRef.current.sayGoodbye();
        setIsAnimating(false); // 애니메이션 플래그 해제 (굿바이 시퀀스가 별도 진행)
        return;
      }

      // 2. 만약 characterRef가 없거나(이미 닫힘 등) 강제 종료 필요 시 기존 로직 수행
      executeCloseSequence();
    }
  };

  const executeCloseSequence = () => {
    // 축소: 캐릭터 먼저 뒤돌아서 들어감 → 그 다음 레이어 9→0 순차 축소
    setIsExpanded(false);

    // 캐릭터가 완전히 들어가서 작아진 후 대기 (5000ms - 테스트용)
    setTimeout(() => {
      layers.forEach((_, index) => {
        const reverseIndex = layers.length - 1 - index;
        setTimeout(() => {
          setLayerExpandStates((prev) => {
            const newStates = [...prev];
            newStates[reverseIndex] = false;
            return newStates;
          });

          // 첫 레이어면 애니메이션 종료
          if (reverseIndex === 0) {
            setTimeout(() => {
              setIsAnimating(false);
            }, 50);
          }
        }, index * 50);
      });
    }, 2000);
  };

  // 별 좌표와 속성 생성 (밤하늘 효과)
  const starCount = 50;
  const starData = useMemo(() => {
    const arr = [];
    for (let i = 0; i < starCount; i++) {
      // 별은 중앙(0,0) 기준 반지름 2~5 내에 랜덤 배치 (별 구멍 안쪽)
      const r = 2 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      arr.push({
        x: Math.cos(theta) * r,
        y: Math.sin(theta) * r,
        z: -15 + Math.random() * 5, // 구멍 영역 깊은 곳
        size: 0.04 + Math.random() * 0.06,
        color: Math.random() < 0.7 ? "#ffffff" : "#ffe6a0",
        opacity: 0.6 + Math.random() * 0.4,
        twinkleSpeed: 1.0 + Math.random() * 3, // 반짝임 속도 더 빠르게 (1.0~4.0)
        twinkleOffset: Math.random() * Math.PI * 2, // 시작 위상 랜덤
      });
    }
    return arr;
  }, []);

  return (
    <Canvas
      className={styles.canvas}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
      shadows
    >
      {/* 배경색을 어두운 보라색으로 설정 - 신비로운 우주 느낌 */}
      <color attach="background" args={["#12122d"]} />

      <PerspectiveCamera makeDefault position={[0, 0, 25]} fov={50} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />

      {/* 조명 설정 - 성능 최적화 (핵심 조명만 유지) */}
      <ambientLight intensity={0.4} color="#2a2a4e" />

      {/* 메인 DirectionalLight - 전체 조명 */}
      <directionalLight
        position={[0, 10, 5]}
        intensity={0.7}
        color="#d4d0ff"
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

      {/* 별 구멍 테두리 조명 - 핵심 4개만 (성능 최적화) */}
      <pointLight
        position={[2, 0, -2]}
        intensity={3.0}
        color="#ffb088"
        distance={10}
      />
      <pointLight
        position={[-2, 0, -2]}
        intensity={3.0}
        color="#ffd6a5"
        distance={10}
      />
      <pointLight
        position={[0, 2, -2]}
        intensity={3.0}
        color="#ffe0b8"
        distance={10}
      />
      <pointLight
        position={[0, -2, -2]}
        intensity={3.0}
        color="#ffc8a0"
        distance={10}
      />

      {/* 별 구멍 안쪽 깊이 조명 - 2개만 */}
      <pointLight
        position={[0, 0, -10]}
        intensity={2.0}
        color="#ffb088"
        distance={20}
      />
      <pointLight
        position={[0, 0, -15]}
        intensity={1.5}
        color="#ffa07a"
        distance={25}
      />

      {/* 캐릭터 림 라이트 - 2개만 */}
      <spotLight
        position={[-8, 5, 8]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        color="#ff10f0"
      />
      <spotLight
        position={[8, 5, 8]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        color="#d4d0ff"
      />

      <Suspense fallback={null}>
        {/* 밤하늘 별들 - 한 번 클릭하면 계속 보이고 반짝임 */}
        {hasBeenExpanded &&
          starData.map((star, idx) => (
            <Star
              key={idx}
              position={[star.x, star.y, star.z]}
              size={star.size}
              color={star.color}
              baseOpacity={star.opacity}
              twinkleSpeed={star.twinkleSpeed}
              twinkleOffset={star.twinkleOffset}
            />
          ))}

        {layers.map((layer, index) => (
          <PaperLayer
            key={index}
            layerIndex={index}
            baseZ={-index * 2.5}
            color={layer.color}
            scale={1}
            rotation={0}
            shouldExpand={layerExpandStates[index]}
            onExpand={handleClick}
          />
        ))}

        {/* 캐릭터: 맨 마지막에 렌더링 (가장 위에 보임) */}
        <PortalCharacter
          ref={characterRef}
          isExpanded={isExpanded}
          onClose={() => executeCloseSequence()}
        />
      </Suspense>

      {/* Bloom 효과 - 별 구멍 테두리만 빛나게 */}
      <EffectComposer>
        <Bloom
          // [강도 조절] 빛이 얼마나 강하게 퍼질지 결정합니다
          intensity={1.2}
          // [반경 조절] 빛이 얼마나 넓게 퍼질지 결정합니다
          radius={0.5}
          // [임계값] 이 값보다 밝은 부분만 빛나게 - 캐릭터는 제외
          luminanceThreshold={1.5}
          // Smoothing으로 빛의 번짐을 부드럽게
          luminanceSmoothing={0.2}
          mipmapBlur
        />
      </EffectComposer>

      <Environment preset="city" />
    </Canvas>
  );
}
