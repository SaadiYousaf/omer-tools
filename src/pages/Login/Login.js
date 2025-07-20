import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import ScrollToTop from "../../components/common/Scroll/ScrollToTop";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginStart());

    setTimeout(() => {
      if (email === "user@example.com" && password === "password123") {
        dispatch(loginSuccess({ email, name: "Test User" }));
        navigate("/");
      } else {
        dispatch(loginFailure("Invalid credentials"));
      }
    }, 1000);
  };

  return (
    <div className="login-container">
      <ScrollToTop />
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
