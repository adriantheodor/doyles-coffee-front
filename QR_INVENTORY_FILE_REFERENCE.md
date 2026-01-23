# QR Inventory System - File Reference Guide

## Quick File Lookup

### Components (src/components/)

#### QRCodeGenerator.js
**Purpose**: Generate and preview single QR codes for inventory items  
**Size**: ~120 lines  
**Exports**: QRCodeGenerator (default)  
**Props**:
- `productId` (string): MongoDB product ID
- `productName` (string): Product display name

**Key Functions**:
- `handleGenerateQR()` - Calls API to create item and QR code
- `handleDownloadQRCode()` - Downloads QR as PNG
- `handlePrintQRCode()` - Opens print dialog for QR

**Dependencies**:
- useToast hook
- createInventoryItem service
- EmptyState component

**Styling**: QRCodeGenerator.css (~270 lines)

---

#### QRCodeScanner.js
**Purpose**: Scan QR codes and retrieve item information  
**Size**: ~235 lines  
**Exports**: QRCodeScanner (default)  
**Props**: None (standalone component)

**Key Functions**:
- `handleScan()` - Scans item code and retrieves data
- `handleClearScan()` - Resets scanner state
- `getStatusColor()` - Maps status to colors

**Key State**:
- `itemCode` - Current scanned/entered code
- `scannedItem` - Full item details
- `scanHistory` - Last 10 scanned items
- `loading`, `error` - State indicators

**Dependencies**:
- useToast hook
- scanQRCode service
- LoadingSpinner component
- EmptyState component

**Styling**: QRCodeScanner.css (~280 lines)

---

#### BatchInventoryUpload.js
**Purpose**: Create multiple inventory items and QR codes at once  
**Size**: ~340 lines  
**Exports**: BatchInventoryUpload (default)  
**Props**:
- `productId` (string): MongoDB product ID
- `productName` (string): Product display name
- `onSuccess` (function, optional): Success callback

**Key Functions**:
- `handleCreateBatch()` - Creates batch of items
- `handleDownloadTemplate()` - Downloads CSV template
- `downloadQRCodes()` - Prints all QR codes
- CSV export functionality

**Key State**:
- `batchData` - Form data (codes, batch number, dates)
- `results` - Batch creation results
- `loading` - Processing state

**Features**:
- One item code per line
- Template download
- Results preview
- Error reporting
- CSV export
- Print all QR codes

**Dependencies**:
- useToast hook
- createBatchInventoryItems service
- LoadingSpinner component

**Styling**: BatchInventoryUpload.css (~330 lines)

---

### Pages (src/pages/Admin/)

#### AdminInventoryPage.js
**Purpose**: Main admin inventory management dashboard  
**Size**: ~504 lines  
**Exports**: AdminInventoryPage (default, named export as function)  
**Props**: None (page component)

**Key Features**:
- 4 Tab System:
  1. Scanner - QR code scanning
  2. Generate - Single QR generation
  3. Batch - Bulk item creation
  4. Manage - Inventory management

**Key State**:
- `activeTab` - Current active tab
- `products` - List of products
- `selectedProduct` - Currently selected product
- `inventory` - Items for product
- `stats` - Inventory statistics
- `filters` - Filter criteria
- `editingItem` - Item being edited
- `editForm` - Edit form data

**Key Functions**:
- `fetchProducts()` - Load products list
- `fetchInventory()` - Load product inventory
- `fetchStats()` - Load inventory statistics
- `handleStatusChange()` - Open edit modal
- `handleSaveStatusChange()` - Save status update
- `handleDeleteItem()` - Delete item with confirmation

**Tab Components**:
- Scanner: <QRCodeScanner />
- Generate: <QRCodeGenerator />
- Batch: <BatchInventoryUpload />
- Manage: Custom table interface

**Dependencies**:
- useToast hook
- All three component imports
- All inventory service functions
- LoadingSpinner component
- EmptyState component

**Styling**: AdminInventoryPage.css (~500 lines)

---

### Services (src/services/)

