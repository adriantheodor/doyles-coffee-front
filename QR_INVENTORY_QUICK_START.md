# QR Inventory System - Quick Integration Guide

## Quick Start for Developers

### 1. Access the Inventory Management System

The admin inventory management system is now available at:
```
/admin/inventory
```

This page is protected and only accessible by users with the `admin` role.

### 2. Available Tabs

The inventory management page has 4 main sections:

#### Scanner Tab (📱)
- Scan QR codes using device camera or barcode scanner
- Manually enter item codes
- View complete item details
- See scan history
- Track recent scans

#### Generate QR Code Tab (🔲)
- Create individual QR codes for inventory items
- Select product
- Enter item code (SKU)
- Add optional batch number, dates, and notes
- Download or print generated QR code

#### Batch Create Tab (📦)
- Create multiple items at once
- Download template for easy bulk entry
- One item code per line
- Set batch number and dates for all items
- Print all QR codes at once
- Export results as CSV

#### Manage Inventory Tab (📊)
- View all inventory for selected product
- Filter by status (available, sold, damaged, returned, in-transit)
- See inventory statistics
- Edit item status and location
- Delete items
- Real-time updates

### 3. API Integration Points

The following API endpoints must be available on your backend:

**Inventory Item CRUD:**
- `POST /api/inventory/item` - Create single item
- `POST /api/inventory/batch` - Create batch items
- `GET /api/inventory/item/{itemCode}` - Get item by code
- `GET /api/inventory/scan/{itemCode}` - Scan QR code
- `GET /api/inventory/qr/{itemCode}` - Get QR code image
- `PUT /api/inventory/item/{itemCode}/status` - Update status
- `DELETE /api/inventory/item/{itemCode}` - Delete item

**Inventory Queries:**
- `GET /api/inventory/product/{productId}` - Get product inventory
- `GET /api/inventory/stats/{productId}` - Get inventory statistics

**Products:**
- `GET /api/products` - List all products (for product selector)

### 4. File Structure

New files created:

```
src/
├── components/
│   ├── QRCodeGenerator.js          (Single QR generation)
│   ├── QRCodeGenerator.css
│   ├── QRCodeScanner.js            (QR scanning interface)
│   ├── QRCodeScanner.css
│   ├── BatchInventoryUpload.js     (Bulk item creation)
│   └── BatchInventoryUpload.css
├── pages/
│   └── Admin/
│       ├── AdminInventoryPage.js   (Main page)
│       └── AdminInventoryPage.css
├── services/
│   └── inventoryService.js         (API service)
└── App.js                          (Updated with route)
```

### 5. Routes Added

In `App.js`, the following route was added:

```javascript
{/* ADMIN INVENTORY MANAGEMENT */}
<Route
  path="/admin/inventory"
  element={
    <RoleBasedRoute allowedRoles={["admin"]}>
      <AdminInventoryPage />
    </RoleBasedRoute>
  }
/>
```

### 6. Navbar Integration (Optional)

To add a link to the inventory system in the navbar:

```javascript
// In Navbar.js, add this to admin menu
<Link to="/admin/inventory">
  🔲 Inventory Management
</Link>
```

### 7. Authentication

All requests include JWT bearer token from localStorage:
```javascript
Authorization: Bearer {token}
```

The system uses the existing auth context and token storage.

### 8. State Management

The system uses React hooks and contexts:
- `useAuth()` - Get current user and auth state
- `useToast()` - Display notifications
- `useState()` - Component-level state
- `useEffect()` - API calls and side effects

### 9. Error Handling

All components include:
- Toast notifications for errors
- User-friendly error messages
- Loading states
- Empty states when no data available
- Input validation

### 10. Responsive Design

All components are fully responsive:
- Desktop: Multi-column layouts with detailed views
- Tablet: Adjusted grid layouts
- Mobile: Single column, touch-friendly buttons

### 11. Testing the System

1. **Test QR Generation:**
   - Go to Admin Dashboard → Inventory
   - Switch to "Generate QR Code" tab
   - Select a product
   - Enter item code: `TEST-001-2024`
   - Click "Generate QR Code"
   - Verify QR code displays

2. **Test Batch Creation:**
   - Switch to "Batch Create" tab
   - Download template
   - Enter multiple SKUs
   - Create batch
   - Verify items are created

3. **Test Scanning:**
   - Switch to "Scanner" tab
   - Manually enter item code: `TEST-001-2024`
   - Verify item details display

4. **Test Management:**
   - Switch to "Manage Inventory" tab
   - Select product with items
   - Filter by status
   - Try editing an item
   - Verify stats update

### 12. Customization Options

**Change colors/branding:**
- Edit CSS files (`.css` files)
- Update color variables
- Modify status badge colors

**Add custom fields:**
- Extend inventory item schema in backend
- Update API service with new fields
- Add form fields in components

**Modify table columns:**
- Edit table header and row templates in AdminInventoryPage.js
- Adjust grid column widths in CSS
- Add/remove columns as needed

### 13. Performance Tips

- Lazy load products on component mount
- Filter inventory on client-side when possible
- Use pagination for large inventory lists
- Cache product data if frequently accessed

### 14. Debugging

Enable debug logging:
```javascript
// In inventoryService.js, add console logs
console.log('API Request:', { endpoint, data });
console.log('API Response:', response);
```

Check browser console for errors:
- F12 → Console tab
- Look for red error messages
- Check Network tab for failed API calls

### 15. Common Issues

**Issue: "Item not found" when scanning**
- Verify item code matches database
- Check product is correct
- Ensure item hasn't been deleted

**Issue: Can't see inventory items**
- Select a product first
- Check product has items created
- Verify filter isn't hiding items

**Issue: QR code not printing**
- Use Print QR Code button instead of browser print
- Check label paper is inserted
- Try single page at a time

**Issue: Batch creation fails with duplicates**
- Ensure item codes are unique
- Check previous batch didn't already create items
- Review error report for specific codes

### 16. Next Steps

1. Ensure backend API endpoints are deployed and accessible
2. Test all API endpoints using Postman or similar tool
3. Verify JWT token authentication is working
4. Test in different browsers
5. Set up database indexes for performance
6. Configure QR code API_URL in backend for correct scan endpoints

---

## Component Props Reference

### QRCodeGenerator
```javascript
<QRCodeGenerator 
  productId={string}      // Required: MongoDB product ID
  productName={string}    // Required: Display name
/>
```

### QRCodeScanner
```javascript
<QRCodeScanner />
```

### BatchInventoryUpload
```javascript
<BatchInventoryUpload 
  productId={string}              // Required: MongoDB product ID
  productName={string}            // Required: Display name
  onSuccess={function}            // Optional: Callback after success
/>
```

### AdminInventoryPage
```javascript
<AdminInventoryPage />
```

---

**Status:** Ready for Development  
**Last Updated:** January 23, 2026
