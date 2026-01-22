# Quote to Customer - Architecture & Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  QuotePage.js                                                     │
│  ├─ Form submission                                              │
│  ├─ POST /api/quotes                                             │
│  ├─ Gets quote ID back                                           │
│  └─ Navigate to /quote-confirmation with state                   │
│      (quoteData, quoteId)                                        │
│                                                                   │
│  QuoteConfirmation.js                                            │
│  ├─ Shows success screen                                         │
│  ├─ Offers "Create Account" option                               │
│  ├─ Form validation (password strength)                          │
│  ├─ POST /api/quotes/{id}/convert-to-customer                   │
│  ├─ Stores JWT + user data                                       │
│  ├─ Calls login() from useAuth hook                              │
│  └─ Redirects to /dashboard                                      │
│                                                                   │
│  quoteService.js                                                 │
│  ├─ submitQuote()                                                │
│  ├─ convertQuoteToCustomer()                                     │
│  └─ getQuote()                                                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↕
                    (HTTP/JSON/JWT)
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND (API)                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Quote Routes                                                     │
│  ├─ POST /api/quotes                                             │
│  │  └─ Create quote in database                                  │
│  │     Return: { id, ...quoteData }                              │
│  │                                                                │
│  └─ POST /api/quotes/{id}/convert-to-customer                    │
│     ├─ Validate quote exists                                     │
│     ├─ Validate password                                         │
│     ├─ Check user doesn't exist                                  │
│     ├─ Hash password (bcrypt)                                    │
│     ├─ Create User record                                        │
│     ├─ Create Customer record                                    │
│     ├─ Update Quote status → "converted"                         │
│     ├─ Generate JWT token                                        │
│     └─ Return: { token, user, customer }                         │
│                                                                   │
│  Database                                                         │
│  ├─ Quote collection/table                                       │
│  ├─ User collection/table                                        │
│  └─ Customer collection/table                                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Detailed Sequence Diagram

```
User        Frontend        Backend         Database
 │             │               │                │
 │  1. Submit  │               │                │
 │  Quote      │               │                │
 │──────────→  │               │                │
 │             │  2. POST /api/quotes          │
 │             │──────────────────→            │
 │             │               │  3. Create    │
 │             │               │  Quote record │
 │             │               │───────────────→
 │             │               │                │
 │             │  4. Quote ID + data          │
 │             │  ← ──────────│                │
 │             │  (e.g., 12345)               │
 │             │               │                │
 │ 5. Navigate │               │                │
 │ to          │               │                │
 │ Confirmation│               │                │
 │←────────────│               │                │
 │             │               │                │
 │ 6. Sees success message     │                │
 │    with account creation    │                │
 │    banner                   │                │
 │             │               │                │
 │ 7. Click    │               │                │
 │ "Create     │               │                │
 │ Account"    │               │                │
 │──────────→  │               │                │
 │             │               │                │
 │ 8. Enter    │               │                │
 │ password    │               │                │
 │──────────→  │               │                │
 │             │  9. POST /api/quotes/12345/  │
 │             │     convert-to-customer      │
 │             │     { password: "..." }      │
 │             │──────────────────────────→   │
 │             │               │               │
 │             │               │  10. Validate │
 │             │               │  Quote + User │
 │             │               │               │
 │             │               │ 11. Create   │
 │             │               │  User & Cust │
 │             │               │───────────────→
 │             │               │                │
 │             │               │ 12. Generate  │
 │             │               │  JWT token    │
 │             │               │               │
 │             │ 13. Return JWT + User Data   │
 │             │  ← ──────────│                │
 │             │               │                │
 │ 14. Auto-   │               │                │
 │  login user │               │                │
 │  Store JWT  │               │                │
 │←────────────│               │                │
 │             │               │                │
 │ 15. Redirect│               │                │
 │  to         │               │                │
 │  Dashboard  │               │                │
 │←────────────│               │                │
 │             │               │                │
 │ 16. Use JWT │               │                │
 │  for auth   │               │                │
 │  requests   │               │                │
 │──────────→  │  (with Authorization header) │
 │             │──────────────────→            │
 │             │               │  Authenticated│
 │             │               │  request      │
 │             │  Success      │               │
 │             │  ← ──────────│                │
 │  Data       │               │                │
 │←────────────│               │                │
```

