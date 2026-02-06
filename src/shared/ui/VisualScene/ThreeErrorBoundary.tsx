import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

/**
 * Three.js 렌더링 중 발생하는 예외 상황을 처리하기 위한 에러 바운더리 컴포넌트
 */
export class ThreeErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('=== Three.js Rendering Error ===');
        console.error('Error:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Component stack:', errorInfo.componentStack);
        console.error('================================');
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div style={{ padding: '20px', color: '#ff4d4f', textAlign: 'center' }}>
                    <h3>3D 렌더링 중 오류가 발생했습니다.</h3>
                    <button onClick={() => window.location.reload()}>새로고침</button>
                </div>
            );
        }

        return this.props.children;
    }
}