#### inventoryService.js
**Purpose**: Complete API layer for inventory management  
**Size**: ~173 lines  
**Exports**: 9 named functions

**Functions**:

1. **createInventoryItem(itemData)**
   - POST /api/inventory/item
   - Returns: Created item with QR codes

2. **createBatchInventoryItems(batchData)**
   - POST /api/inventory/batch
   - Returns: { created: number, items: [], errors: [] }

3. **scanQRCode(itemCode)**
   - GET /api/inventory/scan/{itemCode}
   - Returns: Full item data with scan history

4. **getInventoryItemByCode(itemCode)**
   - GET /api/inventory/item/{itemCode}
   - Returns: Item data

5. **getQRCode(itemCode, format)**
   - GET /api/inventory/qr/{itemCode}?format={format}
   - format: 'image' or 'url'
   - Returns: { qrCode: dataURL or URL }

6. **getProductInventory(productId, status)**
   - GET /api/inventory/product/{productId}
   - status: optional filter (available, sold, etc.)
   - Returns: Array of items

7. **getInventoryStats(productId)**
   - GET /api/inventory/stats/{productId}
   - Returns: { available, sold, damaged, returned, in-transit, total }

8. **updateInventoryItemStatus(itemCode, statusData)**
   - PUT /api/inventory/item/{itemCode}/status
   - Returns: Updated item

9. **deleteInventoryItem(itemCode)**
   - DELETE /api/inventory/item/{itemCode}
   - Returns: { message: success }

**Helper Functions**:
- `getAuthHeader()` - Returns headers with JWT token

**Error Handling**:
- All functions use try-catch
- User-friendly error messages
- Throws errors for component handling

**Configuration**:
- Uses REACT_APP_API_BASE environment variable
- Falls back to "/" if not set

---

### CSS Files

#### QRCodeGenerator.css
- `.qr-generator-container` - Main container
- `.qr-generator-form` - Form section
- `.qr-generator-preview` - QR preview
- `.qr-code-display` - QR image display
- `.qr-code-info` - Item information
- `.qr-code-actions` - Download/Print buttons
- `.status-badge` - Status styling
- `.code-block` - Code display

**Responsive**: Yes (tablet, mobile)

---

#### QRCodeScanner.css
- `.qr-scanner-container` - Main container
- `.scanner-section` - Scanner form area
- `.scan-input` - Input field
- `.scanned-item-details` - Item details display
- `.item-section` - Information sections
- `.info-row` - Information rows
- `.status-badge` - Status colors
- `.scan-history-section` - Recent scans sidebar

**Responsive**: Yes (tablet, mobile)

---

#### BatchInventoryUpload.css
- `.batch-upload-container` - Main container
- `.batch-form-section` - Upload form
- `.batch-results-section` - Results display
- `.items-table` - Results table
- `.table-header` / `.table-row` - Table cells
- `.results-summary` - Statistics cards
- `.status-badge` - Status styling

**Responsive**: Yes (tablet, mobile)

---

#### AdminInventoryPage.css
- `.admin-inventory-page` - Main page
- `.tab-navigation` - Tab buttons
- `.tab-content` - Tab content area
- `.product-selector` - Product grid
- `.product-card` - Product items
- `.inventory-management` - Main content
- `.management-sidebar` - Product list
- `.inventory-main` - Content area
- `.inventory-table` - Data table
- `.edit-form-overlay` - Modal dialog
- `.stat-card` - Statistics cards

**Responsive**: Yes (tablet, mobile)

---

### Modified Files

#### src/App.js
**Changes**: 
- Added import: `import AdminInventoryPage from "./pages/Admin/AdminInventoryPage";`
- Added route:
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

---

### Documentation Files

#### QR_INVENTORY_SYSTEM_FRONTEND.md
**Purpose**: Comprehensive feature documentation  
**Content**:
- Overview and features
- Component descriptions
- Page functionality
- Service documentation
- Routes and integration
- Workflow examples
- Backend API summary
- Error handling
- Responsive design info
- Security details

---

