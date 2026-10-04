import React, { useState } from "react";

function Login({ onLogin }) {
  const [membershipId, setMembershipId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!membershipId.trim() || !password.trim()) {
      setError("Please enter your membership ID and password.");
      return;
    }

    const result = onLogin(membershipId.trim(), password);

    if (!result.success) {
      setError(result.message);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">📚</div>
        <h1>Community Library</h1>
        <p className="login-subtitle">Library Management System</p>

        <form onSubmit={handleSubmit}>
          <label>Membership ID</label>
          <input
            type="text"
            value={membershipId}
            onChange={(e) => setMembershipId(e.target.value)}
            placeholder="e.g. ADMIN001"
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />

          {error && <div className="error-message">{error}</div>}

          <button className="primary-button full-button" type="submit">
            Login
          </button>
        </form>

        <div className="demo-login">
          <strong>Demo accounts</strong>
          <p>Admin: ADMIN001 / admin123</p>
          <p>Member: MEM001 / member123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
