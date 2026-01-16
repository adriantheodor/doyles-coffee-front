import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE } from "../utils/api";
import "./VerifyEmailPage.css";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("Verifying your email...");

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
        }
      } catch (err) {
        console.error("Email verification error:", err);
        setStatus("error");
        setMessage("An error occurred while verifying your email. Please try again.");
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

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