#### QR_INVENTORY_QUICK_START.md
**Purpose**: Quick reference for developers  
**Content**:
- Quick start guide
- Available tabs overview
- API integration points
- File structure
- Routes added
- Navbar integration
- Authentication info
- Testing procedures
- Customization options
- Debugging tips
- Common issues
- Component props reference

---

#### QR_INVENTORY_API_EXAMPLES.md
**Purpose**: API usage examples and patterns  
**Content**:
- Service file location
- Authentication details
- 8 API examples with code
- Error handling examples
- Component usage patterns
- Best practices

---

#### QR_INVENTORY_IMPLEMENTATION_COMPLETE.md
**Purpose**: Implementation summary and checklist  
**Content**:
- Overview of what was built
- File inventory and statistics
- Key features list
- Technical details
- Usage instructions
- Backend requirements
- Integration checklist
- Performance notes
- Security features
- Browser support
- Enhancement opportunities
- Deployment notes

---

## File Organization

```
doyles-coffee-front/
├── src/
│   ├── components/
│   │   ├── QRCodeGenerator.js (120 lines)
│   │   ├── QRCodeGenerator.css (270 lines)
│   │   ├── QRCodeScanner.js (235 lines)
│   │   ├── QRCodeScanner.css (280 lines)
│   │   ├── BatchInventoryUpload.js (340 lines)
│   │   ├── BatchInventoryUpload.css (330 lines)
│   │   ├── LoadingSpinner.js (existing)
│   │   ├── EmptyState.js (existing)
│   │   └── ...other components
│   ├── pages/
│   │   └── Admin/
│   │       ├── AdminInventoryPage.js (504 lines)
│   │       ├── AdminInventoryPage.css (500 lines)
│   │       └── ...other admin pages
│   ├── services/
│   │   ├── inventoryService.js (173 lines)
│   │   ├── authService.js (existing)
│   │   └── ...other services
│   ├── App.js (updated)
│   └── ...other files
├── QR_INVENTORY_SYSTEM_FRONTEND.md
├── QR_INVENTORY_QUICK_START.md
├── QR_INVENTORY_API_EXAMPLES.md
└── QR_INVENTORY_IMPLEMENTATION_COMPLETE.md
```

## Size Summary

| Component/File | Lines | Type |
|---|---|---|
| QRCodeGenerator.js | 120 | Component |
| QRCodeScanner.js | 235 | Component |
| BatchInventoryUpload.js | 340 | Component |
| AdminInventoryPage.js | 504 | Page |
| inventoryService.js | 173 | Service |
| QRCodeGenerator.css | 270 | Styling |
| QRCodeScanner.css | 280 | Styling |
| BatchInventoryUpload.css | 330 | Styling |
| AdminInventoryPage.css | 500 | Styling |
| **Total Code** | **2,752** | **Production** |
| **Documentation** | **~1,500** | **Reference** |
| **Grand Total** | **~4,250** | **Complete** |

## Dependencies Summary

### Required (Existing in Project)
- React 18+
- React Router DOM
- react-bootstrap (optional)
- Bootstrap CSS (optional)

### Custom Hooks Used
- `useAuth()` - Authentication context
- `useToast()` - Toast notifications

### Existing Components Used
- `LoadingSpinner` - Loading indicator
- `EmptyState` - Empty state display
- `Navbar` - Navigation (unchanged)
- `RoleBasedRoute` - Route protection

### New Components Created
- `QRCodeGenerator` - Single QR generation
- `QRCodeScanner` - QR scanning
- `BatchInventoryUpload` - Batch creation
- `AdminInventoryPage` - Main page

## Integration Points

### Authentication
- Uses JWT tokens from localStorage
- Bearer token in headers
- Admin role requirement

### API
- Base URL from REACT_APP_API_BASE env var
- 9 inventory endpoints
- Products endpoint (existing)

### Notifications
- Toast notifications via context
- Success/error messages
- Loading indicators

### Routing
- Admin-only route: /admin/inventory
- Role-based protection
- 4 sub-tabs within page

---

**Created**: January 23, 2026  
**Last Updated**: January 23, 2026  
**Status**: Complete and Ready for Use
