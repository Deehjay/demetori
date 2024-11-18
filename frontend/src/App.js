import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import GroupsPage from "./pages/GroupsPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("authToken") // Check if the user is already logged in
  );

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Clear auth token
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div>
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/group-planner"
            element={
              isLoggedIn ? <GroupsPage /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/wishlists"
            element={
              isLoggedIn ? <Test2Page /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

const Navbar = ({ isLoggedIn, onLogout }) => (
  <nav className="absolute top-0 left-0 w-full z-10 p-4 flex justify-between items-center">
    <Link to="/" className="text-3xl font-bold">
      Demetori T&L Guild Management
    </Link>
    <div className="flex gap-4">
      {!isLoggedIn ? (
        <Link
          to="/login"
          className="text-xl font-bold text-primary hover:underline">
          Login
        </Link>
      ) : (
        <>
          <Link
            to="/group-planner"
            className="text-xl font-bold hover:underline">
            Group Planner
          </Link>
          <Link to="/wishlists" className="text-xl font-bold hover:underline">
            Wishlists
          </Link>
          <Link
            to="/login"
            onClick={() => onLogout()}
            className="text-xl font-bold text-primary hover:underline">
            Logout
          </Link>
        </>
      )}
    </div>
  </nav>
);

const Test2Page = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-3xl font-bold">soontm</h1>
  </div>
);

export default App;
