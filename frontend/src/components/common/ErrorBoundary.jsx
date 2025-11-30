import React from 'react';
import { Button } from './Button';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="max-w-md w-full text-center space-y-4">
                        <h1 className="text-4xl font-bold text-gray-900">Oops!</h1>
                        <p className="text-gray-600">Something went wrong. We're working on fixing it.</p>
                        <div className="p-4 bg-red-50 text-red-700 rounded-md text-sm text-left overflow-auto max-h-40">
                            {this.state.error?.toString()}
                        </div>
                        <Button onClick={() => window.location.reload()}>
                            Refresh Page
                        </Button>
                        <Button variant="outline" onClick={() => window.location.href = '/'}>
                            Go Home
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
