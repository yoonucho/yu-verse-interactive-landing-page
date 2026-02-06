import styles from './Skeleton.module.css';

type SkeletonProps = {
    width?: string | number;
    height?: string | number;
    variant?: 'circle' | 'rect' | 'title' | 'text' | 'button';
    className?: string;
};

/**
 * Skeleton UI 컴포넌트
 * 데이터나 정적 리소스를 불러오는 동안 표시되는 플레이스홀더입니다.
 */
export function Skeleton({
    width,
    height,
    variant = 'rect',
    className = ''
}: SkeletonProps) {
    const style: React.CSSProperties = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
    };

    return (
        <div
            className={`${styles.skeleton} ${styles[variant]} ${className}`}
            style={style}
            aria-hidden="true"
        />
    );
}
