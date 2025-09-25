import React from 'react';

interface ErrorBoundaryProps {
    children: React.ReactElement;
    onError: (error: Error) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Lexical Editor Error:', error, errorInfo);
        this.props.onError(error);
    }

    render(): React.ReactElement {
        if (this.state.hasError) {
            return (
                <div className='editor-error-boundary'>
                    <div className='error-message'>
                        <h3>에디터에 오류가 발생했습니다</h3>
                        <p>페이지를 새로고침하거나 다시 시도해주세요.</p>
                        <button
                            onClick={() => this.setState({ hasError: false, error: undefined })}
                            className='error-retry-button'
                        >
                            다시 시도
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
