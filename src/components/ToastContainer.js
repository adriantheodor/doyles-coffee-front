import React from 'react';
import './ToastContainer.css';

/**
 * Toast Component
 * Individual toast notification
 */
const Toast = ({ toast, onClose, onAction }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ⓘ';
      default:
        return 'ⓘ';
    }
  };

  return (
    <div
      className={`toast toast-${toast.type}`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="toast-icon-wrapper">
        <span className={`toast-icon toast-icon-${toast.type}`}>
          {getIcon()}
        </span>
      </div>

      <div className="toast-content">
        <p className="toast-message">{toast.message}</p>
      </div>

      <div className="toast-actions">
        {toast.action && (
          <button
            className="toast-action-button"
            onClick={() => {
              onAction(toast.id);
              onClose(toast.id);
            }}
          >
            {toast.actionLabel}
          </button>
        )}
        <button
          className="toast-close-button"
          onClick={() => onClose(toast.id)}
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
};

/**
 * ToastContainer Component
 * Displays all active toast notifications
 * Place this once in your app (usually at App.js level)
 */
const ToastContainer = ({ toasts, onRemove, onAction, position = 'bottom-right' }) => {
  return (
    <div className={`toast-container toast-container-${position}`}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={onRemove}
          onAction={onAction}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
