import React from "react";
import { NavLink, Outlet } from "react-router-dom";

function Layout({ currentUser, onLogout }) {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">📚</div>
          <div>
            <h1>Community Library</h1>
            <span>Management System</span>
          </div>
        </div>

        <nav className="navigation">
          <NavLink to="/dashboard">📊 Dashboard</NavLink>
          <NavLink to="/books">📚 Books</NavLink>
          <NavLink to="/transactions">🔄 Transactions</NavLink>
          <NavLink to="/users">👥 Users</NavLink>
        </nav>

        <div className="sidebar-bottom">
          <div className="logged-user">
            <strong>{currentUser.name}</strong>
            <span>{currentUser.role}</span>
            <small>{currentUser.membershipId}</small>
          </div>
          <button className="logout-button" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