## Component Hierarchy

```
App.js
├─ Router
│  ├─ Navbar
│  │  └─ Navigation links
│  │
│  └─ Routes
│     ├─ Route: /quote
│     │  └─ QuotePage
│     │     ├─ Form fields
│     │     └─ Submit button
│     │
│     └─ Route: /quote-confirmation
│        └─ QuoteConfirmation
│           ├─ Success display
│           │  ├─ Icon animation
│           │  ├─ Success message
│           │  ├─ Details box
│           │  └─ Info banner
│           │
│           ├─ Account creation form (conditional)
│           │  ├─ Email display (disabled)
│           │  ├─ Password input
│           │  ├─ Confirm password input
│           │  └─ Create/Skip buttons
│           │
│           └─ Navigation buttons
│              ├─ Back to Home
│              └─ Learn More About Us
```

## State Flow Diagram

```
QuotePage Component
│
├─ form: {
│  ├─ companyName: ""
│  ├─ contactName: ""
│  ├─ email: ""
│  ├─ phone: ""
│  ├─ address: ""
│  ├─ headcount: ""
│  ├─ services: []
│  └─ notes: ""
│}
│
├─ submitted: false → true
├─ loading: false → true → false
│
└─ handleSubmit()
   └─ POST /api/quotes
      └─ navigate("/quote-confirmation", { state: { quoteData, quoteId } })
         │
         └─ QuoteConfirmation Component
            │
            ├─ quoteData (from location.state)
            ├─ quoteId (from location.state)
            ├─ showCreateAccount: false → true
            ├─ creating: false → true → false
            ├─ createError: ""
            └─ accountForm: {
               ├─ password: ""
               └─ confirmPassword: ""
            }
            │
            └─ handleCreateAccount()
               └─ POST /api/quotes/{id}/convert-to-customer
                  └─ response: { token, user, customer }
                     │
                     └─ localStorage.setItem("accessToken", token)
                        localStorage.setItem("user", JSON.stringify(user))
                        │
                        └─ login(email, password)
                           │
                           └─ navigate("/dashboard")
```

## Data Transformation Flow

```
User Input Form
     ↓
{
  companyName: "Acme Corp",
  contactName: "John Doe",
  email: "john@acme.com",
  phone: "555-1234",
  address: "123 Main St",
  headcount: "50",
  services: ["Coffee & Tea", "Water"],
  notes: "Weekly delivery"
}
     ↓
POST /api/quotes
     ↓
Backend Response (Quote Created)
{
  id: "quote_123",
  ...originalData,
  status: "pending",
  createdAt: "2026-01-22T10:00:00Z"
}
     ↓
Navigate to /quote-confirmation with state
     ↓
User enters password: "SecurePass123"
     ↓
POST /api/quotes/quote_123/convert-to-customer
{
  password: "SecurePass123"
}
     ↓
Backend Processing
  1. Hash password: "SecurePass123" → "$2b$10$..."
  2. Create User:
     {
       email: "john@acme.com",
       name: "John Doe",
       password: "$2b$10$...",
       role: "customer"
     }
  3. Create Customer:
     {
       userId: "user_456",
       companyName: "Acme Corp",
       contactName: "John Doe",
       email: "john@acme.com",
       phone: "555-1234",
       address: "123 Main St",
       headcount: "50",
       requestedServices: ["Coffee & Tea", "Water"],
       quoteId: "quote_123"
     }
  4. Update Quote:
     {
       status: "converted",
       convertedToCustomerId: "customer_789"
     }
  5. Generate JWT:
     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     ↓
Backend Response
{
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: {
    id: "user_456",
    email: "john@acme.com",
    name: "John Doe",
    role: "customer"
  },
  customer: {
    id: "customer_789",
    companyName: "Acme Corp",
    contactName: "John Doe",
    email: "john@acme.com"
  }
}
     ↓
Frontend Processing
  1. Store token: localStorage.setItem("accessToken", token)
  2. Store user: localStorage.setItem("user", JSON.stringify(user))
  3. Update AuthContext: isAuthenticated = true
  4. Redirect to /dashboard
     ↓
User is now logged in with full access
```

## Error Flow Diagram

