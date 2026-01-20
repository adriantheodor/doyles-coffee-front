import React from 'react';
import './LoadingSpinner.css';

/**
 * LoadingSpinner Component
 * Displays a loading spinner with optional message
 * 
 * @param {object} props
 * @param {string} props.size - Size: 'small', 'medium', 'large' (default: 'medium')
 * @param {string} props.message - Optional loading message text
 * @param {boolean} props.fullScreen - Center on full screen (default: false)
 * @param {string} props.color - Spinner color (default: 'primary')
 * @param {boolean} props.overlay - Show semi-transparent overlay (default: false)
 */
const LoadingSpinner = ({
  size = 'medium',
  message = '',
  fullScreen = false,
  color = 'primary',
  overlay = false,
}) => {
  return (
    <div
      className={`loading-spinner-container ${
        fullScreen ? 'fullscreen' : ''
      } ${overlay ? 'with-overlay' : ''}`}
    >
      <div className={`loading-spinner spinner-${size} spinner-${color}`}>
        <div className="spinner-inner"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;

/**
 * SkeletonLoader Component
 * Shows skeleton/placeholder loading state
 * 
 * @param {object} props
 * @param {number} props.count - Number of skeleton items to show (default: 3)
 * @param {string} props.type - Type: 'row', 'card', 'list' (default: 'row')
 * @param {string} props.height - Height of each skeleton item (default: '20px')
 */
export const SkeletonLoader = ({
  count = 3,
  type = 'row',
  height = '20px',
}) => {
  const skeletons = Array(count).fill(null);

  return (
    <div className={`skeleton-loader skeleton-${type}`}>
      {skeletons.map((_, index) => (
        <div
          key={index}
          className={`skeleton-item skeleton-item-${type}`}
          style={{
            height: type === 'row' ? height : 'auto',
          }}
        >
          <div className="skeleton-pulse"></div>
        </div>
      ))}
    </div>
  );
};

/**
 * InlineLoader Component
 * Compact loading indicator for inline use
 * 
 * @param {object} props
 * @param {boolean} props.isLoading - Show loader (default: false)
 * @param {string} props.text - Loading text (default: 'Loading...')
 * @param {string} props.size - Size: 'xs', 'sm', 'md' (default: 'sm')
 */
export const InlineLoader = ({
  isLoading = false,
  text = 'Loading...',
  size = 'sm',
}) => {
  if (!isLoading) return null;

  return (
    <div className={`inline-loader loader-${size}`}>
      <div className="inline-spinner"></div>
      <span className="loader-text">{text}</span>
    </div>
  );
};

/**
 * ProgressBar Component
 * Shows loading progress
 * 
 * @param {object} props
 * @param {number} props.progress - Progress percentage 0-100 (default: 0)
 * @param {string} props.label - Optional label text
 * @param {string} props.color - Color: 'primary', 'success', 'warning', 'danger' (default: 'primary')
 * @param {boolean} props.striped - Show striped animation (default: false)
 */
export const ProgressBar = ({
  progress = 0,
  label = '',
  color = 'primary',
  striped = false,
}) => {
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="progress-container">
      {label && <div className="progress-label">{label}</div>}
      <div className={`progress-bar-wrapper progress-${color} ${striped ? 'striped' : ''}`}>
        <div
          className="progress-bar-fill"
          style={{
            width: `${normalizedProgress}%`,
          }}
        >
          <span className="progress-text">{normalizedProgress}%</span>
        </div>
      </div>
    </div>
  );
};

/**
 * PageLoader Component
 * Full page loading state with overlay
 * Used when loading entire pages
 * 
 * @param {object} props
 * @param {boolean} props.isLoading - Show loader (default: false)
 * @param {string} props.message - Loading message
 */
export const PageLoader = ({
  isLoading = false,
  message = 'Loading...',
}) => {
  if (!isLoading) return null;

  return (
    <div className="page-loader">
      <div className="page-loader-content">
        <div className="page-loader-spinner"></div>
        <p className="page-loader-message">{message}</p>
      </div>
    </div>
  );
};

/**
 * TableLoader Component
 * Loading state for table data
 * 
 * @param {object} props
 * @param {number} props.rows - Number of skeleton rows (default: 5)
 * @param {number} props.columns - Number of skeleton columns (default: 4)
 */
export const TableLoader = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="table-loader">
      {Array(rows)
        .fill(null)
        .map((_, rowIndex) => (
          <div key={rowIndex} className="table-loader-row">
            {Array(columns)
              .fill(null)
              .map((_, colIndex) => (
                <div key={colIndex} className="table-loader-cell">
                  <div className="skeleton-pulse"></div>
                </div>
              ))}
          </div>
        ))}
    </div>
  );
};

/**
 * ButtonLoader Component
 * Animated dots for button loading state
 * 
 * @param {object} props
 * @param {boolean} props.isLoading - Show loader (default: false)
 * @param {string} props.text - Button text during loading (default: 'Loading')
 */
export const ButtonLoader = ({
  isLoading = false,
  text = 'Loading',
}) => {
  if (!isLoading) return null;

  return (
    <span className="button-loader">
      {text}
      <span className="loader-dots">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </span>
    </span>
  );
};
