# Backend Implementation Example - Node.js/Express

This file provides a concrete implementation example for Node.js/Express backend.
Adapt this code to your specific backend framework and database (MongoDB, PostgreSQL, etc.)

## Prerequisites
- bcryptjs for password hashing
- jsonwebtoken for JWT creation
- Express router setup

## Installation (if needed)
```bash
npm install bcryptjs jsonwebtoken
```

## Express Route Setup

```javascript
// routes/quotes.js
const express = require('express');
const router = express.Router();
const { convertQuoteToCustomer } = require('../controllers/quoteController');
const { authenticate } = require('../middleware/auth'); // Optional

// Convert quote to customer account
router.post('/:quoteId/convert-to-customer', convertQuoteToCustomer);

module.exports = router;
```

## Controller Implementation

```javascript
// controllers/quoteController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Quote = require('../models/Quote');
const User = require('../models/User');
const Customer = require('../models/Customer');

/**
 * Convert a quote to a customer with auto-created user account
 * POST /api/quotes/:quoteId/convert-to-customer
 * Body: { password: string }
 */
exports.convertQuoteToCustomer = async (req, res) => {
  try {
    const { quoteId } = req.params;
    const { password } = req.body;

    // ========== 1. Validation ==========
    
    // Validate password is provided
    if (!password) {
      return res.status(400).json({
        message: "Password is required"
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    // ========== 2. Find Quote ==========
    
    const quote = await Quote.findById(quoteId);
    
    if (!quote) {
      return res.status(404).json({
        message: "Quote not found"
      });
    }

    // Check if already converted
    if (quote.status === "converted") {
      return res.status(409).json({
        message: "This quote has already been converted to a customer account"
      });
    }

    // ========== 3. Check User Doesn't Exist ==========
    
    const existingUser = await User.findOne({ email: quote.email });
    
    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists. Please login or use a different email."
      });
    }

    // ========== 4. Hash Password ==========
    
    const hashedPassword = await bcrypt.hash(password, 10);

    // ========== 5. Create User ==========
    
    const newUser = await User.create({
      email: quote.email,
      name: quote.contactName,
      password: hashedPassword,
      role: "customer",
      emailVerified: true, // Auto-verify since they provided info
      createdFrom: "quote_conversion",
      createdAt: new Date()
    });

    // ========== 6. Create Customer ==========
    
    const newCustomer = await Customer.create({
      userId: newUser._id,
      companyName: quote.companyName,
      contactName: quote.contactName,
      email: quote.email,
      phone: quote.phone || null,
      address: quote.address || null,
      headcount: quote.headcount || null,
      requestedServices: quote.services || [],
      quoteId: quote._id,
      notes: quote.notes || null,
      status: "active",
      createdAt: new Date()
    });

    // ========== 7. Update Quote Status ==========
    
    quote.status = "converted";
    quote.convertedToCustomerId = newCustomer._id;
    quote.convertedAt = new Date();
    await quote.save();

    // ========== 8. Generate JWT Token ==========
    
    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
        role: newUser.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // ========== 9. Send Response ==========
    
    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        emailVerified: newUser.emailVerified
      },
      customer: {
        id: newCustomer._id,
        companyName: newCustomer.companyName,
        contactName: newCustomer.contactName,
        email: newCustomer.email,
        phone: newCustomer.phone,
        address: newCustomer.address
      }
    });

  } catch (error) {
    console.error('Quote conversion error:', error);
    
    // Handle specific error types
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: "Validation error: " + Object.values(error.errors)[0].message
      });
    }

    if (error.code === 11000) { // MongoDB duplicate key
      return res.status(409).json({
        message: "This email is already registered"
      });
    }

    return res.status(500).json({
      message: "Failed to create account. Please try again later."
    });
  }
};
```

## Mongoose Models

### Quote Model

```javascript
// models/Quote.js
const quoteSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  contactName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  phone: String,
  address: String,
  headcount: String,
  services: [String],
  notes: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'converted', 'rejected'],
    default: 'pending'
  },
  convertedToCustomerId: mongoose.Schema.Types.ObjectId,
  convertedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Quote', quoteSchema);
```

### User Model (extended)

```javascript
// models/User.js
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  createdFrom: {
    type: String,
    enum: ['registration', 'quote_conversion', 'admin_created'],
    default: 'registration'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
```