```
User Input
  │
  ├─ Quote Submission
  │  ├─ Network error → "Error submitting quote"
  │  ├─ 400 response → Backend error message
  │  └─ Success → Confirmation page
  │
  ├─ Account Creation
  │  │
  │  ├─ Password validation (Frontend)
  │  │  ├─ Missing password → "Please enter password"
  │  │  ├─ Too short (< 6) → "At least 6 characters"
  │  │  ├─ Don't match → "Passwords do not match"
  │  │  └─ Valid → Continue
  │  │
  │  └─ Backend call
  │     ├─ Quote not found (404)
  │        → "Quote not found - please resubmit"
  │     │
  │     ├─ User exists (409)
  │        → "Account with this email already exists"
  │     │
  │     ├─ Quote converted (409)
  │        → "This quote already converted"
  │     │
  │     ├─ Invalid password (400)
  │        → Backend validation message
  │     │
  │     ├─ Server error (500)
  │        → "Failed to create account. Try again later"
  │     │
  │     └─ Success (201)
  │        → Auto-login & redirect
```

## Timeline View

```
T0: User arrives at /quote
├─ Page loads
├─ Form renders
└─ User starts typing

T1-T5: User fills form
├─ Form validation (client-side)
├─ All required fields checked
└─ Submit button enabled

T6: User clicks submit
├─ UI shows "Submitting..."
├─ POST /api/quotes sent
└─ Backend processes (500-1000ms)

T7: Backend responds with quote ID
├─ Frontend receives response
├─ Quote data extracted
├─ State set for navigation
└─ Smooth redirect to confirmation

T8: Confirmation page appears
├─ Animations start
├─ Success icon animates in (600ms)
├─ Title types out (600ms)
└─ Content fades in

T9-T15: User reads confirmation
├─ User sees success message
├─ User sees "Create Account" banner
└─ User makes decision

T16: User clicks "Create Account" (or skips)
├─ Form appears
├─ Email field populated
├─ Focus on password field
└─ User ready to enter password

T17-T18: User enters password
├─ User types password
├─ Confirmation field required
└─ Submit button enabled when valid

T19: User clicks "Create Account" button
├─ Form validation runs
├─ POST to convert endpoint
├─ Backend processes (1000-2000ms)
└─ "Creating Account..." shown

T20: Backend returns JWT
├─ Frontend receives token
├─ localStorage updated
├─ login() called
├─ AuthContext updates
└─ 1 second delay for UX

T21: Redirect to dashboard
├─ User sees dashboard loading
├─ Customer data fetched
├─ Navigation available
└─ User has full access

Total time: ~5-8 seconds from submission to dashboard
```

## File Dependencies

```
App.js
├─ imports QuotePage
├─ imports QuoteConfirmation
└─ defines routes

QuotePage.js
├─ imports useNavigate
├─ imports QuoteConfirmation (unused, for future)
└─ calls navigate() to QuoteConfirmation

QuoteConfirmation.js
├─ imports useNavigate
├─ imports useLocation
├─ imports useAuth hook
├─ imports quoteService
├─ imports QuoteConfirmation.css
└─ reads location.state (from QuotePage)

quoteService.js
├─ imports api (axios instance)
└─ provides quote API methods

useAuth hook
├─ provides login() function
└─ provides user context data
```

## Network Request Timeline

```
User Submits Quote
│
└─ POST /api/quotes
   Request: { companyName, contactName, email, ... }
   Response: { id: "123", ...data, status: "pending" }
   Time: ~200-500ms
   
   User sees confirmation
   │
   └─ POST /api/quotes/123/convert-to-customer
      Request: { password: "..." }
      Response: { token: "...", user: {...}, customer: {...} }
      Time: ~500-1000ms
      
      User redirected to dashboard
      │
      └─ GET /api/auth/me (with JWT)
         Headers: Authorization: Bearer <token>
         Response: { user data }
         Time: ~100-200ms
         
      └─ GET /api/customer/dashboard
         Headers: Authorization: Bearer <token>
         Response: { orders, invoices, etc. }
         Time: ~200-500ms
```

---

This architecture ensures:
- ✅ Clean separation of concerns
- ✅ Secure authentication flow
- ✅ Smooth user experience
- ✅ Proper error handling
- ✅ Easy to debug and maintain
