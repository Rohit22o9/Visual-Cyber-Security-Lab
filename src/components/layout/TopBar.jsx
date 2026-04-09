import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Search, X } from 'lucide-react';
import { getAllSimulationsFlat } from '../../data/modules';

const TopBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
    } else {
      const allSims = getAllSimulationsFlat();
      const results = allSims.filter(sim => 
        sim.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sim.moduleTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '60px',
      background: 'rgba(10, 15, 30, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--panel-border)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 2rem',
      zIndex: 100
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', textDecoration: 'none' }}>
        <Shield color="#00ff9d" size={24} />
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'var(--font-display)' }}>Cipher<span className="text-primary">Verse</span></h2>
      </Link>
      
      <div ref={searchRef} style={{ position: 'relative', width: '300px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(0,0,0,0.5)',
          border: `1px solid ${isFocused ? 'var(--primary-neon)' : 'var(--panel-border)'}`,
          borderRadius: '4px',
          padding: '0.25rem 0.75rem',
          transition: 'all 0.3s'
        }}>
          <Search size={16} className="text-muted" style={{ marginRight: '0.5rem' }} />
          <input 
            type="text" 
            placeholder="Search simulations..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              width: '100%',
              padding: '0.25rem 0',
              fontFamily: 'var(--font-body)',
              outline: 'none',
              boxShadow: 'none'
            }}
          />
          {searchQuery && (
            <X 
              size={16} 
              className="text-muted" 
              style={{ cursor: 'pointer', marginLeft: '0.5rem' }} 
              onClick={() => setSearchQuery('')} 
            />
          )}
        </div>

        {isFocused && searchResults.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            marginTop: '0.5rem',
            background: 'var(--bg-color)',
            border: '1px solid var(--panel-border)',
            borderRadius: '4px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 1000
          }}>
            {searchResults.map(result => (
              <button
                key={result.id}
                onClick={() => {
                  navigate(result.path);
                  setSearchQuery('');
                  setIsFocused(false);
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.75rem 1rem',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,255,157,0.1)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ color: 'var(--primary-neon)', fontWeight: 'bold' }}>{result.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{result.moduleTitle}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
