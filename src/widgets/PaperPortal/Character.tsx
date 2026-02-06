import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import characterImage from "../../assets/yoonu-full.png";
import characterBackImage from "../../assets/yoonu-back.png";

interface CharacterProps {
  isExpanded: boolean;
}

export function Character({ isExpanded }: CharacterProps) {
  const groupRef = useRef<THREE.Group>(null); // 부모 그룹 ref
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const shadowRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const [hasAppeared, setHasAppeared] = useState(false);
  const texture = useTexture(characterImage);
  const backTexture = useTexture(characterBackImage);

  // 텍스처 품질 설정
  texture.anisotropy = 16;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const scaleRef = useRef(0);
  const opacityRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const animationTypeRef = useRef<number>(0); // 0: jump, 1: rotate, 2: flip
  const disappearAnimationTypeRef = useRef<number>(0); // 사라질 때 애니메이션 타입
  const isDisappearingRef = useRef(false);

  // 틸트 효과를 위한 ref
  const tiltRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isExpanded) {
      // 나타나기
      if (!hasAppeared && !isDisappearingRef.current) {
        setHasAppeared(true);
        startTimeRef.current = null;
        // 랜덤 애니메이션 선택
        animationTypeRef.current = Math.floor(Math.random() * 3);
      }
    } else {
      // 사라지기
      if (hasAppeared && !isDisappearingRef.current) {
        isDisappearingRef.current = true;
        startTimeRef.current = null;
      }
    }
  }, [isExpanded]);

  useFrame((state) => {
    if (
      !meshRef.current ||
      !glowRef.current ||
      !shadowRef.current ||
      !groupRef.current
    )
      return;

    // === 마우스 틸트 효과 ===
    const maxTilt = 0.15; // 최대 기울기 (라디안)

    if (isDisappearingRef.current) {
      // 사라지는 중일 때는 틸트를 서서히 0으로
      tiltRef.current.x = THREE.MathUtils.lerp(tiltRef.current.x, 0, 0.1);
      tiltRef.current.y = THREE.MathUtils.lerp(tiltRef.current.y, 0, 0.1);
    } else if (hasAppeared) {
      // 나타난 상태일 때만 마우스 따라가기
      const targetTiltX = -state.mouse.y * maxTilt;
      const targetTiltY = state.mouse.x * maxTilt;

      // 부드럽게 보간 (lerp factor: 0.05 = 매우 부드러움)
      tiltRef.current.x = THREE.MathUtils.lerp(
        tiltRef.current.x,
        targetTiltX,
        0.05,
      );
      tiltRef.current.y = THREE.MathUtils.lerp(
        tiltRef.current.y,
        targetTiltY,
        0.05,
      );
    }

    // 그룹에 틸트 적용 (기존 개별 회전은 유지)
    groupRef.current.rotation.x = tiltRef.current.x;
    groupRef.current.rotation.y = tiltRef.current.y;

    // 사라지는 중일 때 - 뒤돌아서 앞으로 걸어가기
    if (isDisappearingRef.current) {
      if (startTimeRef.current === null) {
        startTimeRef.current = state.clock.elapsedTime;
      }

      const timeSinceStart = state.clock.elapsedTime - startTimeRef.current;
      const disappearDuration = 2.0; // 2초 동안 사라짐 (천천히)
      const disappearProgress = Math.min(timeSinceStart / disappearDuration, 1);

      const startZ = 3.5;
      const targetZ = 15; // 카메라 앞으로 (양수 방향)

      // 부드러운 이징 함수 (가속)
      const easeInQuad = (t: number) => t * t;
      const easedProgress = easeInQuad(disappearProgress);

      // Z축: 카메라 쪽으로 이동
      meshRef.current.position.z = startZ + (targetZ - startZ) * easedProgress;

      // Y축 회전: 0.5초 동안 180도 회전 (뒤돌기)
      const turnDuration = 0.5;
      const turnProgress = Math.min(timeSinceStart / turnDuration, 1);
      meshRef.current.rotation.y = turnProgress * Math.PI;

      // 걷는 듯한 상하 움직임 (바운스)
      meshRef.current.position.y = Math.abs(Math.sin(timeSinceStart * 8)) * 0.3;

      // X축은 그대로
      meshRef.current.position.x = 0;
      meshRef.current.rotation.z = 0;

      // 점점 작아지기 (거의 0에 가깝게)
      scaleRef.current = 1.0 * (1 - easedProgress * 0.95);

      // 투명도 (마지막 0.3초 동안만 페이드아웃)
      const fadeStart = 0.75;
      if (disappearProgress < fadeStart) {
        opacityRef.current = 1.0;
      } else {
        const fadeProgress = (disappearProgress - fadeStart) / (1 - fadeStart);
        opacityRef.current = 1 - fadeProgress;
      }

      // --- 이미지 교체: 뒤돌기 90도 이후부터 뒷모습 ---
      const useBack = turnProgress > 0.5;
      // 본체 텍스처 변경
      if (meshRef.current.material instanceof THREE.MeshBasicMaterial) {
        meshRef.current.material.map = useBack ? backTexture : texture;
        meshRef.current.material.needsUpdate = true;
      }
      // 글로우 텍스처 변경
      if (glowRef.current.material instanceof THREE.MeshBasicMaterial) {
        glowRef.current.material.map = useBack ? backTexture : texture;
        glowRef.current.material.needsUpdate = true;
      }

      if (disappearProgress >= 1) {
        isDisappearingRef.current = false;
        setHasAppeared(false);
        startTimeRef.current = null;
        // 회전 초기화
        meshRef.current.rotation.y = 0;
        // 텍스처 원상복구
        if (meshRef.current.material instanceof THREE.MeshBasicMaterial) {
          meshRef.current.material.map = texture;
          meshRef.current.material.needsUpdate = true;
        }
        if (glowRef.current.material instanceof THREE.MeshBasicMaterial) {
          glowRef.current.material.map = texture;
          glowRef.current.material.needsUpdate = true;
        }
      }

      // 스케일 적용
      meshRef.current.scale.setScalar(scaleRef.current);
      glowRef.current.scale.setScalar(scaleRef.current * 1.04);
      glowRef.current.position.copy(meshRef.current.position);
      glowRef.current.position.z -= 0.01;
      glowRef.current.rotation.copy(meshRef.current.rotation);

      if (glowRef.current.material instanceof THREE.MeshBasicMaterial) {
        glowRef.current.material.opacity = opacityRef.current * 0.5;
      }

      // 그림자 처리
      const characterY = meshRef.current.position.y;
      const shadowY = -5.5;
      const shadowDistance = Math.abs(characterY - shadowY);
      shadowRef.current.position.x = meshRef.current.position.x;
      shadowRef.current.position.y = shadowY;
      shadowRef.current.position.z = meshRef.current.position.z - 0.5;
      const shadowScale = Math.max(0.6, 1.2 - shadowDistance * 0.15);
      shadowRef.current.scale.setScalar(scaleRef.current * shadowScale);
      if (shadowRef.current.material instanceof THREE.MeshBasicMaterial) {
        const shadowOpacity = Math.max(0.1, 0.4 - shadowDistance * 0.08);
        shadowRef.current.material.opacity = shadowOpacity * opacityRef.current;
      }

      return;
    }

    // hasAppeared가 false면 아무것도 하지 않음 (완전히 사라진 상태)
    if (!hasAppeared) {
      scaleRef.current = 0;
      opacityRef.current = 0;
      return;
    }

    if (hasAppeared && startTimeRef.current === null) {
      startTimeRef.current = state.clock.elapsedTime;
    }

    const timeSinceStart = startTimeRef.current
      ? state.clock.elapsedTime - startTimeRef.current
      : 0;

    const shouldJump = hasAppeared && timeSinceStart >= 0.1;

    if (shouldJump) {
      const jumpProgress = Math.min((timeSinceStart - 0.1) / 0.8, 1);
      const targetZ = 3.5;
      const startZ = -10;

      const elasticOut = (t: number) => {
        if (t === 0) return 0;
        if (t === 1) return 1;
        const c4 = (2 * Math.PI) / 3;
        return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
      };

      const progress = elasticOut(jumpProgress);
      const animationType = animationTypeRef.current;

      meshRef.current.position.z = startZ + (targetZ - startZ) * progress;

      // 애니메이션 타입별 처리
      if (animationType === 0) {
        // 점핑
        meshRef.current.position.y = Math.sin(jumpProgress * Math.PI) * 2.5;
        meshRef.current.position.x = 0;
        meshRef.current.rotation.y = 0;
        meshRef.current.rotation.z = 0;
        scaleRef.current = 1.0 + Math.sin(jumpProgress * Math.PI) * 0.2;
      } else if (animationType === 1) {
        // Z축 회전 (제자리 빙글빙글)
        meshRef.current.position.y =
          Math.sin(state.clock.elapsedTime * 2) * 0.3;
        meshRef.current.position.x = 0;
        meshRef.current.rotation.y = 0;
        meshRef.current.rotation.z = jumpProgress * Math.PI * 2;
        scaleRef.current = 1.0;
      } else {
        // 좌우 흔들기
        meshRef.current.position.y =
          Math.sin(state.clock.elapsedTime * 2) * 0.3;
        meshRef.current.position.x = Math.sin(jumpProgress * Math.PI * 3) * 1.5;
        meshRef.current.rotation.y = 0;
        meshRef.current.rotation.z = 0;
        scaleRef.current = 1.0;
      }

      opacityRef.current += (1 - opacityRef.current) * 0.1;
    } else {
      scaleRef.current = 0.8;
      opacityRef.current = 0;
      meshRef.current.position.z = -2;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.position.x = 0;
      meshRef.current.rotation.y = 0;
      meshRef.current.rotation.z = 0;
    }

    // 본체 스케일
    meshRef.current.scale.setScalar(scaleRef.current);

    // 미세 glow 스케일 (1.04배)
    glowRef.current.scale.setScalar(scaleRef.current * 1.04);

    // glow 위치와 회전 (캐릭터 따라가기)
    glowRef.current.position.copy(meshRef.current.position);
    glowRef.current.position.z -= 0.01;
    glowRef.current.rotation.copy(meshRef.current.rotation);

    // glow 투명도 (클릭 후에만 미세하게)
    if (glowRef.current.material instanceof THREE.MeshBasicMaterial) {
      glowRef.current.material.opacity = opacityRef.current * 0.5;
    }

    // 그림자 위치와 크기 (캐릭터 아래, y값에 반비례)
    const characterY = meshRef.current.position.y;
    const shadowY = -5.5; // 바닥 고정 위치 (별 바깥쪽)
    const shadowDistance = Math.abs(characterY - shadowY);

    shadowRef.current.position.x = meshRef.current.position.x;
    shadowRef.current.position.y = shadowY;
    shadowRef.current.position.z = meshRef.current.position.z - 0.5;

    // 캐릭터가 높이 올라갈수록 그림자 크기 줄이고 투명하게
    const shadowScale = Math.max(0.6, 1.2 - shadowDistance * 0.15);
    shadowRef.current.scale.setScalar(scaleRef.current * shadowScale);

    if (shadowRef.current.material instanceof THREE.MeshBasicMaterial) {
      const shadowOpacity = Math.max(0.1, 0.4 - shadowDistance * 0.08);
      shadowRef.current.material.opacity = shadowOpacity * opacityRef.current;
    }
  });

  const characterSize = Math.min(viewport.width * 0.4, 8);
  const imageAspect = 500 / 631;

  return (
    <group ref={groupRef}>
      {/* 그림자 (타원형) */}
      <mesh
        ref={shadowRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -5.5, -0.5]}
      >
        <circleGeometry args={[characterSize * 0.3, 32]} />
        <meshBasicMaterial
          color="#000000"
          transparent={true}
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      {/* 미세 glow (클릭 후에만 살짝) */}
      <mesh ref={glowRef} scale={[1.04, 1.04, 1]}>
        <planeGeometry args={[characterSize, characterSize / imageAspect]} />
        <meshBasicMaterial
          map={texture}
          transparent={true}
          color={new THREE.Color("#FF10F0").multiplyScalar(3.5)}
          toneMapped={false}
          opacity={0}
          alphaTest={0.38}
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 본체 (원본 텍스처) */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <planeGeometry args={[characterSize, characterSize / imageAspect]} />
        <meshBasicMaterial
          map={texture}
          transparent={true}
          alphaTest={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
