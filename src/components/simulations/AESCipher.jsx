import React, { useState } from 'react';
import SimulationControls from './SimulationControls';

const initialMatrix = [
  ['19', '3D', 'E3', 'BE'],
  ['A0', 'F4', 'E2', '2B'],
  ['9A', 'C6', '8D', '2A'],
  ['E9', 'F8', '48', '08']
];

const subBytesMatrix = [
  ['D4', '27', '11', 'AE'],
  ['E0', 'BF', '98', 'F1'],
  ['B8', 'B4', '5D', 'E5'],
  ['1E', '41', '52', '30']
];

const shiftRowsMatrix = [
  ['D4', '27', '11', 'AE'],
  ['BF', '98', 'F1', 'E0'],
  ['5D', 'E5', 'B8', 'B4'],
  ['30', '1E', '41', '52']
];

const mixColumnsMatrix = [
  ['04', '66', '81', 'E5'],
  ['E0', 'CB', '19', '9A'],
  ['48', 'F8', 'D3', '7A'],
  ['28', '06', '26', '4C']
];

const addRoundKeyMatrix = [
  ['A4', '9C', '7F', 'F2'],
  ['68', '9F', '35', '2B'],
  ['6B', '5B', 'EA', '43'],
  ['08', '15', '16', '12']
];

const AESCipher = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const getMatrix = () => {
    switch(currentStep) {
      case 0: return initialMatrix;
      case 1: return subBytesMatrix;
      case 2: return shiftRowsMatrix;
      case 3: return mixColumnsMatrix;
      case 4: return addRoundKeyMatrix;
      default: return initialMatrix;
    }
  };

  const currentMatrix = getMatrix();

  const handleStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  const getStepName = () => {
    switch(currentStep) {
      case 0: return "Initial State";
      case 1: return "1. SubBytes (Non-linear substitution)";
      case 2: return "2. ShiftRows (Cyclic row shifting)";
      case 3: return "3. MixColumns (Matrix multiplication)";
      case 4: return "4. AddRoundKey (XOR with Subkey)";
      default: return "";
    }
  };

  return (
    <div className="glass-panel" style={{ marginTop: '0rem' }}>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>AES State Matrix (1 Round)</h4>
          <p className="text-muted" style={{ marginBottom: '1rem' }}>
            The Advanced Encryption Standard (AES) processes data in a 4x4 matrix of bytes called the "State". 
            A full encryption runs 10 to 14 rounds. This visualizer isolates a single complete round to demonstrate the SPN (Substitution-Permutation Network) physics.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '2rem' }}>
            <div style={{ padding: '0.5rem 1rem', borderLeft: currentStep === 1 ? '4px solid var(--primary-neon)' : '4px solid transparent', background: currentStep === 1 ? 'rgba(0,255,157,0.1)' : 'transparent', color: currentStep === 1 ? 'var(--primary-neon)' : 'var(--text-muted)', transition: 'all 0.3s' }}>
              <strong>SubBytes:</strong> Replaces each byte via a lookup table (S-Box).
            </div>
            <div style={{ padding: '0.5rem 1rem', borderLeft: currentStep === 2 ? '4px solid var(--accent-blue)' : '4px solid transparent', background: currentStep === 2 ? 'rgba(0,180,255,0.1)' : 'transparent', color: currentStep === 2 ? 'var(--accent-blue)' : 'var(--text-muted)', transition: 'all 0.3s' }}>
              <strong>ShiftRows:</strong> Shifts the last three rows cyclically (Row 1 shifts 1 left, Row 2 shifts 2, etc).
            </div>
            <div style={{ padding: '0.5rem 1rem', borderLeft: currentStep === 3 ? '4px solid var(--danger-red)' : '4px solid transparent', background: currentStep === 3 ? 'rgba(255,45,85,0.1)' : 'transparent', color: currentStep === 3 ? 'var(--danger-red)' : 'var(--text-muted)', transition: 'all 0.3s' }}>
              <strong>MixColumns:</strong> Mixes the bytes in each column independently using Galois field mathematics.
            </div>
            <div style={{ padding: '0.5rem 1rem', borderLeft: currentStep === 4 ? '4px solid gold' : '4px solid transparent', background: currentStep === 4 ? 'rgba(255,180,0,0.1)' : 'transparent', color: currentStep === 4 ? 'gold' : 'var(--text-muted)', transition: 'all 0.3s' }}>
              <strong>AddRoundKey:</strong> XORs the State matrix with the round's subkey.
            </div>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            
          <h4 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>{getStepName()}</h4>
          
          <div style={{ 
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', 
            background: 'var(--panel-border)', padding: '4px', borderRadius: '8px'
          }}>
            {currentMatrix.map((row, r) => 
              row.map((val, c) => {
                let cellColor = 'var(--text-main)';
                if(currentStep === 1) cellColor = 'var(--primary-neon)';
                if(currentStep === 2) cellColor = 'var(--accent-blue)';
                if(currentStep === 3) cellColor = 'var(--danger-red)';
                if(currentStep === 4) cellColor = 'gold';

                // Visualize the ShiftRows offset dynamically visually
                let xOffset = '0px';
                if (currentStep === 2) {
                  // visually show they came from right
                  xOffset = `${r * -10}px`; 
                }

                return (
                  <div key={`${r}-${c}`} style={{
                    width: '60px', height: '60px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'var(--panel-bg)', borderRadius: '4px',
                    fontFamily: 'var(--font-display)', fontSize: '1.2rem',
                    color: cellColor, transition: 'all 0.5s ease',
                    transform: `translateX(${xOffset})`
                  }}>
                    {val}
                  </div>
                )
              })
            )}
          </div>
        </div>

      </div>

      <SimulationControls 
        showPlay={false}
        canStep={currentStep < 4}
        onStep={handleStep}
        onReset={handleReset}
      />
    </div>
  );
};

export default AESCipher;
