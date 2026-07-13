import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="grid min-h-screen place-items-center bg-ink-50 px-4 text-center dark:bg-ink-950">
        <div>
          <p className="text-4xl">😵</p>
          <h1 className="mt-3 text-lg font-bold text-ink-800 dark:text-ink-100">
            문제가 발생했어요
          </h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            새로고침하면 대부분 해결돼요. 계속되면 알려주세요!
          </p>
          <button
            onClick={() => location.reload()}
            className="mt-4 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
          >
            새로고침
          </button>
        </div>
      </div>
    );
  }
}
