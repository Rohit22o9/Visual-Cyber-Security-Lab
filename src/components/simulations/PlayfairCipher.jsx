import React, { useState, useEffect } from 'react';
import SimulationControls from './SimulationControls';

const PlayfairCipher = () => {
  const [keyword, setKeyword] = useState('CIPHER');
  const [plaintext, setPlaintext] = useState('ATTACK');
  const [matrix, setMatrix] = useState([]);
  const [digraphs, setDigraphs] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [ciphertext, setCiphertext] = useState('');

  // 1. Generate the 5x5 Matrix whenever keyword changes
  useEffect(() => {
    const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ"; // No J
    let keyStr = keyword.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    let uniqueChars = new Set();
    let grid = [];

    // Add keyword chars
    for (const char of keyStr) {
      if (!uniqueChars.has(char)) {
        uniqueChars.add(char);
        grid.push(char);
      }
    }
    // Add remaining alphabet
    for (const char of alphabet) {
      if (!uniqueChars.has(char)) {
        uniqueChars.add(char);
        grid.push(char);
      }
    }

    // Convert to 2D 5x5 array
    const matrix2D = [];
    for (let i = 0; i < 5; i++) {
      matrix2D.push(grid.slice(i * 5, i * 5 + 5));
    }
    setMatrix(matrix2D);
    handleReset(); // Reset simulation if key changes
  }, [keyword]);

  // 2. Prepare Digraphs
  useEffect(() => {
    let cleanText = plaintext.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    let pairs = [];
    let i = 0;
    while (i < cleanText.length) {
      let a = cleanText[i];
      let b = cleanText[i + 1];
      
      if (!b) {
        pairs.push([a, 'X']);
        i += 1;
      } else if (a === b) {
        pairs.push([a, 'X']);
        i += 1;
      } else {
        pairs.push([a, b]);
        i += 2;
      }
    }
    setDigraphs(pairs);
    handleReset();
  }, [plaintext]);

  const handleReset = () => {
    setCurrentStep(-1);
    setCiphertext('');
  };

  const getCoordinates = (char) => {
    for(let r=0; r<5; r++){
      for(let c=0; c<5; c++){
        if(matrix[r][c] === char) return [r, c];
      }
    }
    return [0,0];
  };

  const encryptDigraph = (a, b) => {
    const [r1, c1] = getCoordinates(a);
    const [r2, c2] = getCoordinates(b);

    if (r1 === r2) {
      // Same row -> shift right
      return [matrix[r1][(c1+1)%5], matrix[r2][(c2+1)%5]];
    } else if (c1 === c2) {
      // Same col -> shift down
      return [matrix[(r1+1)%5][c1], matrix[(r2+1)%5][c2]];
    } else {
      // Rectangle -> swap columns
      return [matrix[r1][c2], matrix[r2][c1]];
    }
  };

  const handleStep = () => {
    if (currentStep + 1 < digraphs.length) {
      const nextStep = currentStep + 1;
      const [a, b] = digraphs[nextStep];
      const [ea, eb] = encryptDigraph(a, b);
      
      setCurrentStep(nextStep);
      setCiphertext(prev => prev + ea + eb);
    }
  };

  // UI Highlight calculations
  let activeCells = [];
  let crossCells = [];
  let ruleText = "";

  if (currentStep >= 0 && digraphs[currentStep] && matrix.length === 5) {
    const [a, b] = digraphs[currentStep];
    const [r1, c1] = getCoordinates(a);
    const [r2, c2] = getCoordinates(b);
    activeCells.push(`${r1},${c1}`); // a
    activeCells.push(`${r2},${c2}`); // b

    if (r1 === r2) {
      crossCells.push(`${r1},${(c1+1)%5}`);
      crossCells.push(`${r2},${(c2+1)%5}`);
      ruleText = "Same Row: Shift Right";
    } else if (c1 === c2) {
      crossCells.push(`${(r1+1)%5},${c1}`);
      crossCells.push(`${(r2+1)%5},${c2}`);
      ruleText = "Same Column: Shift Down";
    } else {
      crossCells.push(`${r1},${c2}`);
      crossCells.push(`${r2},${c1}`);
      ruleText = "Rectangle: Swap Corners";
    }
  }

  return (
    <div className="glass-panel" style={{ marginTop: '4rem' }}>
      <h3>Playfair Cipher</h3>
      <p className="text-muted" style={{ marginBottom: '2rem' }}>
        Encrypts pairs of letters (digraphs) using a 5x5 key matrix. Step through to visualize the geometric substitution rules. (I and J are combined).
      </p>

      <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '2rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-blue)' }}>Keyword:</label>
          <input 
            type="text" 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ width: '100%', textTransform: 'uppercase' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-blue)' }}>Plaintext:</label>
          <input 
            type="text" 
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
            style={{ width: '100%', textTransform: 'uppercase' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
        {/* 5x5 Matrix Output */}
        <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1.5rem', borderRadius: '8px', minWidth: '250px' }}>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '1rem', textAlign: 'center', fontFamily: 'var(--font-display)' }}>Key Matrix</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
            {matrix.map((row, rIdx) => 
              row.map((char, cIdx) => {
                const cellKey = `${rIdx},${cIdx}`;
                const isActive = activeCells.includes(cellKey);
                const isCross = crossCells.includes(cellKey);

                let bg = 'rgba(255,255,255,0.05)';
                let border = '1px solid var(--panel-border)';
                let color = 'var(--text-main)';

                if (isActive) {
                  bg = 'rgba(0, 180, 255, 0.2)';
                  border = '1px solid var(--accent-blue)';
                  color = 'var(--accent-blue)';
                } else if (isCross) {
                  bg = 'rgba(0, 255, 157, 0.2)';
                  border = '1px solid var(--primary-neon)';
                  color = 'var(--primary-neon)';
                }

                return (
                  <div key={cellKey} style={{
                    width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: bg, border: border, color: color, borderRadius: '4px',
                    fontFamily: 'var(--font-display)', fontWeight: (isActive || isCross) ? 'bold' : 'normal',
                    transition: 'all 0.3s ease'
                  }}>
                    {char}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Live processing view */}
        <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1.5rem', borderRadius: '8px', flex: 1, minWidth: '300px' }}>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>Simulation Log</h4>
          
          <div style={{ marginBottom: '1rem' }}>
            <span className="text-muted" style={{ marginRight: '1rem' }}>Digraphs:</span>
            {digraphs.map((pair, idx) => (
              <span key={idx} style={{
                marginRight: '0.5rem', fontFamily: 'var(--font-display)',
                color: idx === currentStep ? 'var(--accent-blue)' : (idx < currentStep ? 'var(--text-muted)' : 'var(--text-main)'),
                textDecoration: idx === currentStep ? 'underline' : 'none',
                fontWeight: idx === currentStep ? 'bold' : 'normal'
              }}>
                {pair[0]}{pair[1]}
              </span>
            ))}
          </div>

          <div style={{ height: '40px', display: 'flex', alignItems: 'center', color: 'var(--primary-neon)', fontWeight: 'bold' }}>
            {ruleText && `Rule applied: ${ruleText}`}
          </div>

          <div style={{ marginTop: '1rem' }}>
            <span className="text-muted" style={{ marginRight: '1rem' }}>Ciphertext:</span>
            <span style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', color: 'var(--primary-neon)', letterSpacing: '2px' }}>
              {ciphertext}
            </span>
          </div>
        </div>
      </div>

      <SimulationControls 
        showPlay={false}
        canStep={currentStep + 1 < digraphs.length}
        onStep={handleStep}
        onReset={handleReset}
      />
    </div>
  );
};

export default PlayfairCipher;
