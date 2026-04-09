import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import SimulationControls from './SimulationControls';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const CaesarCipher = () => {
  const [shift, setShift] = useState(3);
  const [plaintext, setPlaintext] = useState('ATTACK');
  const [ciphertext, setCiphertext] = useState('');
  
  const bottomRowRef = useRef(null);

  // Calculate ciphertext
  useEffect(() => {
    let result = '';
    for (let i = 0; i < plaintext.length; i++) {
      const char = plaintext[i].toUpperCase();
      if (alphabet.includes(char)) {
        const idx = alphabet.indexOf(char);
        const newIdx = (idx + shift + 26) % 26;
        result += alphabet[newIdx];
      } else {
        result += char;
      }
    }
    setCiphertext(result);
  }, [shift, plaintext]);

  // Animate the bottom row when shift changes
  useEffect(() => {
    if (bottomRowRef.current) {
      gsap.fromTo(bottomRowRef.current.children, 
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, stagger: 0.02, ease: "back.out" }
      );
    }
  }, [shift]);

  // Generate shifted alphabet array
  const shiftedAlphabet = alphabet.split('').map((char, index) => {
    return alphabet[(index + shift + 26) % 26];
  });

  const handleReset = () => {
    setShift(3);
    setPlaintext('ATTACK');
  };

  const handleStep = () => {
    setShift((prev) => (prev + 1) % 26);
  };

  return (
    <div className="glass-panel">
      <h3>Caesar Cipher</h3>
      <p className="text-muted" style={{ marginBottom: '2rem' }}>
        The Caesar cipher is a substitution cipher where each letter in the plaintext is shifted a specific number of places down the alphabet. Try adjusting the shift wheel below.
      </p>

      <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '2rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-blue)' }}>Plaintext Input:</label>
          <input 
            type="text" 
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
            style={{ width: '100%', textTransform: 'uppercase' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--primary-neon)' }}>Shift Value: {shift}</label>
          <input 
            type="range" 
            min="-25" max="25" 
            value={shift}
            onChange={(e) => setShift(parseInt(e.target.value, 10))}
            style={{ width: '100%', accentColor: 'var(--primary-neon)', cursor: 'ew-resize' }}
          />
        </div>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.5)', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', minWidth: 'max-content' }}>
          <div style={{ width: '100px', color: 'var(--accent-blue)', fontFamily: 'var(--font-display)' }}>Plaintext</div>
          <div style={{ display: 'flex', gap: '0.2rem' }}>
            {alphabet.split('').map(letter => (
              <div key={`p-${letter}`} style={{ width: '24px', textAlign: 'center', background: 'rgba(0, 180, 255, 0.1)', border: '1px solid var(--accent-blue)', borderRadius: '4px' }}>
                {letter}
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', minWidth: 'max-content' }}>
          <div style={{ width: '100px', color: 'var(--primary-neon)', fontFamily: 'var(--font-display)' }}>Ciphertext</div>
          <div ref={bottomRowRef} style={{ display: 'flex', gap: '0.2rem' }}>
            {shiftedAlphabet.map((letter, i) => (
              <div key={`c-${i}`} style={{ width: '24px', textAlign: 'center', background: 'rgba(0, 255, 157, 0.1)', border: '1px solid var(--primary-neon)', borderRadius: '4px' }}>
                {letter}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <h4 className="text-muted" style={{ marginBottom: '0.5rem' }}>Live Result</h4>
        <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', letterSpacing: '0.2em', color: 'var(--primary-neon)', textShadow: '0 0 10px rgba(0,255,157,0.5)' }}>
          {ciphertext || '...'}
        </div>
      </div>

      <SimulationControls 
        showPlay={false}
        canStep={true}
        onStep={handleStep}
        onReset={handleReset}
      />
    </div>
  );
};

export default CaesarCipher;
