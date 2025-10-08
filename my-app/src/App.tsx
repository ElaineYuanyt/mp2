import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ListView from './components/ListView';
import GalleryView from './components/GalleryView';
import DetailView from './components/DetailView';
import './App.css';

function App() {
  return (
    <Router basename="/mp2">
      <div className="App">
        <nav className="navbar">
          <div className="nav-brand">
            <h1>🍽️ Smart Kitchen Recipe Finder</h1>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Search</Link>
            <Link to="/gallery" className="nav-link">Gallery</Link>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<ListView />} />
            <Route path="/gallery" element={<GalleryView />} />
            <Route path="/detail/:id" element={<DetailView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
