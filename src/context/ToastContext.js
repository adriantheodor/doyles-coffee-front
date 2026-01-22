import React, { createContext, useState, useCallback } from 'react';

/**
 * Toast Context - Manages global toast notifications
 * Provides: addToast, removeToast
 */
export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  /**
   * Remove a toast by ID
   */
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  /**
   * Add a new toast notification
   * @param {object} options
   * @param {string} options.message - Toast message (required)
   * @param {string} options.type - Type: 'success', 'error', 'warning', 'info' (default: 'info')
   * @param {number} options.duration - Auto-dismiss duration in ms (default: 4000, 0 = no auto-dismiss)
   * @param {function} options.action - Optional action button callback
   * @param {string} options.actionLabel - Label for action button (default: 'Undo')
   */
  const addToast = useCallback((options) => {
    if (!options.message) {
      console.warn('Toast message is required');
      return;
    }

    const {
      message,
      type = 'info',
      duration = 4000,
      action = null,
      actionLabel = 'Undo',
    } = options;

    const id = Date.now() + Math.random();
    const toast = {
      id,
      message,
      type,
      action,
      actionLabel,
    };

    setToasts((prev) => [...prev, toast]);

    // Auto-dismiss if duration > 0
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  /**
   * Remove all toasts
   */
  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const value = {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,

    // Convenience methods
    success: (message, duration = 4000) =>
      addToast({ message, type: 'success', duration }),
    error: (message, duration = 5000) =>
      addToast({ message, type: 'error', duration }),
    warning: (message, duration = 4000) =>
      addToast({ message, type: 'warning', duration }),
    info: (message, duration = 4000) =>
      addToast({ message, type: 'info', duration }),
    // Persistent toast (no auto-dismiss)
    persistent: (message, type = 'info') =>
      addToast({ message, type, duration: 0 }),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};
