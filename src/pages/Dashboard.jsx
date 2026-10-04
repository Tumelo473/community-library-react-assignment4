import React from "react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";

function Dashboard({ books, transactions }) {
  const totalTitles = books.length;
  const totalCopies = books.reduce((sum, book) => sum + book.quantity, 0);
  const lowStock = books.filter((book) => book.quantity < 2);
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your community library."
      />

      <div className="stats-grid">
        <StatCard
          icon="📚"
          title="Book Titles"
          value={totalTitles}
          text="Titles in the library"
        />
        <StatCard
          icon="📦"
          title="Total Copies"
          value={totalCopies}
          text="Copies currently available"
        />
        <StatCard
          icon="⚠️"
          title="Low Stock"
          value={lowStock.length}
          text="Titles below 2 copies"
        />
        <StatCard
          icon="🔄"
          title="Transactions"
          value={transactions.length}
          text="Recorded transactions"
        />
      </div>

      <div className="content-card">
        <div className="section-heading">
          <div>
            <h3>Current Book Availability</h3>
            <p>Books with fewer than 2 copies are highlighted.</p>
          </div>
        </div>

        {books.length === 0 ? (
          <div className="empty-state">No books have been added yet.</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th>ISBN</th>
                  <th>Available</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id} className={book.quantity < 2 ? "low-stock-row" : ""}>
                    <td><strong>{book.title}</strong></td>
                    <td>{book.author}</td>
                    <td>{book.genre}</td>
                    <td>{book.isbn}</td>
                    <td>{book.quantity}</td>
                    <td>
                      {book.quantity === 0 ? (
                        <span className="badge danger">Out of stock</span>
                      ) : book.quantity < 2 ? (
                        <span className="badge warning">Low stock</span>
                      ) : (
                        <span className="badge success">Available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="content-card">
        <div className="section-heading">
          <div>
            <h3>Recent Transactions</h3>
            <p>The latest stock activity.</p>
          </div>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="empty-state">No transactions have been recorded yet.</div>
        ) : (
          <div className="transaction-list">
            {recentTransactions.map((transaction) => (
              <div className="transaction-item" key={transaction.id}>
                <div className="transaction-icon">
                  {transaction.type === "add" ? "➕" : "➖"}
                </div>
                <div>
                  <strong>{transaction.bookTitle}</strong>
                  <p>
                    {transaction.type === "add" ? "Stock added" : "Stock deducted"}:{" "}
                    {transaction.amount} copy/copies
                  </p>
                </div>
                <small>{transaction.date}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
