import React, { useState, useEffect } from 'react';
import SimulationControls from './SimulationControls';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const HillCipher = () => {
  const [plaintext, setPlaintext] = useState('HELP');
  const [keyMatrix, setKeyMatrix] = useState([
    [3, 3],
    [2, 5]
  ]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [ciphertext, setCiphertext] = useState('');

  // Clean and pad plaintext to even length
  let cleanText = plaintext.toUpperCase().replace(/[^A-Z]/g, '');
  if (cleanText.length % 2 !== 0) {
    cleanText += 'X';
  }

  const pairs = [];
  for (let i = 0; i < cleanText.length; i += 2) {
    pairs.push([cleanText[i], cleanText[i+1]]);
  }

  const handleReset = () => {
    setCurrentStep(-1);
    setCiphertext('');
  };

  const handleStep = () => {
    if (currentStep + 1 < pairs.length) {
      const nextStep = currentStep + 1;
      const [p1Char, p2Char] = pairs[nextStep];
      
      const p1 = ALPHABET.indexOf(p1Char);
      const p2 = ALPHABET.indexOf(p2Char);
      
      const c1 = (keyMatrix[0][0] * p1 + keyMatrix[0][1] * p2) % 26;
      const c2 = (keyMatrix[1][0] * p1 + keyMatrix[1][1] * p2) % 26;
      
      const nextC = ALPHABET[c1] + ALPHABET[c2];
      
      setCurrentStep(nextStep);
      setCiphertext(prev => prev + nextC);
    }
  };

  const updateMatrix = (row, col, value) => {
    const newM = [...keyMatrix];
    newM[row] = [...newM[row]];
    newM[row][col] = parseInt(value, 10) || 0;
    setKeyMatrix(newM);
    handleReset();
  };

  // Math highlight state
  let activePair = null;
  let p1Val = 0, p2Val = 0;
  let c1Val = 0, c2Val = 0;
  if (currentStep >= 0 && currentStep < pairs.length) {
    activePair = pairs[currentStep];
    p1Val = ALPHABET.indexOf(activePair[0]);
    p2Val = ALPHABET.indexOf(activePair[1]);
    c1Val = (keyMatrix[0][0] * p1Val + keyMatrix[0][1] * p2Val) % 26;
    c2Val = (keyMatrix[1][0] * p1Val + keyMatrix[1][1] * p2Val) % 26;
  }

  return (
    <div className="glass-panel" style={{ marginTop: '4rem' }}>
      <h3>Hill Cipher</h3>
      <p className="text-muted" style={{ marginBottom: '2rem' }}>
        Uses linear algebra to encrypt blocks of text. The 2x2 Key Matrix is multiplied by a 1x2 Plaintext vector. All math is performed modulo 26.
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
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--danger-red)' }}>Key Matrix (2x2):</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', width: '150px' }}>
            <input type="number" value={keyMatrix[0][0]} onChange={(e) => updateMatrix(0, 0, e.target.value)} />
            <input type="number" value={keyMatrix[0][1]} onChange={(e) => updateMatrix(0, 1, e.target.value)} />
            <input type="number" value={keyMatrix[1][0]} onChange={(e) => updateMatrix(1, 0, e.target.value)} />
            <input type="number" value={keyMatrix[1][1]} onChange={(e) => updateMatrix(1, 1, e.target.value)} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        
        {/* Math Visualizer */}
        <div style={{ background: 'rgba(0,0,0,0.5)', padding: '2rem', borderRadius: '8px', minWidth: '400px', flex: 1 }}>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '1.5rem', fontFamily: 'var(--font-display)', textAlign: 'center' }}>Matrix Operations modulo 26</h4>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>
            
            {/* Key Matrix */}
            <div style={{ borderLeft: '2px solid var(--danger-red)', borderRight: '2px solid var(--danger-red)', padding: '0.5rem', borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ color: 'var(--danger-red)' }}>{keyMatrix[0][0]} &nbsp; {keyMatrix[0][1]}</div>
              <div style={{ color: 'var(--danger-red)' }}>{keyMatrix[1][0]} &nbsp; {keyMatrix[1][1]}</div>
            </div>

            <div style={{ color: 'var(--text-muted)' }}>×</div>

            {/* Plaintext Vector */}
            <div style={{ borderLeft: '2px solid var(--accent-blue)', borderRight: '2px solid var(--accent-blue)', padding: '0.5rem', borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ color: activePair ? 'var(--accent-blue)' : 'var(--text-muted)' }}>
                {activePair ? p1Val : 'P1'} <span style={{ fontSize: '0.8rem', color: 'gray' }}>({activePair ? activePair[0] : '-'})</span>
              </div>
              <div style={{ color: activePair ? 'var(--accent-blue)' : 'var(--text-muted)' }}>
                {activePair ? p2Val : 'P2'} <span style={{ fontSize: '0.8rem', color: 'gray' }}>({activePair ? activePair[1] : '-'})</span>
              </div>
            </div>

            <div style={{ color: 'var(--text-muted)' }}>=</div>

            {/* Result Vector */}
            <div style={{ borderLeft: '2px solid var(--primary-neon)', borderRight: '2px solid var(--primary-neon)', padding: '0.5rem', borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ color: activePair ? 'var(--primary-neon)' : 'var(--text-muted)' }}>
                {activePair ? c1Val : 'C1'} <span style={{ fontSize: '0.8rem', color: 'gray' }}>({activePair ? ALPHABET[c1Val] : '-'})</span>
              </div>
              <div style={{ color: activePair ? 'var(--primary-neon)' : 'var(--text-muted)' }}>
                {activePair ? c2Val : 'C2'} <span style={{ fontSize: '0.8rem', color: 'gray' }}>({activePair ? ALPHABET[c2Val] : '-'})</span>
              </div>
            </div>

          </div>

          {activePair && (
            <div style={{ marginTop: '2rem', background: 'rgba(0,180,255,0.1)', padding: '1rem', borderRadius: '4px', fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>
              <p style={{ margin: 0 }}>C1 = ({keyMatrix[0][0]} × {p1Val}) + ({keyMatrix[0][1]} × {p2Val}) = {keyMatrix[0][0]*p1Val + keyMatrix[0][1]*p2Val} ≡ <strong>{c1Val} mod 26</strong></p>
              <p style={{ margin: '0.5rem 0 0 0' }}>C2 = ({keyMatrix[1][0]} × {p1Val}) + ({keyMatrix[1][1]} × {p2Val}) = {keyMatrix[1][0]*p1Val + keyMatrix[1][1]*p2Val} ≡ <strong>{c2Val} mod 26</strong></p>
            </div>
          )}
        </div>

        {/* Global Output */}
        <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1.5rem', borderRadius: '8px', minWidth: '300px' }}>
            <h4 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>Cipher State</h4>
            
            <div style={{ marginBottom: '1rem' }}>
              <span className="text-muted" style={{ marginRight: '1rem' }}>Blocks:</span>
              {pairs.map((p, idx) => (
                <span key={idx} style={{
                  marginRight: '0.5rem', fontFamily: 'var(--font-display)',
                  color: idx === currentStep ? 'var(--accent-blue)' : (idx < currentStep ? 'var(--text-muted)' : 'var(--text-main)'),
                  fontWeight: idx === currentStep ? 'bold' : 'normal',
                  borderBottom: idx === currentStep ? '2px solid var(--accent-blue)' : 'none'
                }}>
                  {p[0]}{p[1]}
                </span>
              ))}
            </div>

            <div style={{ marginTop: '2rem' }}>
              <span className="text-muted" style={{ marginRight: '1rem' }}>Ciphertext:</span>
              <span style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', color: 'var(--primary-neon)', letterSpacing: '2px' }}>
                {ciphertext}
              </span>
            </div>
        </div>
      </div>

      <SimulationControls 
        showPlay={false}
        canStep={currentStep + 1 < pairs.length}
        onStep={handleStep}
        onReset={handleReset}
      />
    </div>
  );
};

export default HillCipher;
