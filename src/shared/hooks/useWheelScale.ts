import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type UseWheelScaleOptions = {
    initial?: number;
    min?: number;
    max?: number;
    step?: number;
    damping?: number;
};

/**
 * 마우스 휠로 스케일 타깃을 바꾸고, 프레임마다 부드럽게 따라가게 합니다.
 * R3F 내부에서 사용해야 하며, 반환값을 group의 scale에 넣으면 됩니다.
 */
export function useWheelScale(options: UseWheelScaleOptions = {}) {
    const {
        initial = 1,
        min = 0.7,
        max = 1.8,
        step = 0.0008,
        damping = 8,
    } = options;
    const targetRef = useRef(initial);
    const currentRef = useRef(initial);
    const clamp = useMemo(
        () => (v: number) => THREE.MathUtils.clamp(v, min, max),
        [min, max],
    );

    useEffect(() => {
        const onWheel = (e: WheelEvent) => {
            // deltaY가 양수면 축소, 음수면 확대 방향입니다.
            const next = targetRef.current - e.deltaY * step;
            targetRef.current = clamp(next);
        };
        window.addEventListener("wheel", onWheel, { passive: true });
        return () => window.removeEventListener("wheel", onWheel);
    }, [clamp, step]);

    useFrame((_, delta) => {
        const t = 1 - Math.exp(-damping * delta);
        currentRef.current = THREE.MathUtils.lerp(
            currentRef.current,
            targetRef.current,
            t,
        );
    });

    return currentRef.current;
}

/**
 * 위 훅과 같은 로직이지만, 리액트 리렌더 없이 ref에 직접 스케일을 적용합니다.
 * groupRef를 넘기면 휠에 즉시 반응합니다.
 * containerRef를 넘기면 해당 컨테이너 안에서만 휠 이벤트가 동작하여 페이지 스크롤을 방지합니다.
 */
export function useWheelScaleOnRef<T extends THREE.Object3D>(
    groupRef: RefObject<T | null>,
    options: UseWheelScaleOptions & { containerRef?: RefObject<HTMLElement | null> } = {},
) {
    const {
        initial = 1,
        min = 0.7,
        max = 1.8,
        step = 0.0008,
        damping = 8,
        containerRef,
    } = options;
    const targetRef = useRef(initial);
    const currentRef = useRef(initial);
    const clamp = useMemo(
        () => (v: number) => THREE.MathUtils.clamp(v, min, max),
        [min, max],
    );

    useEffect(() => {
        const onWheel = (evt: Event) => {
            const e = evt as WheelEvent;

            // deltaY가 양수면 축소(zoom out), 음수면 확대(zoom in)
            const isZoomOut = e.deltaY > 0;
            const isZoomIn = e.deltaY < 0;

            // 이미 최소/최대치에 도달했다면 브라우저 기폴트 스크롤 이벤트를 허용합니다.
            const isAtMin = targetRef.current <= min && isZoomOut;
            const isAtMax = targetRef.current >= max && isZoomIn;

            if (!isAtMin && !isAtMax) {
                // 확대/축소가 가능한 범위 내에서만 페이지 스크롤을 방지합니다.
                e.preventDefault();
                const next = targetRef.current - e.deltaY * step;
                targetRef.current = clamp(next);
            }
        };

        const target = containerRef?.current || window;
        target.addEventListener("wheel", onWheel, { passive: false });
        return () => target.removeEventListener("wheel", onWheel);
    }, [clamp, step, containerRef]);

    useFrame((_, delta) => {
        const t = 1 - Math.exp(-damping * delta);
        currentRef.current = THREE.MathUtils.lerp(
            currentRef.current,
            targetRef.current,
            t,
        );
        if (groupRef.current) {
            groupRef.current.scale.setScalar(currentRef.current);
        }
    });

    return currentRef.current;
}
