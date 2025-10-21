import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Componentes principales
import Dashboard from './components/Dashboard';
import Estudiantes from './components/Estudiantes';
import Predicciones from './components/Predicciones';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/estudiantes" element={<Estudiantes />} />
            <Route path="/predicciones" element={<Predicciones />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
