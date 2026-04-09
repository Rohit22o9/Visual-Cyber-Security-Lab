import React, { useState, useEffect } from 'react';
import SimulationControls from './SimulationControls';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const MonoalphabeticCipher = () => {
  const [plaintext, setPlaintext] = useState('THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG. CRYPTOGRAPHY IS THE PRACTICE AND STUDY OF TECHNIQUES FOR SECURE COMMUNICATION.');
  const [substitution, setSubstitution] = useState(ALPHABET.split('').reverse().join('')); // Default to Atbash-like initially
  const [ciphertext, setCiphertext] = useState('');
  const [draggedIdx, setDraggedIdx] = useState(null);

  // Frequency mapping for ciphertext
  const [frequencies, setFrequencies] = useState({});

  useEffect(() => {
    let result = '';
    const freqs = {};
    ALPHABET.split('').forEach(char => freqs[char] = 0);

    let maxFreq = 0;

    for (let i = 0; i < plaintext.length; i++) {
      const char = plaintext[i].toUpperCase();
      if (ALPHABET.includes(char)) {
        const idx = ALPHABET.indexOf(char);
        const subChar = substitution[idx];
        result += subChar;
        freqs[subChar]++;
        if (freqs[subChar] > maxFreq) maxFreq = freqs[subChar];
      } else {
        result += char;
      }
    }
    setCiphertext(result);
    setFrequencies({ counts: freqs, max: maxFreq || 1 });
  }, [plaintext, substitution]);

  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === dropIndex) return;

    // Swap the characters in the substitution string
    const newSub = substitution.split('');
    const temp = newSub[draggedIdx];
    newSub[draggedIdx] = newSub[dropIndex];
    newSub[dropIndex] = temp;
    
    setSubstitution(newSub.join(''));
    setDraggedIdx(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleReset = () => {
    setSubstitution('ZYXWVUTSRQPONMLKJIHGFEDCBA');
  };

  return (
    <div className="glass-panel">
      <h3>Monoalphabetic Cipher</h3>
      <p className="text-muted" style={{ marginBottom: '2rem' }}>
        Each letter replaces another across the entire message. Drag and drop the colored ciphertext letters below to swap them. The frequency bar chart below reveals patterns!
      </p>

      {/* Substitution Table */}
      <div style={{ marginBottom: '2rem', overflowX: 'auto', background: 'rgba(0,0,0,0.5)', padding: '1.5rem', borderRadius: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', minWidth: 'max-content' }}>
          <div style={{ width: '100px', color: 'var(--accent-blue)', fontFamily: 'var(--font-display)' }}>Plaintext</div>
          <div style={{ display: 'flex', gap: '0.2rem' }}>
            {ALPHABET.split('').map((letter) => (
              <div key={`p-${letter}`} style={{ width: '28px', height: '28px', lineHeight: '28px', textAlign: 'center', background: 'rgba(0, 180, 255, 0.1)', border: '1px solid var(--accent-blue)', borderRadius: '4px', fontFamily: 'var(--font-display)' }}>
                {letter}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', minWidth: 'max-content' }}>
          <div style={{ width: '100px', color: 'var(--primary-neon)', fontFamily: 'var(--font-display)' }}>Ciphertext</div>
          <div style={{ display: 'flex', gap: '0.2rem' }}>
            {substitution.split('').map((letter, i) => (
              <div 
                key={`c-${i}`} 
                draggable
                onDragStart={(e) => handleDragStart(e, i)}
                onDrop={(e) => handleDrop(e, i)}
                onDragOver={handleDragOver}
                style={{ 
                  width: '28px', 
                  height: '28px', 
                  lineHeight: '28px', 
                  textAlign: 'center', 
                  background: draggedIdx === i ? 'var(--primary-neon)' : 'rgba(0, 255, 157, 0.1)', 
                  border: '1px solid var(--primary-neon)', 
                  color: draggedIdx === i ? '#000' : 'var(--primary-neon)',
                  borderRadius: '4px', 
                  fontFamily: 'var(--font-display)',
                  cursor: 'grab'
                }}
                title="Drag to swap"
              >
                {letter}
              </div>
            ))}
          </div>
        </div>
        <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '1rem', textAlign: 'center' }}>Drag letters in the green row to swap mapping.</p>
      </div>

      {/* Input / Output */}
      <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '2rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-blue)' }}>Plaintext Document:</label>
          <textarea 
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
            style={{ width: '100%', height: '120px', textTransform: 'uppercase', resize: 'none', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--accent-blue)', color: 'var(--text-main)', padding: '1rem', fontFamily: 'var(--font-display)', borderRadius: '4px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--primary-neon)' }}>Live Ciphertext:</label>
          <textarea 
            readOnly
            value={ciphertext}
            style={{ width: '100%', height: '120px', resize: 'none', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--primary-neon)', color: 'var(--primary-neon)', padding: '1rem', fontFamily: 'var(--font-display)', borderRadius: '4px' }}
          />
        </div>
      </div>

      {/* Frequency Chart */}
      <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1.5rem', borderRadius: '8px' }}>
        <h4 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontFamily: 'var(--font-display)', textAlign: 'center' }}>Ciphertext Frequency Analysis</h4>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '4px', height: '150px', paddingBottom: '20px' }}>
            {frequencies.counts && ALPHABET.split('').map(letter => {
              const count = frequencies.counts[letter];
              const heightPct = frequencies.max > 0 ? (count / frequencies.max) * 100 : 0;
              return (
                <div key={`bar-${letter}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px' }}>{count}</div>
                  <div style={{ 
                    height: `${heightPct}%`, 
                    minHeight: count > 0 ? '4px' : '0',
                    width: '100%', 
                    background: 'var(--danger-red)', 
                    transition: 'height 0.3s ease',
                    boxShadow: '0 0 5px rgba(255,45,85,0.5)'
                  }}></div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '4px', fontFamily: 'var(--font-display)' }}>{letter}</div>
                </div>
              );
            })}
        </div>
      </div>

      <SimulationControls 
        showPlay={false} 
        showStep={false}
        onReset={handleReset}
      />
    </div>
  );
};

export default MonoalphabeticCipher;
