import { ReactNode } from 'react';
import styles from './Section.module.css';

type SectionVariant = 'light' | 'dark';
type SectionSpacing = 'sm' | 'md' | 'lg';

interface SectionProps {
    children: ReactNode;
    variant?: SectionVariant;
    spacing?: SectionSpacing;
    className?: string;
    as?: 'section' | 'div';
    id?: string;
    'aria-labelledby'?: string;
}

/**
 * 페이지 섹션 래퍼 컴포넌트
 * 일관된 패딩과 배경색을 제공합니다.
 * 
 * @param variant - 'light' (기본) 또는 'dark' 배경
 * @param spacing - 'sm' | 'md' | 'lg' 섹션 간격
 * @param as - 렌더링할 HTML 태그 (기본: 'section')
 */
export function Section({
    children,
    variant = 'light',
    spacing = 'sm',
    className = '',
    as: Component = 'section',
    id,
    'aria-labelledby': ariaLabelledBy,
}: SectionProps) {
    const variantClass = variant === 'dark' ? styles['section--dark'] : styles['section--light'];
    const spacingClass = styles[`section--spacing-${spacing}`];

    return (
        <Component
            id={id}
            aria-labelledby={ariaLabelledBy}
            className={`${styles.section} ${variantClass} ${spacingClass} ${className}`}
        >
            {children}
        </Component>
    );
}
