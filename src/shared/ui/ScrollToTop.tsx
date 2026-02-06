import { useState, useEffect, useMemo } from 'react';
import { ArrowUp } from 'lucide-react';
import styles from './ScrollToTop.module.css';
import { throttle } from '../lib/throttle';

/**
 * Scroll To Top Button Component
 * 스크롤이 일정 이상 내려가면 나타나고, 클릭 시 최상단으로 부드럽게 이동합니다.
 */
export function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    // 스크롤 감지 핸들러
    const throttledToggle = useMemo(() =>
        throttle(() => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        }, 150),
        []);

    useEffect(() => {
        window.addEventListener('scroll', throttledToggle);
        return () => window.removeEventListener('scroll', throttledToggle);
    }, [throttledToggle]);

    // 최상단 이동 핸들러
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div className={`${styles.scrollToTopInfo} ${isVisible ? styles.visible : ''}`}>
            <button
                type="button"
                onClick={scrollToTop}
                className={styles.button}
                aria-label="Scroll to top"
            >
                <ArrowUp className={styles.icon} />
            </button>
        </div>
    );
}
