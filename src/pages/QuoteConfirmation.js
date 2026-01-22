import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import quoteService from "../services/quoteService";
import "./QuoteConfirmation.css";

export default function QuoteConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [displayText, setDisplayText] = useState("");
  const fullText = "Your quote request has been submitted!";
  
  // Account creation state
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [accountForm, setAccountForm] = useState({
    password: "",
    confirmPassword: "",
  });
  
  // Get quote data from location state (passed from QuotePage)
  const quoteData = location.state?.quoteData;
  const quoteId = location.state?.quoteId;

  // Typing animation effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const handleCreateAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCreateError("");
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!accountForm.password || !accountForm.confirmPassword) {
      setCreateError("Please enter and confirm a password");
      return;
    }
    
    if (accountForm.password !== accountForm.confirmPassword) {
      setCreateError("Passwords do not match");
      return;
    }
    
    if (accountForm.password.length < 6) {
      setCreateError("Password must be at least 6 characters");
      return;
    }

    setCreating(true);
    setCreateError("");

    try {
      // Call backend to convert quote to customer
      const response = await quoteService.convertQuoteToCustomer(quoteId, {
        password: accountForm.password,
        // Backend will use quote data (email, contactName) to create the account
      });

      // Auto-login the user
      if (response.token && response.user) {
        localStorage.setItem("accessToken", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        
        // Trigger login in auth context
        await login(quoteData.email, accountForm.password);
        
        // Redirect to customer dashboard
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 1000);
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to create account. Please try again.";
      setCreateError(errorMsg);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="quote-confirmation-container">
      <div className="quote-confirmation-card">
        {!showCreateAccount ? (
          <>
            {/* Success Icon */}
            <div className="confirmation-icon-wrapper">
              <div className="confirmation-icon">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="32" cy="32" r="30" fill="#3a7842" opacity="0.1" />
                  <path
                    d="M26 32L30 36L38 28"
                    stroke="#3a7842"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Title with typing animation */}
            <h2 className="confirmation-title">{displayText}</h2>

            {/* Subtitle */}
            <p className="confirmation-subtitle">
              Thank you for your interest in our services. We've received your quote request and will review it carefully.
            </p>

            {/* Key Details Box */}
            <div className="confirmation-details">
              <div className="detail-item">
                <span className="detail-icon">📧</span>
                <div>
                  <p className="detail-label">Confirmation Sent</p>
                  <p className="detail-text">Check your email for a confirmation</p>
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-icon">⏱️</span>
                <div>
                  <p className="detail-label">Next Steps</p>
                  <p className="detail-text">We'll contact you within 24-48 hours</p>
                </div>
              </div>
            </div>

            {/* Create Account Option */}
            <div className="create-account-banner">
              <p className="banner-text">💡 Get instant access to your quote details and order history</p>
              <button
                className="btn-create-account"
                onClick={() => setShowCreateAccount(true)}
              >
                Create Your Account
              </button>
            </div>

            {/* Action Buttons */}
            <div className="confirmation-actions">
              <button
                className="btn-primary"
                onClick={() => navigate("/")}
              >
                Back to Home
              </button>
              <button
                className="btn-secondary"
                onClick={() => navigate("/about")}
              >
                Learn More About Us
              </button>
            </div>

            {/* Footer Note */}
            <p className="confirmation-footer">
              Questions? <a href="mailto:contact@doylescoffee.com">Contact us</a>
            </p>
          </>
        ) : (
          <>
            {/* Account Creation Form */}
            <div className="create-account-container">
              <h2 className="create-account-title">Create Your Account</h2>
              <p className="create-account-subtitle">
                Set up your account using the email from your quote ({quoteData?.email})
              </p>

              {createError && (
                <div className="create-account-error">{createError}</div>
              )}

              <form onSubmit={handleCreateAccount} className="create-account-form">
                <div className="form-group">
                  <label htmlFor="email-display" className="form-label">
                    Email Address
                  </label>
                  <input
                    id="email-display"
                    type="email"
                    value={quoteData?.email || ""}
                    disabled
                    className="form-input disabled"
                  />
                  <small className="form-hint">From your quote submission</small>
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Enter a password"
                    value={accountForm.password}
                    onChange={handleCreateAccountChange}
                    disabled={creating}
                    className="form-input"
                    required
                  />
                  <small className="form-hint">At least 6 characters</small>
                </div>

                <div className="form-group">
                  <label htmlFor="confirm-password" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={accountForm.confirmPassword}
                    onChange={handleCreateAccountChange}
                    disabled={creating}
                    className="form-input"
                    required
                  />
                </div>

                <div className="create-account-actions">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={creating}
                  >
                    {creating ? "Creating Account..." : "Create Account"}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowCreateAccount(false)}
                    disabled={creating}
                  >
                    Skip for Now
                  </button>
                </div>
              </form>

              <p className="create-account-note">
                You can also create an account later by visiting our login page.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
