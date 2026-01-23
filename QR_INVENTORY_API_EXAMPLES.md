# QR Inventory System - Frontend API Examples

This document provides practical examples of how the frontend uses the inventory API endpoints.

## Service File Location
`src/services/inventoryService.js`

## Authentication
All requests include JWT bearer token:
```javascript
Authorization: Bearer {token_from_localStorage}
```

## API Examples

### 1. Creating a Single Inventory Item

**Frontend Code:**
```javascript
import { createInventoryItem } from '../services/inventoryService';

// In component
const handleCreateItem = async () => {
  try {
    const response = await createInventoryItem({
      productId: "507f1f77bcf86cd799439011",
      itemCode: "SKU-001-2024",
      batchNumber: "BATCH-001",
      manufacturingDate: "2024-01-15",
      expiryDate: "2026-01-15",
      notes: "Premium arabica beans"
    });
    
    console.log('Created:', response);
    // response contains:
    // - _id: MongoDB ID
    // - itemCode: SKU
    // - qrCode: URL to scan endpoint
    // - qrCodeDataURL: Base64 PNG image
    // - status: "available"
    // - location: "warehouse"
    // - etc.
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

**Expected Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "productId": "507f1f77bcf86cd799439011",
  "itemCode": "SKU-001-2024",
  "qrCode": "http://api.example.com/api/inventory/scan/SKU-001-2024",
  "qrCodeDataURL": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "status": "available",
  "location": "warehouse",
  "batchNumber": "BATCH-001",
  "manufacturingDate": "2024-01-15T00:00:00.000Z",
  "expiryDate": "2026-01-15T00:00:00.000Z",
  "notes": "Premium arabica beans",
  "scanHistory": [],
  "createdAt": "2024-01-23T10:00:00.000Z",
  "updatedAt": "2024-01-23T10:00:00.000Z"
}
```

### 2. Creating Batch Inventory Items

**Frontend Code:**
```javascript
import { createBatchInventoryItems } from '../services/inventoryService';

const handleCreateBatch = async () => {
  try {
    const response = await createBatchInventoryItems({
      productId: "507f1f77bcf86cd799439011",
      itemCodes: ["SKU-001-2024", "SKU-002-2024", "SKU-003-2024"],
      batchNumber: "BATCH-001",
      manufacturingDate: "2024-01-15",
      expiryDate: "2026-01-15"
    });
    
    console.log('Created:', response.created, 'items');
    console.log('Items:', response.items);
    
    if (response.errors && response.errors.length > 0) {
      console.log('Errors:', response.errors);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

**Expected Response:**
```json
{
  "created": 3,
  "items": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "itemCode": "SKU-001-2024",
      "qrCode": "http://api.example.com/api/inventory/scan/SKU-001-2024",
      "qrCodeDataURL": "data:image/png;base64,...",
      "status": "available",
      "batchNumber": "BATCH-001"
    },
    // ... more items
  ],
  "errors": []
}
```

### 3. Scanning a QR Code

**Frontend Code:**
```javascript
import { scanQRCode } from '../services/inventoryService';

const handleScan = async (itemCode) => {
  try {
    const itemData = await scanQRCode(itemCode);
    
    console.log('Scanned Item:', {
      code: itemData.itemCode,
      product: itemData.productId.name,
      status: itemData.status,
      price: itemData.productId.price,
      scanHistory: itemData.scanHistory
    });
  } catch (error) {
    console.error('Scan failed:', error.message);
  }
};
```

**Expected Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "productId": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Premium Coffee Beans",
    "price": 25.99,
    "description": "Single origin arabica",
    "stock": 150
  },
  "itemCode": "SKU-001-2024",
  "qrCode": "http://api.example.com/api/inventory/scan/SKU-001-2024",
  "status": "available",
  "location": "warehouse",
  "batchNumber": "BATCH-001",
  "manufacturingDate": "2024-01-15T00:00:00.000Z",
  "expiryDate": "2026-01-15T00:00:00.000Z",
  "notes": "Premium arabica beans",
  "assignedToOrder": null,
  "scanHistory": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "scannedAt": "2024-01-23T10:05:30.000Z",
      "scannedBy": "user123",
      "action": "scanned",
      "notes": null
    }
  ],
  "createdAt": "2024-01-23T10:00:00.000Z",
  "updatedAt": "2024-01-23T10:05:30.000Z"
}
```

### 4. Getting QR Code

**Frontend Code:**
```javascript
import { getQRCode } from '../services/inventoryService';

// Get as base64 image (for display/printing)
const getQRAsImage = async (itemCode) => {
  try {
    const { qrCode } = await getQRCode(itemCode, 'image');
    // qrCode is data URL: "data:image/png;base64,..."
    return qrCode;
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Get as URL (for redirects)
const getQRAsURL = async (itemCode) => {
  try {
    const { qrCode } = await getQRCode(itemCode, 'url');
    // qrCode is: "http://api.example.com/api/inventory/scan/SKU-001-2024"
    return qrCode;
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

### 5. Getting Product Inventory

**Frontend Code:**
```javascript
import { getProductInventory } from '../services/inventoryService';

