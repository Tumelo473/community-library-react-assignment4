import React from "react";
import { useState } from "react";
import PageHeader from "../components/PageHeader";

function Transactions({ books, transactions, onChangeStock }) {
  const [bookId, setBookId] = useState("");
  const [amount, setAmount] = useState(1);
  const [type, setType] = useState("add");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!bookId) {
      setMessage("Please select a book.");
      return;
    }

    if (Number(amount) < 1) {
      setMessage("Amount must be at least 1.");
      return;
    }

    const result = onChangeStock(Number(bookId), Number(amount), type);

    if (!result.success) {
      setMessage(result.message);
      return;
    }

    setMessage(
      type === "add"
        ? "Stock added successfully."
        : "Stock deducted successfully."
    );
    setAmount(1);
  }

  return (
    <div>
      <PageHeader
        title="Transactions"
        description="Add stock when books arrive and deduct stock when books are borrowed."
      />

      <div className="content-card">
        <div className="section-heading">
          <div>
            <h3>Record Stock Transaction</h3>
            <p>Choose a book, transaction type and quantity.</p>
          </div>
        </div>

        <form className="form-grid transaction-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Book *</label>
            <select value={bookId} onChange={(e) => setBookId(e.target.value)}>
              <option value="">Select a book</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title} — {book.quantity} available
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Transaction Type *</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="add">Add Stock</option>
              <option value="borrow">Borrow / Deduct Stock</option>
            </select>
          </div>

          <div className="form-group">
            <label>Quantity *</label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button className="primary-button" type="submit">
              Record Transaction
            </button>
          </div>
        </form>

        {message && <div className="success-message">{message}</div>}
      </div>

      <div className="content-card">
        <div className="section-heading">
          <div>
            <h3>Transaction History</h3>
            <p>Every stock change is saved in Local Storage.</p>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="empty-state">No transactions have been recorded.</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Book</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Recorded By</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.date}</td>
                    <td><strong>{transaction.bookTitle}</strong></td>
                    <td>
                      {transaction.type === "add" ? (
                        <span className="badge success">Stock Added</span>
                      ) : (
                        <span className="badge warning">Stock Deducted</span>
                      )}
                    </td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.user}</td>
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

export default Transactions;
