# Quote to Customer Conversion - Backend Implementation Guide

## Overview
This document outlines the backend changes needed to support converting quotes into customer accounts with auto-generated user credentials.

## Frontend Changes Completed
✅ Created `QuoteConfirmation.js` - Enhanced confirmation UI with account creation option
✅ Created `quoteService.js` - Service layer for quote operations
✅ Updated `QuotePage.js` - Passes quote data to confirmation screen
✅ Updated `App.js` - Added `/quote-confirmation` route
✅ Enhanced CSS - Account creation form styling

## Backend Requirements

### 1. **New API Endpoint: Convert Quote to Customer**

**Endpoint:** `POST /api/quotes/{quoteId}/convert-to-customer`

**Request Body:**
```json
{
  "password": "user_password_string"
}
```

**Response on Success (200):**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "contact_email@company.com",
    "name": "Contact Name",
    "role": "customer",
    "emailVerified": false
  },
  "customer": {
    "id": "customer_id",
    "companyName": "Company Name",
    "contactName": "Contact Name",
    "email": "contact_email@company.com",
    "phone": "phone_number",
    "address": "office_address",
    "headcount": "employee_count",
    "requestedServices": ["Coffee & Tea", "Water"],
    "notes": "Additional notes"
  }
}
```

**Response on Error (400/404/409):**
```json
{
  "message": "Error description - e.g., 'Quote not found', 'User already exists for this email'"
}
```

### 2. **Implementation Steps**

#### Step 1: Quote Model Enhancement
Ensure your Quote model has:
- `id` / `_id` (MongoDB ObjectId or UUID)
- `companyName`
- `contactName`
- `email` (unique per quote or allow duplicates)
- `phone`
- `address`
- `headcount`
- `services` (array)
- `notes`
- `status` (e.g., "pending", "converted", "approved")
- `createdAt`

#### Step 2: Quote Conversion Logic
Create a new controller method (e.g., `convertQuoteToCustomer`) that:

1. **Validate Input:**
   - Verify quote exists and hasn't been converted already
   - Check password meets requirements (min 6 chars recommended)
   - Check if user with this email already exists

2. **Create User Account:**
   - Create a new User record with:
     - `email`: from quote data
     - `name`: from quote's `contactName`
     - `password`: hashed version of provided password
     - `role`: "customer"
     - `emailVerified`: false (optional - can set to true if desired)
   
3. **Create Customer Record:**
   - Create a new Customer record with:
     - `userId`: link to newly created user
     - `companyName`: from quote
     - `contactName`: from quote
     - `email`: from quote
     - `phone`: from quote
     - `address`: from quote
     - `headcount`: from quote
     - `requestedServices`: from quote's `services`
     - `quoteId`: link back to original quote
     - Additional customer fields as needed

4. **Update Quote Status:**
   - Set quote `status` to "converted"
   - Optionally add `convertedToCustomerId` reference

5. **Generate JWT Token:**
   - Create and return JWT token for immediate login
   - Set appropriate expiry (e.g., 24 hours, 7 days)

6. **Return Response:**
   - Return the JWT token
   - Return user data (without password)
   - Return customer data for reference

#### Step 3: Error Handling
Return appropriate HTTP status codes:
- `404` - Quote not found
- `409` - User already exists for this email
- `400` - Invalid password format
- `422` - Quote already converted

### 3. **Security Considerations**

1. **Password Hashing:**
   - Use bcrypt or similar (minimum salt rounds: 10)
   - Never store plaintext passwords

2. **Email Verification:**
   - Consider whether converted customers should skip email verification
   - Or send verification email with auto-token
   - Recommendation: Auto-verify or send confirmation email

3. **Rate Limiting:**
   - Implement rate limiting on this endpoint (e.g., max 5 attempts per IP per hour)
   - Prevent brute force attempts

4. **Validation:**
   - Validate password strength (min length, complexity requirements)
   - Validate quote data before using it

### 4. **Example Implementation Pseudocode**

```javascript
// Backend pseudocode (adjust for your framework/language)

async convertQuoteToCustomer(quoteId, { password }) {
  // 1. Find quote
  const quote = await Quote.findById(quoteId);
  if (!quote) throw new NotFoundError("Quote not found");
  
  if (quote.status === "converted") {
    throw new ConflictError("Quote already converted to customer");
  }

  // 2. Check if user exists
  const existingUser = await User.findOne({ email: quote.email });
  if (existingUser) {
    throw new ConflictError("User already exists for this email");
  }

  // 3. Validate password
  if (!password || password.length < 6) {
    throw new ValidationError("Password must be at least 6 characters");
  }

  // 4. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 5. Create user
  const newUser = await User.create({
    email: quote.email,
    name: quote.contactName,
    password: hashedPassword,
    role: "customer",
    emailVerified: true // or false, your choice
  });

  // 6. Create customer
  const newCustomer = await Customer.create({
    userId: newUser._id,
    companyName: quote.companyName,
    contactName: quote.contactName,
    email: quote.email,
    phone: quote.phone,
    address: quote.address,
    headcount: quote.headcount,
    requestedServices: quote.services,
    quoteId: quote._id
  });

  // 7. Update quote status
  quote.status = "converted";
  quote.convertedToCustomerId = newCustomer._id;
  await quote.save();

  // 8. Generate JWT
  const token = generateJWT(newUser);

  // 9. Return response
  return {
    token,
    user: {
      id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    },
    customer: {
      id: newCustomer._id,
      companyName: newCustomer.companyName,
      contactName: newCustomer.contactName,
      email: newCustomer.email
    }
  };
}
```

### 5. **Testing Recommendations**

1. Test successful conversion with valid quote
2. Test error cases:
   - Non-existent quote ID
   - Quote already converted
   - User already exists with same email
   - Invalid/weak password
3. Verify JWT token is valid and can authenticate requests
4. Verify both User and Customer records are created correctly
5. Test email notifications if implemented

### 6. **Future Enhancements**

- **Email Notifications:**
  - Send confirmation email to converted customer
  - Include account details and login link

- **Admin Dashboard:**
  - Show quote conversion status
  - Track which quotes became customers
  - Analytics on conversion rates

- **Approval Workflow:**
  - Admin must approve quote before customer can convert
  - Add `approvedAt` and `approvedBy` fields

- **Quote Expiry:**
  - Add `expiresAt` field to quotes
  - Prevent conversion of expired quotes

- **Services Mapping:**
  - Create Customer-Service relationship table
  - Track which services customer actually uses

## Frontend Service Usage

The frontend calls the conversion endpoint like this:

```javascript
// From QuoteConfirmation.js
const response = await quoteService.convertQuoteToCustomer(quoteId, {
  password: accountForm.password
});

// Response includes:
// - token: JWT for authentication
// - user: User object
// - customer: Customer object
```

After successful conversion, the user is:
1. Automatically logged in
2. Redirected to customer dashboard
3. Can immediately access their account and quote details

---

**Status:** Ready for backend implementation
**Priority:** High - enables automated customer onboarding
**Estimated Backend Work:** 2-4 hours
