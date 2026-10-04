import React from "react";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Transactions from "./pages/Transactions";
import Users from "./pages/Users";

const defaultBooks = [
  {
    id: 1,
    title: "Things Fall Apart",
    author: "Chinua Achebe",
    genre: "Fiction",
    isbn: "9780385474542",
    quantity: 4
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    genre: "Programming",
    isbn: "9780132350884",
    quantity: 1
  },
  {
    id: 3,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    genre: "Computer Science",
    isbn: "9780262046305",
    quantity: 3
  }
];

const defaultUsers = [
  {
    id: 1,
    name: "Library Administrator",
    membershipId: "ADMIN001",
    role: "Admin",
    password: "admin123"
  },
  {
    id: 2,
    name: "John Member",
    membershipId: "MEM001",
    role: "Member",
    password: "member123"
  }
];

function App() {
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem("libraryBooks");
    return saved ? JSON.parse(saved) : defaultBooks;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("libraryUsers");
    return saved ? JSON.parse(saved) : defaultUsers;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("libraryTransactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("libraryCurrentUser");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem("libraryBooks", JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem("libraryUsers", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("libraryTransactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("libraryCurrentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("libraryCurrentUser");
    }
  }, [currentUser]);

  function login(membershipId, password) {
    const user = users.find(
      (item) =>
        item.membershipId.toLowerCase() === membershipId.toLowerCase() &&
        item.password === password
    );

    if (!user) {
      return { success: false, message: "Invalid membership ID or password." };
    }

    setCurrentUser(user);
    return { success: true };
  }

  function logout() {
    setCurrentUser(null);
  }

  function addBook(book) {
    const newBook = {
      ...book,
      id: Date.now(),
      quantity: Number(book.quantity)
    };
    setBooks((oldBooks) => [...oldBooks, newBook]);
  }

  function updateBook(updatedBook) {
    setBooks((oldBooks) =>
      oldBooks.map((book) =>
        book.id === updatedBook.id
          ? { ...updatedBook, quantity: Number(updatedBook.quantity) }
          : book
      )
    );
  }

  function deleteBook(id) {
    setBooks((oldBooks) => oldBooks.filter((book) => book.id !== id));
  }

  function changeStock(bookId, amount, type) {
    const book = books.find((item) => item.id === bookId);

    if (!book) {
      return { success: false, message: "Book not found." };
    }

    if (type === "borrow" && book.quantity <= 0) {
      return { success: false, message: "This book is out of stock." };
    }

    if (type === "remove" && book.quantity < amount) {
      return { success: false, message: "You cannot deduct more than the current stock." };
    }

    const newQuantity =
      type === "add"
        ? book.quantity + amount
        : book.quantity - amount;

    setBooks((oldBooks) =>
      oldBooks.map((item) =>
        item.id === bookId ? { ...item, quantity: newQuantity } : item
      )
    );

    const transaction = {
      id: Date.now(),
      bookId,
      bookTitle: book.title,
      type,
      amount,
      date: new Date().toLocaleString(),
      user: currentUser ? currentUser.name : "Unknown"
    };

    setTransactions((oldTransactions) => [transaction, ...oldTransactions]);

    return { success: true };
  }

  function addUser(user) {
    setUsers((oldUsers) => [
      ...oldUsers,
      {
        ...user,
        id: Date.now()
      }
    ]);
  }

  function updateUser(updatedUser) {
    setUsers((oldUsers) =>
      oldUsers.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      )
    );

    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  }

  function deleteUser(id) {
    if (currentUser && currentUser.id === id) {
      return { success: false, message: "You cannot delete the account currently logged in." };
    }

    setUsers((oldUsers) => oldUsers.filter((user) => user.id !== id));
    return { success: true };
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onLogin={login} />
          )
        }
      />

      <Route
        path="/"
        element={
          currentUser ? (
            <Layout currentUser={currentUser} onLogout={logout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route
          path="dashboard"
          element={<Dashboard books={books} transactions={transactions} />}
        />
        <Route
          path="books"
          element={
            <Books
              books={books}
              onAdd={addBook}
              onUpdate={updateBook}
              onDelete={deleteBook}
            />
          }
        />
        <Route
          path="transactions"
          element={
            <Transactions
              books={books}
              transactions={transactions}
              onChangeStock={changeStock}
            />
          }
        />
        <Route
          path="users"
          element={
            <Users
              users={users}
              currentUser={currentUser}
              onAdd={addUser}
              onUpdate={updateUser}
              onDelete={deleteUser}
            />
          }
        />
      </Route>

      <Route path="*" element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

export default App;