### Customer Model (if separate from User)

```javascript
// models/Customer.js
const customerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  companyName: {
    type: String,
    required: true
  },
  contactName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: String,
  address: String,
  headcount: String,
  requestedServices: [String],
  quoteId: mongoose.Schema.Types.ObjectId,
  notes: String,
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Customer', customerSchema);
```

## Alternative: PostgreSQL/Sequelize Example

```javascript
// controllers/quoteController.js (PostgreSQL version)
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Quote, User, Customer } = require('../models');

exports.convertQuoteToCustomer = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { quoteId } = req.params;
    const { password } = req.body;

    // Validation
    if (!password || password.length < 6) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    // Find quote
    const quote = await Quote.findByPk(quoteId, { transaction });
    if (!quote) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Quote not found"
      });
    }

    if (quote.status === "converted") {
      await transaction.rollback();
      return res.status(409).json({
        message: "Quote already converted"
      });
    }

    // Check user exists
    const existingUser = await User.findOne({
      where: { email: quote.email },
      transaction
    });

    if (existingUser) {
      await transaction.rollback();
      return res.status(409).json({
        message: "User with this email already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      email: quote.email,
      name: quote.contactName,
      password: hashedPassword,
      role: "customer",
      emailVerified: true,
      createdFrom: "quote_conversion"
    }, { transaction });

    // Create customer
    const newCustomer = await Customer.create({
      userId: newUser.id,
      companyName: quote.companyName,
      contactName: quote.contactName,
      email: quote.email,
      phone: quote.phone,
      address: quote.address,
      headcount: quote.headcount,
      requestedServices: quote.services,
      quoteId: quote.id,
      status: "active"
    }, { transaction });

    // Update quote
    quote.status = "converted";
    quote.convertedToCustomerId = newCustomer.id;
    quote.convertedAt = new Date();
    await quote.save({ transaction });

    // Generate token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    await transaction.commit();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      },
      customer: {
        id: newCustomer.id,
        companyName: newCustomer.companyName,
        email: newCustomer.email
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error:', error);
    res.status(500).json({
      message: "Failed to create account"
    });
  }
};
```

## Environment Variables Needed

```bash
# .env
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRES_IN=7d
NODE_ENV=development
MONGO_URI=mongodb://... (or DATABASE_URL for PostgreSQL)
```

## Testing with cURL

```bash
# 1. Submit quote first
curl -X POST http://localhost:5000/api/quotes \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Acme Corp",
    "contactName": "John Doe",
    "email": "john@acme.com",
    "phone": "555-1234",
    "address": "123 Main St",
    "headcount": "50",
    "services": ["Coffee & Tea", "Water"],
    "notes": "Interested in weekly delivery"
  }'

# Response will include quoteId: "abc123def456"

# 2. Convert to customer
curl -X POST http://localhost:5000/api/quotes/abc123def456/convert-to-customer \
  -H "Content-Type: application/json" \
  -d '{
    "password": "SecurePassword123"
  }'

# Response includes JWT token for auto-login
```

## Testing with Postman

1. Create new POST request to: `{{baseUrl}}/api/quotes/{{quoteId}}/convert-to-customer`
2. Headers:
   - Content-Type: application/json
3. Body (raw JSON):
   ```json
   {
     "password": "TestPassword123"
   }
   ```
4. Click Send
5. Expected response code: 201 (Created)

## Error Scenarios to Test

1. **Invalid quote ID** → 404
2. **Quote already converted** → 409
3. **User already exists** → 409
4. **Missing password** → 400
5. **Weak password** → 400
6. **Database error** → 500

## Security Checklist

- [x] Password is hashed with bcrypt
- [x] JWT token is generated with secret
- [x] Email validation for duplicates
- [x] Password minimum length enforced
- [x] Error messages don't leak sensitive info
- [x] Transaction used to ensure data consistency
- [x] Logging for debugging/auditing
- [ ] Rate limiting on this endpoint
- [ ] CORS properly configured
- [ ] HTTPS required in production

## Next Steps

1. Copy this code into your backend
2. Adjust models/database schema as needed
3. Install dependencies
4. Test with cURL/Postman
5. Update frontend with actual API_BASE URL
6. E2E test full flow: Quote → Account Creation → Login → Dashboard
