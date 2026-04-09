import React, { useState } from 'react';
import SimulationControls from './SimulationControls';

const TranspositionCipher = () => {
  const [plaintext, setPlaintext] = useState('DEFENDTHEEASTWALLOFTHECASTLE');
  const [rails, setRails] = useState(3);
  const [currentStep, setCurrentStep] = useState(-1);
  
  const cleanPlaintext = plaintext.toUpperCase().replace(/[^A-Z]/g, '');

  // Calculate the rail structure entirely
  const grid = Array.from({ length: rails }, () => Array(cleanPlaintext.length).fill(null));
  
  let row = 0;
  let dirDown = false;

  const positions = []; // record mapping of index -> [row, col]

  for (let i = 0; i < cleanPlaintext.length; i++) {
    grid[row][i] = cleanPlaintext[i];
    positions.push([row, i]);

    if (row === 0 || row === rails - 1) {
      dirDown = !dirDown;
    }
    dirDown ? row++ : row--;
  }

  // Pre-calculate ciphertext for final reading state
  let fullCipher = '';
  for (let r = 0; r < rails; r++) {
    for (let c = 0; c < cleanPlaintext.length; c++) {
      if (grid[r][c] !== null) fullCipher += grid[r][c];
    }
  }

  const handleReset = () => {
    setCurrentStep(-1);
  };

  const handleStep = () => {
    if (currentStep < cleanPlaintext.length) { // length + 1 allows reading phase
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <div className="glass-panel" style={{ marginTop: '4rem' }}>
      <h3>Rail Fence Transposition</h3>
      <p className="text-muted" style={{ marginBottom: '2rem' }}>
        A transposition cipher that rearranges the characters by writing them in a zig-zag pattern down across multiple "rails", and then reading them off row-by-row.
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
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--danger-red)' }}>Rails Details (Depth): {rails}</label>
          <input 
            type="range" 
            min="2" max="6" 
            value={rails}
            onChange={(e) => { setRails(parseInt(e.target.value, 10)); handleReset(); }}
            style={{ width: '100%', accentColor: 'var(--danger-red)', cursor: 'ew-resize' }}
          />
        </div>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.5)', padding: '2rem', borderRadius: '8px', overflowX: 'auto', marginBottom: '2rem' }}>
        <h4 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontFamily: 'var(--font-display)', textAlign: 'center' }}>Zig-Zag Grid</h4>
        
        <table style={{ margin: '0 auto', borderCollapse: 'collapse', fontFamily: 'var(--font-display)' }}>
          <tbody>
            {grid.map((rowArr, rIdx) => (
              <tr key={rIdx}>
                {rowArr.map((char, cIdx) => {
                  // Determine if this char has been "dropped" in the current step
                  // currentStep >= cIdx means the letter has fallen into place
                  const isVisible = (currentStep >= cIdx) && (char !== null);
                  const isNewlyDropped = (currentStep === cIdx);
                  const isReadingPhase = (currentStep === cleanPlaintext.length);

                  return (
                    <td key={`${rIdx}-${cIdx}`} style={{
                      width: '30px', height: '30px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.05)',
                      color: isVisible ? (isNewlyDropped ? 'var(--primary-neon)' : (isReadingPhase ? 'var(--accent-blue)' : 'var(--text-main)')) : 'transparent',
                      background: isNewlyDropped ? 'rgba(0,255,157,0.1)' : (isReadingPhase && char !== null ? 'rgba(0,180,255,0.1)' : 'transparent'),
                      transition: 'all 0.3s ease',
                      fontWeight: char !== null ? 'bold' : 'normal'
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

      <div style={{ textAlign: 'center', minHeight: '60px' }}>
        <h4 className="text-muted" style={{ marginBottom: '0.5rem' }}>Final Ciphertext</h4>
        {currentStep === cleanPlaintext.length ? (
          <div style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', color: 'var(--primary-neon)', letterSpacing: '2px', wordBreak: 'break-all' }}>
            {fullCipher}
          </div>
        ) : (
          <div style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
            Step through to drop letters, then read horizontal rows.
          </div>
        )}
      </div>

      <SimulationControls 
        showPlay={false}
        canStep={currentStep < cleanPlaintext.length}
        onStep={handleStep}
        onReset={handleReset}
      />
    </div>
  );
};

export default TranspositionCipher;
