import React from 'react';
import './EmptyState.css';

/**
 * EmptyState Component
 * 
 * Displays a consistent, user-friendly empty state for lists and data views.
 * Provides icons, messaging, and optional actions.
 * 
 * @component
 * @example
 * // Basic usage
 * <EmptyState 
 *   icon="📦"
 *   title="No Orders Yet"
 *   description="Start by placing your first order"
 * />
 * 
 * @example
 * // With action button
 * <EmptyState 
 *   icon="💬"
 *   title="No Messages"
 *   description="You haven't received any messages yet"
 *   actionLabel="Send a Message"
 *   onAction={() => navigate('/contact')}
 * />
 * 
 * @param {string} icon - Emoji or icon to display (suggested: large emoji like "📦")
 * @param {string} title - Main heading for empty state
 * @param {string} description - Description text explaining why it's empty
 * @param {string} [actionLabel] - Optional button label for CTA
 * @param {Function} [onAction] - Optional callback when action button clicked
 * @param {string} [className] - Optional additional CSS classes
 * @returns {React.ReactElement} Empty state container
 */
const EmptyState = ({
  icon = '📭',
  title = 'Nothing Here Yet',
  description = 'Get started by creating or adding something new.',
  actionLabel = null,
  onAction = null,
  className = '',
}) => {
  return (
    <div className={`empty-state ${className}`}>
      {/* Icon */}
      <div className="empty-icon" aria-hidden="true">
        {icon}
      </div>

      {/* Title */}
      <h2 className="empty-title">{title}</h2>

      {/* Description */}
      <p className="empty-description">{description}</p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <button
          className="empty-action-btn mobile-fullwidth-button"
          onClick={onAction}
          aria-label={actionLabel}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
