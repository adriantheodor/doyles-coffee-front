import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

/**
 * Custom hook to access toast context
 * Usage: const toast = useToast();
 *        toast.success('Operation completed!');
 *        toast.error('Something went wrong');
 *        toast.warning('Are you sure?');
 *        toast.info('Just so you know');
 */
export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      'useToast must be used within a ToastProvider. Make sure ToastProvider wraps your app.'
    );
  }

  return context;
};

export default useToast;
