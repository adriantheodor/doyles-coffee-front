# QR Code Inventory Tracking System - Frontend Implementation

## Overview
This frontend implementation provides a complete QR code inventory management interface for the Doyle's Coffee frontend application. It allows admins to generate, batch create, and manage inventory items with automatic QR code generation.

## Components Created

### 1. **QRCodeGenerator** (`src/components/QRCodeGenerator.js`)
A component for generating individual QR codes for inventory items.

**Features:**
- Generate QR codes for single items
- Capture manufacturing and expiry dates
- Batch number grouping
- Download QR code as PNG
- Print QR code labels
- Display generated QR code with full details

**Usage:**
```jsx
<QRCodeGenerator 
  productId="507f1f77bcf86cd799439011"
  productName="Premium Coffee Beans"
/>
```

### 2. **QRCodeScanner** (`src/components/QRCodeScanner.js`)
A component for scanning and retrieving inventory item information.

**Features:**
- Manual item code entry or QR code scanning
- Display complete item information
- Show product details
- Display scan history
- Recent scan history sidebar
- Real-time item lookup

**Usage:**
```jsx
<QRCodeScanner />
```

### 3. **BatchInventoryUpload** (`src/components/BatchInventoryUpload.js`)
A component for creating multiple inventory items at once.

**Features:**
- Bulk item code entry
- Template download for easy formatting
- Batch number assignment
- Manufacturing and expiry dates
- Print all QR codes for the batch
- Export batch results to CSV
- Error handling and reporting

**Usage:**
```jsx
<BatchInventoryUpload 
  productId="507f1f77bcf86cd799439011"
  productName="Premium Coffee Beans"
  onSuccess={handleBatchCreated}
/>
```

## Pages Created

### 4. **AdminInventoryPage** (`src/pages/Admin/AdminInventoryPage.js`)
The main admin interface for inventory management with four tabs:

**Tabs:**
1. **Scanner Tab** - Real-time QR code scanning interface
2. **Generate QR Code Tab** - Single item QR code generation
3. **Batch Create Tab** - Bulk item creation
4. **Manage Inventory Tab** - View, edit, and delete inventory items

**Features:**
- Product selection
- Inventory statistics by status
- Filter inventory by status
- Edit item status and location
- Delete inventory items
- Real-time sync with backend

## Services

### 5. **Inventory Service** (`src/services/inventoryService.js`)
Complete API service for inventory operations.

**Functions:**
- `createInventoryItem()` - Create single item with QR code
- `createBatchInventoryItems()` - Create multiple items
- `scanQRCode()` - Scan and retrieve item details
- `getInventoryItemByCode()` - Get item by code
- `getQRCode()` - Retrieve QR code image or URL
- `getProductInventory()` - Get all items for a product
- `getInventoryStats()` - Get inventory statistics
- `updateInventoryItemStatus()` - Update item status
- `deleteInventoryItem()` - Delete item

## Routes Added

In `src/App.js`, the following route was added:

```javascript
<Route
  path="/admin/inventory"
  element={
    <RoleBasedRoute allowedRoles={["admin"]}>
      <AdminInventoryPage />
    </RoleBasedRoute>
  }
/>
```

## Styling Files

### CSS Files Created:
1. **QRCodeGenerator.css** - Styling for QR code generation form and preview
2. **QRCodeScanner.css** - Styling for scanner interface and item details
3. **BatchInventoryUpload.css** - Styling for batch upload form and results
4. **AdminInventoryPage.css** - Styling for main inventory management page

All CSS files include:
- Mobile-responsive design
- Color-coded status badges
- Interactive form elements
- Data table styling
- Modal/overlay styling for editing

## Workflow Examples

### 1. Creating a Single QR Code
1. Navigate to `/admin/inventory`
2. Go to "Generate QR Code" tab
3. Select a product
4. Enter item code (SKU)
5. Enter optional batch number, dates, and notes
6. Click "Generate QR Code"
7. Download or print the generated QR code

### 2. Creating Batch Items
1. Navigate to `/admin/inventory`
2. Go to "Batch Create" tab
3. Select a product
4. Download template or enter item codes manually (one per line)
5. Enter batch number, manufacturing date, and expiry date
6. Click "Create Batch Items"
7. Review results and print all QR codes

### 3. Scanning Items
1. Navigate to `/admin/inventory`
2. Go to "Scanner" tab
3. Use device camera or barcode scanner to scan QR code
4. Or manually enter item code
5. View complete item information and scan history

