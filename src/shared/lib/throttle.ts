/**
 * 간단한 쓰로틀(Throttle) 유틸리티 함수
 * 이벤트를 일정 시간 간격으로 실행되도록 제한합니다.
 */
export function throttle<T extends (...args: any[]) => void>(func: T, limit: number): T {
    let inThrottle: boolean;
    return function (this: any, ...args: any[]) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    } as T;
}
