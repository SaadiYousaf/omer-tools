import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser ,googleSignIn} from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      navigate("/");
    }
  };
 const handleGoogleSuccess = async (credentialResponse) => {
    const result = await dispatch(googleSignIn({ 
      idToken: credentialResponse.credential 
    }));
    
    if (googleSignIn.fulfilled.match(result)) {
      navigate("/");
    }
  };

  const handleGoogleError = () => {
  };
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    <div className="login-page-container">
      <div className="login-content-wrapper">
        <div className="login-left-panel">
          <div className="login-promo-content">
            <h2>Welcome Back!</h2>
            <p>
              Sign in to access exclusive deals, track your orders, and manage
              your account preferences.
            </p>
            <div className="login-benefits">
              <div className="benefit-item">
                <span className="benefit-icon">✓</span>
                <span>Fast checkout</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">✓</span>
                <span>Order history</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">✓</span>
                <span>Personalized recommendations</span>
              </div>
            </div>
          </div>
        </div>

        <div className="login-right-panel">
          <div className="login-form-container">
            <div className="login-header">
              <h2>Sign In to Your Account</h2>
              <p>Enter your details below to continue</p>
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {typeof error === "string"
                  ? error
                  : error.message ||
                    (Array.isArray(error.errors)
                      ? error.errors.join(", ")
                      : JSON.stringify(error))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="form-group">
                <div className="password-label-container">
                  <label htmlFor="password">Password</label>
                  <a href="/forgot-password" className="forgot-password-link">
                    Forgot password?
                  </a>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="login-submit-btn"
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="login-divider">
              <span>Or continue with</span>
            </div>

            <div className="social-login-options">
               <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="filled_blue"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  width="100%"
                />
            </div>

            <div className="signup-redirect">
              Don't have an account?{" "}
              <a href="/register" className="signup-link">
                Create one now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
