# Toast Integration Examples

This file shows real examples of how to integrate toast notifications into existing pages.

## Quick Integration Checklist

- [ ] Import `useToast` hook
- [ ] Call hook in component: `const toast = useToast();`
- [ ] Add toast calls in success/error handlers
- [ ] Test all scenarios (success, error, loading)

---

## Example 1: LoginPage Integration

```jsx
// pages/LoginPage.js
import useToast from '../hooks/useToast';

function LoginPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... existing form
  );
}
```

---

## Example 2: PlaceOrderPage Integration

```jsx
// pages/PlaceOrderPage.js
import useToast from '../hooks/useToast';

function PlaceOrderPage() {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);

    try {
      const res = await api.post('api/orders', orderData);
      toast.success('Order placed successfully!');
      setOrderSuccess(res.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to place order'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // ... existing form
  );
}
```

---

## Example 3: AccountSettingsPage Integration

```jsx
// pages/AccountSettingsPage.js
import useToast from '../hooks/useToast';

function AccountSettingsPage() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async (updatedData) => {
    setIsLoading(true);

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error('Update failed');

      toast.success('Profile updated successfully!');
      setUser(await res.json());
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // ... existing form
  );
}
```

---

## Example 4: CustomerInvoicesPage Integration

```jsx
// pages/CustomerInvoicesPage.jsx
import useToast from '../hooks/useToast';

function CustomerInvoicesPage() {
  const toast = useToast();
  const [isDownloading, setIsDownloading] = useState({});

  const handleDownloadInvoice = async (invoiceId) => {
    setIsDownloading((prev) => ({ ...prev, [invoiceId]: true }));

    try {
      const res = await fetch(`/api/invoices/${invoiceId}/download`);
      if (!res.ok) throw new Error('Download failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceId}.pdf`;
      link.click();

      toast.success('Invoice downloaded!');
    } catch (error) {
      toast.error('Failed to download invoice');
    } finally {
      setIsDownloading((prev) => ({ ...prev, [invoiceId]: false }));
    }
  };

  return (
    // ... existing content
  );
}
```

---

## Example 5: SubmitIssuePage Integration

```jsx
// pages/SubmitIssuePage.js
import useToast from '../hooks/useToast';

function SubmitIssuePage() {
  const toast = useToast();
  const [form, setForm] = useState({ title: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}api/issues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      toast.success('Issue submitted successfully! We will review it soon.');
      setForm({ title: '', description: '' });
    } catch (error) {
      toast.error(error.message || 'Failed to submit issue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // ... existing form
  );
}
```

---

## Example 6: Admin Delete with Undo

```jsx
// pages/Admin/components/IssuesManager.js
import useToast from '../../../hooks/useToast';

function IssuesManager() {
  const toast = useToast();
  const [issues, setIssues] = useState([]);

  const deleteIssue = async (id) => {
    const deletedIssue = issues.find((i) => i._id === id);

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE}api/issues/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Delete failed');

      // Remove from list
      setIssues((prev) => prev.filter((i) => i._id !== id));

      // Show undo option
      toast.addToast({
        message: `Issue "${deletedIssue.title}" deleted`,
        type: 'success',
        duration: 6000,
        action: async () => {
          try {
            // Restore by re-fetching
            const res = await fetch(`${API_BASE}api/issues/${id}`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` },
              body: JSON.stringify(deletedIssue),
            });
            if (res.ok) {
              setIssues((prev) => [...prev, deletedIssue]);
              toast.info('Issue restored');
            }
          } catch (err) {
            toast.error('Failed to restore issue');
          }
        },
        actionLabel: 'Undo',
      });
    } catch (error) {
      toast.error('Failed to delete issue');
      fetchIssues(); // Refresh list
    }
  };

  return (
    // ... existing content
  );
}
```

---

## Example 7: Global Error Handling

```jsx
// utils/apiUtils.js
import useToast from '../hooks/useToast';

export const createAPIErrorHandler = (toast) => {
  return (error, defaultMessage = 'An error occurred') => {
    if (error.response?.status === 401) {
      toast.error('Session expired. Please log in again.');
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (error.response?.status === 404) {
      toast.error('Resource not found.');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else {
      const message = error.response?.data?.message || defaultMessage;
      toast.error(message);
    }
  };
};

// Usage in component:
// const handleError = createAPIErrorHandler(toast);
// try { ... } catch (err) { handleError(err); }
```

---

## Migration Guide for Existing Pages

### Before (using alerts):
```jsx
if (res.ok) {
  alert('Success!');
} else {
  alert('Failed');
}
```

### After (using toasts):
```jsx
import useToast from '../hooks/useToast';

// In component:
const toast = useToast();

if (res.ok) {
  toast.success('Success!');
} else {
  toast.error('Failed');
}
```

---

## Testing Toasts

### Manual Testing Checklist
- [ ] Click buttons that trigger success toast
- [ ] Click buttons that trigger error toast
- [ ] Click warning toast action button
- [ ] Close toast with X button
- [ ] Verify toast auto-dismisses after duration
- [ ] Test on mobile (responsive)
- [ ] Test multiple toasts (should stack)
- [ ] Test undo functionality
- [ ] Verify colors match design
- [ ] Check keyboard accessibility

### Browser DevTools
```javascript
// In console, access toasts directly (if debugging):
// First, you need to have ToastContext available
// This is mainly for dev testing

// Example of what the toast object looks like:
{
  id: 1234567890,
  message: "Operation completed!",
  type: "success",
  action: null,
  actionLabel: "Undo"
}
```

---

## Common Patterns

### Pattern 1: Loading → Success → Dismiss
```jsx
const handleAsyncOperation = async () => {
  const toastId = toast.info('Processing...', 0); // 0 = no auto-dismiss

  try {
    await performAsyncTask();
    toast.removeToast(toastId);
    toast.success('Done!');
  } catch (error) {
    toast.removeToast(toastId);
    toast.error('Failed');
  }
};
```

### Pattern 2: Validation Errors
```jsx
const handleSubmit = (e) => {
  e.preventDefault();

  const errors = validateForm(formData);
  if (Object.keys(errors).length > 0) {
    toast.warning('Please fix the errors below');
    setFormErrors(errors);
    return;
  }

  submitForm();
};
```

### Pattern 3: Batch Operations
```jsx
const handleDeleteMultiple = async (ids) => {
  let successCount = 0;
  let failureCount = 0;

  for (const id of ids) {
    try {
      await deleteItem(id);
      successCount++;
    } catch (error) {
      failureCount++;
    }
  }

  if (successCount > 0) {
    toast.success(`Deleted ${successCount} items`);
  }
  if (failureCount > 0) {
    toast.error(`Failed to delete ${failureCount} items`);
  }
};
```

---

## Next Steps

1. **Audit existing pages** - Find all `alert()` calls
2. **Replace gradually** - Start with critical user flows
3. **Test thoroughly** - Test success and error paths
4. **Gather feedback** - Get user feedback on notifications
5. **Iterate** - Adjust timing, messages, or positioning as needed

