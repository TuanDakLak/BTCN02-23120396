import Header from "./components/webComponents/Header";
import Nav from "./components/webComponents/Nav";
import Footer from "./components/webComponents/Footer"
import Main from "./components/webComponents/Maincontent/Main";
import { SearchProvider } from "./components/webComponents/SearchContext";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchPage from "./components/webComponents/Maincontent/SearchPage";

import "./App.css";

export default function App() {
  return (
    <SearchProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Nav />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/movie/:id" element={<MovieRoute />} />
              <Route path="/person/:id" element={<PersonRoute />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </SearchProvider>
  );
}