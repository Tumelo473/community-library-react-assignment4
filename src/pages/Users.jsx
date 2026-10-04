import React from "react";
import { useState } from "react";
import PageHeader from "../components/PageHeader";

const emptyUser = {
  name: "",
  membershipId: "",
  role: "Member",
  password: ""
};

function Users({ users, currentUser, onAdd, onUpdate, onDelete }) {
  const [form, setForm] = useState(emptyUser);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((oldForm) => ({ ...oldForm, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!form.name.trim() || !form.membershipId.trim() || !form.password.trim()) {
      setMessage("Please complete all user fields.");
      return;
    }

    const duplicate = users.some(
      (user) =>
        user.membershipId.toLowerCase() === form.membershipId.trim().toLowerCase() &&
        user.id !== editingId
    );

    if (duplicate) {
      setMessage("That membership ID already exists.");
      return;
    }

    if (editingId) {
      onUpdate({ ...form, id: editingId });
      setMessage("User updated successfully.");
    } else {
      onAdd(form);
      setMessage("User added successfully.");
    }

    setForm(emptyUser);
    setEditingId(null);
  }

  function startEdit(user) {
    setEditingId(user.id);
    setForm({
      name: user.name,
      membershipId: user.membershipId,
      role: user.role,
      password: user.password
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyUser);
    setMessage("");
  }

  function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    const result = onDelete(id);
    setMessage(result.message || "User deleted successfully.");
  }

  return (
    <div>
      <PageHeader
        title="User Management"
        description="Manage library member and administrator accounts."
      />

      <div className="content-card">
        <div className="section-heading">
          <div>
            <h3>{editingId ? "Update User" : "Add New User"}</h3>
            <p>Create accounts using a name, membership ID and role.</p>
          </div>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" />
          </div>

          <div className="form-group">
            <label>Membership ID *</label>
            <input
              name="membershipId"
              value={form.membershipId}
              onChange={handleChange}
              placeholder="e.g. MEM002"
            />
          </div>

          <div className="form-group">
            <label>Role *</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
              <option value="Librarian">Librarian</option>
            </select>
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
            />
          </div>

          <div className="form-actions">
            <button className="primary-button" type="submit">
              {editingId ? "Update User" : "Add User"}
            </button>

            {editingId && (
              <button className="secondary-button" type="button" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>

        {message && <div className="success-message">{message}</div>}
      </div>

      <div className="content-card">
        <div className="section-heading">
          <div>
            <h3>Registered Users</h3>
            <p>{users.length} account(s) registered.</p>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Membership ID</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td><strong>{user.name}</strong></td>
                  <td>{user.membershipId}</td>
                  <td><span className="badge info">{user.role}</span></td>
                  <td>
                    <div className="action-buttons">
                      <button className="small-button edit" onClick={() => startEdit(user)}>
                        Update
                      </button>
                      <button
                        className="small-button delete"
                        onClick={() => handleDelete(user.id)}
                        disabled={currentUser.id === user.id}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Users;
