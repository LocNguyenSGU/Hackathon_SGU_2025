export type ToastType = 'success' | 'error' | 'info';

// Simple toast utility using window object
declare global {
  interface Window {
    __showToast?: (message: string, type: ToastType, duration: number) => void;
  }
}

// Helper functions to show toasts
export const showToast = (message: string, type: ToastType = 'info', duration = 3000) => {
  if (window.__showToast) {
    window.__showToast(message, type, duration);
  } else {
    console.log(`[Toast ${type}]:`, message);
  }
};

export const showSuccessToast = (message: string) => showToast(message, 'success');
export const showErrorToast = (message: string) => showToast(message, 'error');
export const showInfoToast = (message: string) => showToast(message, 'info');
