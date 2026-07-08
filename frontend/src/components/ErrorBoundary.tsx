import { Component } from 'react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('[System Error]', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg">
          <div className="glass-panel p-8 max-w-md w-full mx-4 text-center border-red">
            <div className="sys-font-mono text-[11px] tracking-[4px] text-red mb-4 uppercase">
              [ System Malfunction ]
            </div>
            <h2 className="sys-font-title text-2xl font-bold text-text mb-4">
              Critical Error Detected
            </h2>
            <p className="sys-font-mono text-[11px] text-muted mb-6">
              {this.state.error?.message ?? 'Unknown error'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-purple text-white font-bold sys-font-mono text-sm tracking-[3px] rounded hover:bg-purple2 transition-all uppercase"
            >
              [ Restart System ]
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}