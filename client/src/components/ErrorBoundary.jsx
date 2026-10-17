import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-rose-200 rounded-2xl p-6 shadow-portal text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-2xs">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900">
                Terjadi Kendala Saat Menampilkan Formulir
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Halaman mengalami kendala teknis ringan. Silakan muat ulang formulir untuk melanjutkan.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-left overflow-x-auto text-[11px] font-mono text-slate-600">
                {this.state.error.message}
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E3A8A] hover:bg-blue-900 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer select-none"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Muat Ulang Formulir</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
