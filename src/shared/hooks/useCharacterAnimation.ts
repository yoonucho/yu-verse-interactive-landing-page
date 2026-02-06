import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { ASSETS } from "../constants";

interface UseCharacterAnimationProps {
  isExpanded: boolean;
}

export function useCharacterAnimation({
  isExpanded,
}: UseCharacterAnimationProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const shadowRef = useRef<THREE.Mesh>(null);
  // const { viewport } = useThree();

  const [hasAppeared, setHasAppeared] = useState(false);
  const texture = useTexture(ASSETS.IMAGES.YOONU_FULL);
  const backTexture = useTexture(ASSETS.IMAGES.YOONU_BACK);

  // 텍스처 품질 설정
  texture.anisotropy = 16;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const scaleRef = useRef(0);
  const opacityRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const animationTypeRef = useRef<number>(0);
  const isDisappearingRef = useRef(false);
  const hasEmergedRef = useRef(false);

  // Motion Refs
  const motionTypeRef = useRef<string | null>(null);
  const motionStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isExpanded) {
      // 다시 열릴 때: 사라짐 상태 리셋 및 등장 준비
      isDisappearingRef.current = false;
      hasEmergedRef.current = false; // 등장 상태도 리셋해야 처음부터 다시 나옴

      // hasAppeared 상태와 관계없이 강제 리셋하여 애니메이션 재시작
      setHasAppeared(true);
      startTimeRef.current = null;
      animationTypeRef.current = Math.floor(Math.random() * 3);
    } else {
      if (hasAppeared && !isDisappearingRef.current) {
        isDisappearingRef.current = true;
        startTimeRef.current = null;
      }
    }
  }, [isExpanded]);

  useFrame((state) => {
    if (!meshRef.current || !glowRef.current || !shadowRef.current) return;

    if (isDisappearingRef.current) {
      if (startTimeRef.current === null) {
        startTimeRef.current = state.clock.elapsedTime;
      }

      const timeSinceStart = state.clock.elapsedTime - startTimeRef.current;
      const disappearDuration = 2.0;
      const disappearProgress = Math.min(timeSinceStart / disappearDuration, 1);

      const startZ = 3.5;
      const targetZ = 15;

      const easeInQuad = (t: number) => t * t;
      const easedProgress = easeInQuad(disappearProgress);

      meshRef.current.position.z = startZ + (targetZ - startZ) * easedProgress;

      // 회전 로직: 정면(0) -> 뒤(PI) -> 이동 -> 다시 정면(2PI)
      let targetRotation = 0;
      let useBackTexture = false;

      // 1. 초기 0.5초: 뒤로 돌기 (0 -> PI)
      if (disappearProgress < 0.25) {
        const t = disappearProgress / 0.25; // 0~1
        targetRotation = t * Math.PI;
        useBackTexture = t > 0.5; // 90도 넘으면 뒷면
      }
      // 2. 중간 1.0초: 뒤로 돈 채 이동 (PI 유지)
      else if (disappearProgress < 0.75) {
        targetRotation = Math.PI;
        useBackTexture = true;
      }
      // 3. 마지막 0.5초: 다시 정면 보기 (PI -> 2PI)
      else {
        const t = (disappearProgress - 0.75) / 0.25; // 0~1
        targetRotation = Math.PI + t * Math.PI;
        useBackTexture = t < 0.5; // 돌기 시작하면 뒷면 유지하다가 절반 돌면 앞면
      }

      meshRef.current.rotation.y = targetRotation;

      // 점프/바비 제거: 바닥에 고정
      meshRef.current.position.y = 0;

      // X축은 더 빨리 중앙으로 이동 (1.0초, easeOut)
      const startX = -4;
      const targetX = 0;
      const centerDuration = 1.0;
      const centerProgress = Math.min(timeSinceStart / centerDuration, 1);
      const easedCenter = 1 - (1 - centerProgress) * (1 - centerProgress); // easeOutQuad

      meshRef.current.position.x = startX + (targetX - startX) * easedCenter;
      meshRef.current.rotation.z = 0;

      scaleRef.current = 1.0 * (1 - easedProgress * 0.95);

      // 투명도 처리 제거: 계속 보여야 함 (작아진 상태 유지)
      opacityRef.current = 1.0;

      // 텍스처 교체 로직
      if (meshRef.current.material instanceof THREE.MeshBasicMaterial) {
        meshRef.current.material.map = useBackTexture ? backTexture : texture;
        meshRef.current.material.needsUpdate = true;
      }
      if (glowRef.current.material instanceof THREE.MeshBasicMaterial) {
        glowRef.current.material.map = useBackTexture ? backTexture : texture;
        glowRef.current.material.needsUpdate = true;
      }

      // 애니메이션이 끝나도 상태 유지 (리셋하지 않음)
      // disappearProgress >= 1 일 때도 현 상태 유지
      if (disappearProgress >= 1) {
        // 아무것도 하지 않음 (isDisappearingRef.current = true 유지)
      }

      // Update basic transforms for disappearance
      meshRef.current.scale.setScalar(scaleRef.current);
      glowRef.current.scale.setScalar(scaleRef.current * 1.04);
      glowRef.current.position.copy(meshRef.current.position);
      glowRef.current.position.z -= 0.01;
      glowRef.current.rotation.copy(meshRef.current.rotation);

      if (glowRef.current.material instanceof THREE.MeshBasicMaterial) {
        glowRef.current.material.opacity = opacityRef.current * 0.5;
      }

      updateShadow();
      return;
    }

    if (!hasAppeared) {
      scaleRef.current = 0;
      opacityRef.current = 0;
      return;
    }

    if (hasAppeared && startTimeRef.current === null) {
      startTimeRef.current = state.clock.elapsedTime;
    }

    if (motionStartTimeRef.current === -1) {
      motionStartTimeRef.current = state.clock.elapsedTime;
    }

    const timeSinceStart = startTimeRef.current
      ? state.clock.elapsedTime - startTimeRef.current
      : 0;

    if (hasEmergedRef.current) {
      meshRef.current.position.z = 3.5;
      meshRef.current.position.x = -4;
      scaleRef.current = 1.0;
      opacityRef.current = 1.0;
      meshRef.current.rotation.y = 0;
      meshRef.current.rotation.z = 0;

      // --- Motion Logic ---
      if (motionTypeRef.current && motionStartTimeRef.current !== null) {
        const motionElapsed =
          state.clock.elapsedTime - motionStartTimeRef.current;

        if (motionTypeRef.current === "nod") {
          // Nodding: Rotate X up and down
          const duration = 0.5;
          if (motionElapsed < duration * 2) {
            // 2 nods
            meshRef.current.rotation.x =
              Math.sin(motionElapsed * Math.PI * 4) * 0.15;
          } else {
            meshRef.current.rotation.x = 0;
            motionTypeRef.current = null;
          }
        } else if (motionTypeRef.current === "look_up") {
          // Look up: Tilt backward (negative X) slightly
          const duration = 1.5;
          if (motionElapsed < duration) {
            // Smoothly look up and hold, then return
            const progress = Math.min(motionElapsed / duration, 1);
            const angle = Math.sin(progress * Math.PI) * -0.25; // Look up
            meshRef.current.rotation.x = angle;
          } else {
            meshRef.current.rotation.x = 0;
            motionTypeRef.current = null;
          }
        }
      } else {
        meshRef.current.rotation.x = 0;
      }
      // --------------------

      const jumpDuration = 0.6;
      if (timeSinceStart < jumpDuration) {
        const progress = timeSinceStart / jumpDuration;
        const jumpHeight = 1.2;
        meshRef.current.position.y = Math.sin(progress * Math.PI) * jumpHeight;
      } else {
        meshRef.current.position.y = 0;
      }
    } else {
      const shouldJump = hasAppeared && timeSinceStart >= 0.1;

      if (shouldJump) {
        const jumpDuration = 0.6;
        const jumpProgress = Math.min((timeSinceStart - 0.1) / jumpDuration, 1);
        const targetZ = 3.5;
        const startZ = -10;
        const startX = 0;
        const targetX = -4;

        const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);
        const progress = easeOutQuad(jumpProgress);

        const animationType = animationTypeRef.current;

        meshRef.current.position.z = startZ + (targetZ - startZ) * progress;
        meshRef.current.position.x = startX + (targetX - startX) * progress;

        if (animationType === 0) {
          const jumpHeight = 1.2;
          meshRef.current.position.y =
            Math.sin(jumpProgress * Math.PI) * jumpHeight;
          meshRef.current.rotation.y = 0;
          meshRef.current.rotation.z = 0;
          scaleRef.current = 1.0;
        } else if (animationType === 1) {
          meshRef.current.position.y =
            Math.sin(state.clock.elapsedTime * 2) * 0.3;
          meshRef.current.rotation.y = 0;
          meshRef.current.rotation.z = jumpProgress * Math.PI * 2;
          scaleRef.current = 1.0;
        } else {
          meshRef.current.position.y =
            Math.sin(state.clock.elapsedTime * 2) * 0.3;
          meshRef.current.position.x +=
            Math.sin(jumpProgress * Math.PI * 3) * 1.5;
          meshRef.current.rotation.y = 0;
          meshRef.current.rotation.z = 0;
          scaleRef.current = 1.0;
        }

        opacityRef.current += (1 - opacityRef.current) * 0.1;

        if (jumpProgress >= 1) {
          hasEmergedRef.current = true;
        }
      } else {
        scaleRef.current = 0.8;
        opacityRef.current = 0;
        meshRef.current.position.z = -2;
        meshRef.current.position.y =
          Math.sin(state.clock.elapsedTime * 2) * 0.1;
        meshRef.current.position.x = 0;
        meshRef.current.rotation.y = 0;
        meshRef.current.rotation.z = 0;
      }
    }

    meshRef.current.scale.setScalar(scaleRef.current);
    glowRef.current.scale.setScalar(scaleRef.current * 1.04);
    glowRef.current.position.copy(meshRef.current.position);
    glowRef.current.position.z -= 0.01;
    glowRef.current.rotation.copy(meshRef.current.rotation);

    if (glowRef.current.material instanceof THREE.MeshBasicMaterial) {
      glowRef.current.material.opacity = opacityRef.current * 0.5;
    }

    updateShadow();
  });

  const updateShadow = () => {
    if (!meshRef.current || !shadowRef.current) return;
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
  };

  const triggerJump = () => {
    animationTypeRef.current = 0;
    startTimeRef.current = null;
  };

  const triggerMotion = (type: string) => {
    motionTypeRef.current = type;
    motionStartTimeRef.current = null; // Will be set in useFrame if needed, or we rely on clock difference
    // Actually, safer to capture current time in useFrame or reset here if we had access to clock.
    // Let's set it to a flag to capture start time in next frame
    motionStartTimeRef.current = -1; // Flag to reset
  };

  return {
    meshRef,
    glowRef,
    shadowRef,
    hasEmerged: hasAppeared, // Note: returning hasAppeared for visibility, but internally using hasEmergedRef for logic?
    // Original code used `hasAppeared` for DialogueBubble visibility.
    hasInteractableState: hasEmergedRef.current,
    triggerJump,
    triggerMotion,
    texture,
    isDisappearing: isDisappearingRef.current, // 사라지는 중인지 여부 노출
  };
}
