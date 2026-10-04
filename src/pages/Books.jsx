import React from "react";
import { useState } from "react";
import PageHeader from "../components/PageHeader";

const emptyBook = {
  title: "",
  author: "",
  genre: "",
  isbn: "",
  quantity: 0
};

function Books({ books, onAdd, onUpdate, onDelete }) {
  const [form, setForm] = useState(emptyBook);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((oldForm) => ({ ...oldForm, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!form.title.trim() || !form.author.trim() || !form.genre.trim() || !form.isbn.trim()) {
      setMessage("Please complete all book fields.");
      return;
    }

    if (Number(form.quantity) < 0) {
      setMessage("Quantity cannot be negative.");
      return;
    }

    if (editingId) {
      onUpdate({ ...form, id: editingId });
      setMessage("Book updated successfully.");
    } else {
      onAdd(form);
      setMessage("Book added successfully.");
    }

    setForm(emptyBook);
    setEditingId(null);
  }

  function startEdit(book) {
    setEditingId(book.id);
    setForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      isbn: book.isbn,
      quantity: book.quantity
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyBook);
    setMessage("");
  }

  function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this book?")) {
      onDelete(id);
      setMessage("Book deleted successfully.");
    }
  }

  return (
    <div>
      <PageHeader
        title="Book Management"
        description="Add, update and delete library books."
      />

      <div className="content-card">
        <div className="section-heading">
          <div>
            <h3>{editingId ? "Update Book" : "Add New Book"}</h3>
            <p>Enter the title, author, genre, ISBN and initial quantity.</p>
          </div>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Book title" />
          </div>

          <div className="form-group">
            <label>Author *</label>
            <input name="author" value={form.author} onChange={handleChange} placeholder="Author name" />
          </div>

          <div className="form-group">
            <label>Genre *</label>
            <input name="genre" value={form.genre} onChange={handleChange} placeholder="e.g. Fiction" />
          </div>

          <div className="form-group">
            <label>ISBN *</label>
            <input name="isbn" value={form.isbn} onChange={handleChange} placeholder="ISBN number" />
          </div>

          <div className="form-group">
            <label>Initial Quantity *</label>
            <input
              name="quantity"
              type="number"
              min="0"
              value={form.quantity}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button className="primary-button" type="submit">
              {editingId ? "Update Book" : "Add Book"}
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
            <h3>Book List</h3>
            <p>{books.length} book title(s) registered.</p>
          </div>
        </div>

        {books.length === 0 ? (
          <div className="empty-state">No books available.</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th>ISBN</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id}>
                    <td><strong>{book.title}</strong></td>
                    <td>{book.author}</td>
                    <td>{book.genre}</td>
                    <td>{book.isbn}</td>
                    <td>
                      <span className={book.quantity < 2 ? "quantity-low" : "quantity-normal"}>
                        {book.quantity}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="small-button edit" onClick={() => startEdit(book)}>
                          Update
                        </button>
                        <button className="small-button delete" onClick={() => handleDelete(book.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Books;