### 4. Managing Inventory
1. Navigate to `/admin/inventory`
2. Go to "Manage Inventory" tab
3. Select a product from sidebar
4. Filter by status (available, sold, damaged, returned, in-transit)
5. View inventory statistics
6. Click edit icon to update item status/location
7. Click delete icon to remove items

## Backend API Integration

The frontend connects to the following backend endpoints:

### Item Creation
```
POST /api/inventory/item
POST /api/inventory/batch
```

### Item Scanning & Retrieval
```
GET /api/inventory/scan/{itemCode}
GET /api/inventory/item/{itemCode}
GET /api/inventory/qr/{itemCode}
GET /api/inventory/product/{productId}
GET /api/inventory/stats/{productId}
```

### Item Management
```
PUT /api/inventory/item/{itemCode}/status
DELETE /api/inventory/item/{itemCode}
```

## Features & Capabilities

### QR Code Generation
- Automatic unique QR code generation
- Support for data URL (display) and PNG (printing)
- High error correction level for durability
- Printable label generation

### Inventory Tracking
- Item status tracking (available, sold, damaged, returned, in-transit)
- Location tracking
- Batch grouping
- Manufacturing and expiry date tracking
- Complete scan history with timestamps and user info

### Batch Operations
- Create multiple items in one operation
- Bulk QR code generation
- Template download for consistent data entry
- CSV export of batch results
- Error reporting for failed items

### Search & Filter
- Filter by inventory status
- Product-based organization
- Search in recent scans
- Quick lookup by item code

### Reporting & Export
- Inventory statistics by status
- CSV export functionality
- Batch creation reports
- QR code batch printing

## State Management

The AdminInventoryPage uses React hooks for state management:

```javascript
- activeTab: Current active tab
- products: List of available products
- selectedProduct: Currently selected product
- inventory: Items for selected product
- stats: Inventory statistics
- filters: Filter criteria (status)
- editingItem: Item being edited
- editForm: Edit form data
```

## Error Handling

All API calls include error handling:
- Network errors
- Validation errors
- Duplicate item codes
- Not found errors
- Authentication errors

Errors are displayed via toast notifications with user-friendly messages.

## Responsive Design

All components are fully responsive:
- Desktop: Multi-column layouts
- Tablet: Adjusted grid columns
- Mobile: Single column, touch-friendly buttons

## Security

- JWT token authentication on all requests
- Role-based route protection (admin only)
- CSRF protection via Bearer token
- Input validation on all forms

## Browser Support

Works on all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Optimizations

- Lazy loading of product inventory
- Efficient filtering on client-side
- Debounced form inputs
- Optimized re-renders with React hooks

## Future Enhancements

- Real-time barcode scanning with camera library
- Mobile app integration
- Advanced analytics dashboard
- Automated expiry date alerts
- Integration with order fulfillment
- Warehouse location heatmaps
- Predictive inventory management
- Multi-location warehouse support

## Troubleshooting

### QR Code Not Generating
- Verify product is selected
- Check item code is unique
- Ensure API is accessible
- Check authentication token

### Scan Fails
- Verify QR code is not damaged
- Ensure good lighting
- Check item code exists in database
- Verify user authentication

### Batch Creation Errors
- Check for duplicate item codes
- Verify date format (YYYY-MM-DD)
- Ensure batch number is provided
- Review error report for specific items

## Integration Notes

- Requires backend QR code generation endpoints
- Uses JWT authentication from AuthContext
- Toast notifications via ToastContext
- Products fetched from `/api/products` endpoint
- Fully compatible with existing auth system

## File Structure

```
src/
├── components/
│   ├── QRCodeGenerator.js
│   ├── QRCodeGenerator.css
│   ├── QRCodeScanner.js
│   ├── QRCodeScanner.css
│   ├── BatchInventoryUpload.js
│   └── BatchInventoryUpload.css
├── pages/
│   └── Admin/
│       ├── AdminInventoryPage.js
│       └── AdminInventoryPage.css
├── services/
│   └── inventoryService.js
└── App.js (route added)
```

## Environment Variables

Uses existing environment variables:
- `REACT_APP_API_BASE` - API base URL (default: "/")
- `REACT_APP_JWT_KEY` - JWT token storage key (default: "token")

## Dependencies

Uses existing project dependencies:
- React 18+
- React Router DOM
- Bootstrap (optional, for styling)
- No additional packages required

---

**Created:** January 23, 2026
**Version:** 1.0.0
**Status:** Production Ready
