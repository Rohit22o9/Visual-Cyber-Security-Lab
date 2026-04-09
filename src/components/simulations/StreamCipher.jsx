import React, { useState, useEffect } from 'react';
import SimulationControls from './SimulationControls';

const textToBinary = (text) => {
  return text.split('').map(char => {
    return char.charCodeAt(0).toString(2).padStart(8, '0');
  }).join('');
};

const StreamCipher = () => {
  const [plaintext, setPlaintext] = useState('HI');
  const [keystream, setKeystream] = useState('');
  const [currentStep, setCurrentStep] = useState(-1);
  
  // Convert plaintext to a strict binary string
  const plainBin = textToBinary(plaintext.substring(0, 10)); // Limit length for visualizer

  // Generate random keystream of same length when plaintext changes
  useEffect(() => {
    let ks = '';
    for(let i=0; i<plainBin.length; i++) {
      ks += Math.round(Math.random()).toString();
    }
    setKeystream(ks);
    handleReset();
  }, [plaintext, plainBin.length]);

  const handleReset = () => {
    setCurrentStep(-1);
  };

  const handleStep = () => {
    if (currentStep < plainBin.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Derive ciphertext bits up to the current step
  const getCipherBits = () => {
    let cb = [];
    for(let i = 0; i <= currentStep; i++) {
        const pBit = parseInt(plainBin[i], 10);
        const kBit = parseInt(keystream[i], 10);
        cb.push((pBit ^ kBit).toString());
    }
    return cb;
  };

  const cipherBits = getCipherBits();

  return (
    <div className="glass-panel" style={{ marginTop: '4rem' }}>
      <h3>Stream Cipher (XOR)</h3>
      <p className="text-muted" style={{ marginBottom: '2rem' }}>
        Encrypts data bit-by-bit using a pseudo-random Keystream. It relies on the XOR (⊕) operation. XOR outputs 1 if the bits differ, and 0 if they are identical.
      </p>

      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-blue)' }}>Plaintext (Max 10 Chars):</label>
        <input 
          type="text" 
          value={plaintext}
          maxLength="10"
          onChange={(e) => setPlaintext(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ background: 'rgba(0,0,0,0.5)', padding: '2rem', borderRadius: '8px', overflowX: 'auto', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontFamily: 'var(--font-display)', fontSize: '1.2rem', minWidth: 'max-content' }}>
          
          {/* Plaintext row */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '120px', color: 'var(--accent-blue)' }}>Plaintext (P):</div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {plainBin.split('').map((bit, i) => (
                <div key={`p-${i}`} style={{
                  width: '24px', textAlign: 'center',
                  background: i === currentStep ? 'rgba(0,180,255,0.3)' : 'transparent',
                  color: 'var(--text-main)', borderBottom: '1px solid var(--panel-border)'
                }}>
                  {bit}
                </div>
              ))}
            </div>
          </div>

          {/* Keystream row */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '120px', color: 'var(--danger-red)' }}>Keystream (K):</div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {keystream.split('').map((bit, i) => (
                <div key={`k-${i}`} style={{
                  width: '24px', textAlign: 'center',
                  background: i === currentStep ? 'rgba(255,45,85,0.3)' : 'transparent',
                  color: 'var(--text-main)', borderBottom: '1px solid var(--panel-border)'
                }}>
                  {bit}
                </div>
              ))}
            </div>
          </div>

          <div style={{ paddingLeft: '110px' }}>
            <hr style={{ borderColor: 'rgba(255,255,255,0.1)', width: `${plainBin.length * 28}px`, margin: 0 }} />
          </div>

          {/* Ciphertext row */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '120px', color: 'var(--primary-neon)' }}>Result C (P⊕K):</div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {plainBin.split('').map((_, i) => (
                <div key={`c-${i}`} style={{
                  width: '24px', textAlign: 'center',
                  color: 'var(--primary-neon)', fontWeight: i === currentStep ? 'bold' : 'normal',
                  transform: i === currentStep ? 'scale(1.2)' : 'scale(1)',
                  transition: 'transform 0.2s', textShadow: i === currentStep ? '0 0 10px rgba(0,255,157,0.8)' : 'none'
                }}>
                  {i <= currentStep ? cipherBits[i] : '-'}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <SimulationControls 
        showPlay={false}
        canStep={currentStep < plainBin.length - 1}
        onStep={handleStep}
        onReset={handleReset}
      />
    </div>
  );
};

export default StreamCipher;
