import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE } from "../utils/api";
import authService from "../services/authService";
import "./VerifyEmailPage.css";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("Verifying your email...");
  const [userEmail, setUserEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState("");
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get("token");

        if (!token) {
          setStatus("error");
          setMessage("Invalid verification link. No token found.");
          return;
        }

        // Call the backend to verify the email
        const response = await fetch(`${API_BASE}api/auth/verify-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage("Email verified successfully! Redirecting to login...");
          
          // Redirect to login after 2 seconds
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setStatus("error");
          setMessage(data.message || "Email verification failed. Please try again.");
          // Try to extract email from token if verification fails
          const emailFromStorage = localStorage.getItem("userEmail");
          if (emailFromStorage) {
            setUserEmail(emailFromStorage);
          }
        }
      } catch (err) {
        console.error("Email verification error:", err);
        setStatus("error");
        setMessage("An error occurred while verifying your email. Please try again.");
        const emailFromStorage = localStorage.getItem("userEmail");
        if (emailFromStorage) {
          setUserEmail(emailFromStorage);
        }
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  // Cooldown timer effect
  useEffect(() => {
    if (cooldownSeconds <= 0) return;

    const timer = setTimeout(() => {
      setCooldownSeconds(cooldownSeconds - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldownSeconds]);

  const handleResendEmail = async () => {
    if (!userEmail) {
      setResendError("Please provide an email address.");
      return;
    }

    setResendLoading(true);
    setResendError("");
    setResendMessage("");

    try {
      await authService.resendVerificationEmail(userEmail);
      setResendMessage(
        "Verification email sent! Please check your inbox (and spam folder)."
      );
      setCooldownSeconds(60); // 60 second cooldown
    } catch (error) {
      console.error("Resend email error:", error);
      setResendError(
        "Failed to resend email. Please try again later."
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="verify-email-page">
      <div className="verify-card">
        {status === "loading" && (
          <>
            <div className="spinner"></div>
            <h1>Verifying Your Email</h1>
            <p className="message">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="success-icon">✓</div>
            <h1>Email Verified!</h1>
            <p className="message success-msg">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="error-icon">✕</div>
            <h1>Verification Failed</h1>
            <p className="message error-msg">{message}</p>

            {/* Resend Email Section */}
            <div className="resend-section">
              <p className="resend-label">Didn't receive the email?</p>
              <input
                type="email"
                placeholder="Enter your email address"
                value={userEmail}
                onChange={(e) => {
                  setUserEmail(e.target.value);
                  setResendError("");
                  setResendMessage("");
                }}
                className="email-input"
                disabled={resendLoading}
              />
              <button
                onClick={handleResendEmail}
                className="resend-btn"
                disabled={resendLoading || cooldownSeconds > 0}
              >
                {resendLoading ? (
                  <>
                    <span className="spinner-small"></span>
                    Sending...
                  </>
                ) : cooldownSeconds > 0 ? (
                  `Resend in ${cooldownSeconds}s`
                ) : (
                  "Resend Verification Email"
                )}
              </button>

              {resendMessage && (
                <p className="message resend-success-msg">{resendMessage}</p>
              )}
              {resendError && (
                <p className="message resend-error-msg">{resendError}</p>
              )}
            </div>

            <button
              onClick={() => navigate("/login")}
              className="verify-btn"
            >
              Go to Login
            </button>
            <p className="help-text">
              If you continue to have issues, please contact support or{" "}
              <button
                onClick={() => navigate("/register")}
                className="link-btn"
              >
                register again
              </button>
              .
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
