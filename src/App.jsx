import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ThemeMatrix from './components/layout/ThemeMatrix';
import TopBar from './components/layout/TopBar';
import Sidebar from './components/layout/Sidebar';
import LandingPage from './pages/LandingPage';
import Module1 from './pages/modules/Module1';
import Module2 from './pages/modules/Module2';
import ModulePlaceholder from './pages/modules/ModulePlaceholder';

import './index.css';

function App() {
  return (
    <Router>
      <ThemeMatrix />
      <TopBar />
      <Sidebar />
      <main style={{ 
        marginLeft: '300px', 
        paddingTop: '60px', 
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1 
      }}>
        <div className="container" style={{ padding: '2rem' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/modules/classical-encryption" element={<Module1 />} />
            <Route path="/modules/block-ciphers" element={<Module2 />} />
            <Route path="/modules/:id" element={<ModulePlaceholder />} />
          </Routes>
        </div>
      </main>
    </Router>
  );
}

export default App;
