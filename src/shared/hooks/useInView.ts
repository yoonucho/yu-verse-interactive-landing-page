import { useEffect, useRef, useState } from "react";

/**
 * Intersection Observer 훅
 * 요소가 뷰포트에 진입했는지 감지하여 성능을 최적화합니다.
 */

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

interface UseInViewReturn {
  ref: React.RefObject<HTMLDivElement | null>;
  isVisible: boolean;
  hasBeenVisible: boolean;
}

export function useInView(options: UseInViewOptions = {}): UseInViewReturn {
  const { threshold = 0.1, rootMargin = "0px", once = false } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasBeenVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once]);

  return { ref, isVisible, hasBeenVisible };
}
