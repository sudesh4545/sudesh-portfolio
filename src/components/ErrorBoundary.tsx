import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Shown in the fallback so the reader knows which part failed. */
  label: string;
}

interface State {
  error: Error | null;
}

/**
 * Keeps one broken section from blanking the whole page.
 *
 * React has no hook equivalent for `componentDidCatch`, so this stays a class.
 * The fallback is deliberately plain: it says what failed and nothing more —
 * no stack traces, no internal paths leaked to visitors in production.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Dev-only detail; production builds strip this branch's usefulness, not its safety.
    if (import.meta.env.DEV) {
      console.error(`[${this.props.label}] render failed`, error, info.componentStack);
    }
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8">
        <div
          role="alert"
          className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center"
        >
          <p className="font-display text-[0.62rem] font-semibold tracking-[0.22em] text-faint uppercase">
            {this.props.label}
          </p>
          <p className="mt-3 text-[0.9rem] text-muted">
            This section could not be displayed. Everything else on the page still works — try
            reloading.
          </p>
        </div>
      </div>
    );
  }
}
