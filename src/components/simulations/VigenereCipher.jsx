import React, { useState, useEffect, useRef } from 'react';
import SimulationControls from './SimulationControls';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const VigenereCipher = () => {
  const [plaintext, setPlaintext] = useState('ATTACKATDAWN');
  const [keyword, setKeyword] = useState('LEMON');
  const [currentStep, setCurrentStep] = useState(-1);
  const [ciphertext, setCiphertext] = useState('');
  
  // Clean inputs
  const cleanPlaintext = plaintext.toUpperCase().replace(/[^A-Z]/g, '');
  const cleanKeyword = keyword.toUpperCase().replace(/[^A-Z]/g, '');
  
  // Repeated keyword
  let repeatedKey = '';
  if (cleanKeyword.length > 0 && cleanPlaintext.length > 0) {
    for (let i = 0; i < cleanPlaintext.length; i++) {
        repeatedKey += cleanKeyword[i % cleanKeyword.length];
    }
  }

  const handleReset = () => {
    setCurrentStep(-1);
    setCiphertext('');
  };

  const handleStep = () => {
    if (currentStep + 1 < cleanPlaintext.length) {
      const nextStep = currentStep + 1;
      const pChar = cleanPlaintext[nextStep];
      const kChar = repeatedKey[nextStep];
      
      const pIdx = ALPHABET.indexOf(pChar);
      const kIdx = ALPHABET.indexOf(kChar);
      const cChar = ALPHABET[(pIdx + kIdx) % 26];

      setCurrentStep(nextStep);
      setCiphertext(prev => prev + cChar);
    }
  };

  // Determine active highlights
  let activeCol = -1;
  let activeRow = -1;
  if (currentStep >= 0 && currentStep < cleanPlaintext.length) {
    activeCol = ALPHABET.indexOf(cleanPlaintext[currentStep]);
    activeRow = ALPHABET.indexOf(repeatedKey[currentStep]);
  }

  // Pre-generate Tabula Recta
  const tabulaRecta = [];
  for (let r = 0; r < 26; r++) {
    const row = [];
    for (let c = 0; c < 26; c++) {
      row.push(ALPHABET[(r + c) % 26]);
    }
    tabulaRecta.push(row);
  }

  return (
    <div className="glass-panel" style={{ marginTop: '4rem' }}>
      <h3>Vigenère Cipher</h3>
      <p className="text-muted" style={{ marginBottom: '2rem' }}>
        A polyalphabetic substitution cipher using a Tabula Recta. The keyword is repeated to match the plaintext length. Step through to visualize finding the intersection of Plaintext (Columns) and Key (Rows).
      </p>

      <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '2rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-blue)' }}>Plaintext:</label>
          <input 
            type="text" 
            value={plaintext}
            onChange={(e) => { setPlaintext(e.target.value); handleReset(); }}
            style={{ width: '100%', textTransform: 'uppercase' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-blue)' }}>Keyword:</label>
          <input 
            type="text" 
            value={keyword}
            onChange={(e) => { setKeyword(e.target.value); handleReset(); }}
            style={{ width: '100%', textTransform: 'uppercase' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        
        {/* Simulation Log */}
        <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1.5rem', borderRadius: '8px', minWidth: '300px', flex: 1 }}>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>Processing Tape</h4>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>
            <span style={{ width: '100px', color: 'var(--accent-blue)' }}>Plaintext:</span>
            {cleanPlaintext.split('').map((char, idx) => (
              <span key={`p-${idx}`} style={{ 
                color: idx === currentStep ? '#000' : 'var(--text-main)',
                background: idx === currentStep ? 'var(--accent-blue)' : 'transparent',
                fontWeight: idx === currentStep ? 'bold' : 'normal',
                padding: '0 4px', borderRadius: '4px'
              }}>{char}</span>
            ))}
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>
            <span style={{ width: '100px', color: 'var(--danger-red)' }}>Key Stream:</span>
            {repeatedKey.split('').map((char, idx) => (
              <span key={`k-${idx}`} style={{ 
                color: idx === currentStep ? '#fff' : 'var(--danger-red)',
                background: idx === currentStep ? 'var(--danger-red)' : 'transparent',
                fontWeight: idx === currentStep ? 'bold' : 'normal',
                padding: '0 4px', borderRadius: '4px'
              }}>{char}</span>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '2rem', fontFamily: 'var(--font-display)' }}>
            <span style={{ width: '100px', color: 'var(--primary-neon)' }}>Ciphertext:</span>
            <span style={{ fontSize: '1.2rem', color: 'var(--primary-neon)', letterSpacing: '4px' }}>
              {ciphertext}
            </span>
          </div>
        </div>

      </div>

      {/* Tabula Recta visualization */}
      <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', overflowX: 'auto', overflowY: 'auto' }}>
        <h4 style={{ color: 'var(--text-main)', marginBottom: '1rem', textAlign: 'center', fontFamily: 'var(--font-display)' }}>Tabula Recta (26x26)</h4>
        
        <table style={{ margin: '0 auto', borderCollapse: 'collapse', fontFamily: 'var(--font-display)', fontSize: '0.65rem' }}>
          <thead>
            <tr>
              <th style={{ padding: '2px', border: 'none' }}></th>
              {ALPHABET.split('').map((char, c) => (
                <th key={`head-${c}`} style={{ 
                  padding: '2px', minWidth: '18px', textAlign: 'center',
                  background: c === activeCol ? 'var(--accent-blue)' : 'var(--panel-bg)',
                  color: c === activeCol ? '#000' : 'var(--text-main)',
                  borderTop: '1px solid var(--panel-border)',
                  borderBottom: '2px solid var(--text-main)'
                }}>
                  {char}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tabulaRecta.map((row, r) => (
              <tr key={`row-${r}`}>
                <th style={{ 
                  padding: '2px', textAlign: 'center',
                  background: r === activeRow ? 'var(--danger-red)' : 'var(--panel-bg)',
                  color: r === activeRow ? '#fff' : 'var(--text-main)',
                  borderLeft: '1px solid var(--panel-border)',
                  borderRight: '2px solid var(--text-main)'
                }}>
                  {ALPHABET[r]}
                </th>
                {row.map((char, c) => {
                  const isIntersection = (r === activeRow && c === activeCol);
                  const isHighlightedRow = (r === activeRow && c <= activeCol);
                  const isHighlightedCol = (c === activeCol && r <= activeRow);

                  let bg = 'transparent';
                  let color = 'var(--text-muted)';
                  let fontWeight = 'normal';

                  if (isIntersection) {
                    bg = 'var(--primary-neon)';
                    color = '#000';
                    fontWeight = 'bold';
                  } else if (isHighlightedRow) {
                    bg = 'rgba(255, 45, 85, 0.3)';
                    color = '#fff';
                  } else if (isHighlightedCol) {
                    bg = 'rgba(0, 180, 255, 0.3)';
                    color = '#fff';
                  }

                  return (
                    <td key={`cell-${r}-${c}`} style={{
                      padding: '2px', textAlign: 'center',
                      background: bg, color: color, fontWeight: fontWeight,
                      transition: 'all 0.2s', border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                      {char}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SimulationControls 
        showPlay={false}
        canStep={currentStep + 1 < cleanPlaintext.length}
        onStep={handleStep}
        onReset={handleReset}
      />
    </div>
  );
};

export default VigenereCipher;