// Get all items for a product
const getAllItems = async (productId) => {
  try {
    const items = await getProductInventory(productId);
    console.log('Total items:', items.length);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Get only available items
const getAvailableItems = async (productId) => {
  try {
    const items = await getProductInventory(productId, 'available');
    console.log('Available items:', items.length);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Get sold items
const getSoldItems = async (productId) => {
  try {
    const items = await getProductInventory(productId, 'sold');
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

**Expected Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "productId": "507f1f77bcf86cd799439011",
    "itemCode": "SKU-001-2024",
    "qrCode": "http://api.example.com/api/inventory/scan/SKU-001-2024",
    "status": "available",
    "location": "warehouse",
    "batchNumber": "BATCH-001",
    "createdAt": "2024-01-23T10:00:00.000Z"
  },
  // ... more items
]
```

### 6. Getting Inventory Statistics

**Frontend Code:**
```javascript
import { getInventoryStats } from '../services/inventoryService';

const handleGetStats = async (productId) => {
  try {
    const stats = await getInventoryStats(productId);
    
    console.log('Inventory Stats:', {
      total: stats.total,
      available: stats.available,
      sold: stats.sold,
      damaged: stats.damaged,
      returned: stats.returned,
      inTransit: stats['in-transit']
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

**Expected Response:**
```json
{
  "available": 45,
  "sold": 20,
  "damaged": 2,
  "returned": 3,
  "in-transit": 5,
  "total": 75
}
```

### 7. Updating Item Status

**Frontend Code:**
```javascript
import { updateInventoryItemStatus } from '../services/inventoryService';

const handleUpdateStatus = async (itemCode) => {
  try {
    const updated = await updateInventoryItemStatus(itemCode, {
      status: 'sold',
      location: 'customer-delivery',
      notes: 'Delivered to Order #ORD-12345'
    });
    
    console.log('Updated item:', updated);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Status options: available, sold, damaged, returned, in-transit
```

**Expected Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "itemCode": "SKU-001-2024",
  "status": "sold",
  "location": "customer-delivery",
  "notes": "Delivered to Order #ORD-12345",
  "updatedAt": "2024-01-23T11:00:00.000Z"
}
```

### 8. Deleting an Item

**Frontend Code:**
```javascript
import { deleteInventoryItem } from '../services/inventoryService';

const handleDeleteItem = async (itemCode) => {
  if (!window.confirm('Are you sure?')) return;
  
  try {
    const response = await deleteInventoryItem(itemCode);
    console.log('Item deleted:', response.message);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

**Expected Response:**
```json
{
  "message": "Inventory item deleted successfully"
}
```

## Error Handling Examples

```javascript
// All service functions throw errors with user-friendly messages

try {
  await scanQRCode('INVALID-CODE');
} catch (error) {
  // error.message = "Item not found"
}

try {
  await createInventoryItem({
    productId: "507f1f77bcf86cd799439011",
    itemCode: "SKU-001-2024" // Already exists
  });
} catch (error) {
  // error.message = "Item code already exists"
}

try {
  await scanQRCode('valid-code');
} catch (error) {
  // Could be authentication error:
  // error.message = "Unauthorized"
  // Or network error:
  // error.message = "Network error"
}
```

## Component Usage Examples

### Using in QRCodeGenerator Component
```javascript
import { createInventoryItem } from '../services/inventoryService';

// Already implemented in component
const handleGenerateQR = async (e) => {
  e.preventDefault();
  try {
    const response = await createInventoryItem({
      productId,
      itemCode: formData.itemCode,
      batchNumber: formData.batchNumber,
      manufacturingDate: formData.manufacturingDate,
      expiryDate: formData.expiryDate,
      notes: formData.notes,
    });
    setGeneratedQR(response);
    toast.success("QR code generated successfully!");
  } catch (error) {
    toast.error(error.message);
  }
};
```

### Using in QRCodeScanner Component
```javascript
import { scanQRCode } from '../services/inventoryService';

// Already implemented in component
const handleScan = async (e) => {
  e.preventDefault();
  try {
    const data = await scanQRCode(itemCode);
    setScannedItem(data);
    toast.success("Item scanned successfully!");
  } catch (err) {
    setError(err.message);
    toast.error(err.message);
  }
};
```

### Using in AdminInventoryPage Component
```javascript
import { 
  getProductInventory, 
  getInventoryStats,
  updateInventoryItemStatus,
  deleteInventoryItem 
} from '../services/inventoryService';

// Already implemented in page
const fetchInventory = async (productId) => {
  try {
    const data = await getProductInventory(productId, status);
    setInventory(data);
  } catch (error) {
    toast.error(error.message);
  }
};
```

## Best Practices

1. **Always use try-catch** for async API calls
2. **Provide user feedback** via toast notifications
3. **Validate input** before sending to API
4. **Handle loading states** with spinners
5. **Cache product data** when possible
6. **Use proper error messages** for debugging
7. **Check authentication** status before API calls
8. **Implement request timeouts** for performance

---

**Last Updated:** January 23, 2026  
**Version:** 1.0.0
