import Header from "./components/webComponents/Header";
import Nav from "./components/webComponents/Nav";
import Footer from "./components/webComponents/Footer";
import Main from "./components/webComponents/Maincontent/Main";
import { SearchProvider } from "./components/webComponents/SearchContext";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchPage from "./components/webComponents/Maincontent/SearchPage";
import MovieRoute from "./components/webComponents/MovieRoute";
import PersonRoute from "./components/webComponents/PersonRoute";
import Signup from "./components/webComponents/Logging/Signup";
import Login from "./components/webComponents/Logging/Login";
import { AuthProvider } from "./components/webComponents/Logging/AuthContext";
import ProtectedRoute from "./components/webComponents/Logging/ProtectedRoute";

import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <Header />
            <Nav />
            <main className="flex-1 container mx-auto px-4 py-6">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                <Route path="/" element={
                  <ProtectedRoute>
                    <Main />
                  </ProtectedRoute>
                } />
                <Route path="/movie/:id" element={
                  <ProtectedRoute>
                    <MovieRoute />
                  </ProtectedRoute>
                } />
                <Route path="/person/:id" element={
                  <ProtectedRoute>
                    <PersonRoute />
                  </ProtectedRoute>
                } />
                <Route path="/search" element={
                  <ProtectedRoute>
                    <SearchPage />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </SearchProvider>
    </AuthProvider>
  );
}
