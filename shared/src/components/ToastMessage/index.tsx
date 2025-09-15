import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './ToastMessage.css';

export interface ToastMessageProps {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: (id: string) => void;
}

export const ToastMessage: React.FC<ToastMessageProps> = ({
  id,
  message,
  type = 'info',
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Show animation
    const showTimer = setTimeout(() => setIsVisible(true), 10);
    
    // Auto remove after duration
    const removeTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(removeTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <div className="toast-icon">✓</div>;
      case "error":
        return <div className="toast-icon">✕</div>;
      case "warning":
        return <div className="toast-icon">!</div>;
      case "info":
        return <div className="toast-icon">i</div>;
      default:
        return <div className="toast-icon">?</div>;
    }
  };

  const toastElement = (
    <div 
      className={`toast toast-${type} ${isVisible ? 'toast-show' : ''} ${isRemoving ? 'toast-hide' : ''}`}
      onClick={handleClose}
      role='button'
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleClose();
        }
      }}
    >
      {getIcon()}
      <span>{message}</span>
      <button 
        className="toast-close-btn"
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        aria-label="Close toast"
      >
        ×
      </button>
    </div>
  );

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    toastElement,
    document.body
  );
};
