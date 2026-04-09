import React, { useState } from 'react';
import { ArrowDown, ArrowRight, ArrowLeft } from 'lucide-react';
import SimulationControls from './SimulationControls';

const DESCipher = () => {
  const [currentRound, setCurrentRound] = useState(0);
  const totalRounds = 16;

  const handleStep = () => {
    if (currentRound < totalRounds + 2) { // Allow states for initial perm and final perm
      setCurrentRound(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentRound(0);
  };

  const getPhaseDescription = () => {
    if (currentRound === 0) return "Initial Permutation (IP): rearranging the 64-bit plaintext block.";
    if (currentRound >= 1 && currentRound <= 16) return `Feistel Round ${currentRound}: L(n) = R(n-1), R(n) = L(n-1) ⊕ f(R(n-1), K(n))`;
    return "Final Permutation (FP): The inverse of IP to produce the 64-bit Ciphertext.";
  };

  const isActiveRound = currentRound >= 1 && currentRound <= 16;

  return (
    <div className="glass-panel" style={{ marginTop: '0rem' }}>
      
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        
        {/* State Information */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>DES Feistel Network</h4>
          <p className="text-muted" style={{ marginBottom: '1rem' }}>
            The Data Encryption Standard (DES) splits its 64-bit block into two 32-bit halves (L and R), parsing them through 16 identical operating "Rounds" utilizing 48-bit subkeys.
          </p>

          <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--primary-neon)' }}>Current Phase: </span>
            <strong style={{ fontFamily: 'var(--font-display)' }}>{getPhaseDescription()}</strong>
          </div>

          {/* F-Function Diagram (Only highlighted during round processing) */}
          <div style={{ 
            opacity: isActiveRound ? 1 : 0.3, transition: 'opacity 0.3s',
            border: '1px solid var(--accent-blue)', padding: '1.5rem', borderRadius: '8px',
            background: isActiveRound ? 'rgba(0,180,255,0.05)' : 'transparent'
          }}>
            <h5 style={{ color: 'var(--accent-blue)', marginBottom: '1rem', textAlign: 'center' }}>The f-Function Breakdown</h5>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-display)', fontSize: '0.8rem' }}>
              <div style={{ background: 'var(--panel-bg)', padding: '0.5rem 1rem', border: '1px solid gray', borderRadius: '4px', color: 'var(--text-main)' }}>
                R(n-1) (32 bits)
              </div>
              <ArrowDown size={16} color="gray" />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'rgba(255,45,85,0.2)', color: 'var(--danger-red)', padding: '0.5rem 1rem', border: '1px solid var(--danger-red)', borderRadius: '4px', textAlign: 'center' }}>
                  Expansion P-box<br/>(32 → 48 bits)
                </div>
              </div>
              <ArrowDown size={16} color="var(--danger-red)" />
              
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ background: 'rgba(0,255,157,0.2)', color: 'var(--primary-neon)', padding: '0.5rem', border: '1px solid var(--primary-neon)', borderRadius: '50%' }}>
                  ⊕
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: '0.5rem', color: 'var(--primary-neon)' }}>
                  <ArrowLeft size={16} /> Subkey K(n) (48 bits)
                </div>
              </div>
              <ArrowDown size={16} color="var(--primary-neon)" />

              <div style={{ background: 'rgba(255,180,0,0.2)', color: 'gold', padding: '0.5rem 1rem', border: '1px solid gold', borderRadius: '4px', textAlign: 'center', width: '100%' }}>
                S-Boxes (Substitution)<br/>(48 → 32 bits)
              </div>
              <ArrowDown size={16} color="gold" />

              <div style={{ background: 'var(--panel-bg)', padding: '0.5rem 1rem', border: '1px solid gray', borderRadius: '4px', color: 'var(--text-muted)', textAlign: 'center', width: '100%' }}>
                Straight P-box
              </div>
            </div>
          </div>
        </div>

        {/* Global Pipeline Visualizer */}
        <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              background: currentRound === 0 ? 'var(--primary-neon)' : 'var(--panel-bg)',
              color: currentRound === 0 ? '#000' : 'var(--text-main)',
              border: '1px solid var(--primary-neon)',
              padding: '0.5rem 2rem', borderRadius: '4px', fontWeight: 'bold', transition: 'all 0.3s'
            }}>
              Plaintext (64 bits)
            </div>
            
            <ArrowDown size={24} color="gray" style={{ margin: '0.5rem 0' }} />

            <div style={{ display: 'flex', gap: '3rem', margin: '1rem 0' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--accent-blue)', fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>L-Half</div>
                <div style={{ width: '60px', height: '100px', border: '2px solid var(--accent-blue)', borderRight: 'none', position: 'relative' }}>
                   {isActiveRound && (
                     <div style={{ position: 'absolute', top: '10%', right: '-40%', width: '100%', height: '80%', borderTop: '2px dashed var(--accent-blue)', borderRight: '2px dashed var(--accent-blue)', borderBottom: '2px dashed var(--accent-blue)' }}>
                       <div style={{ position: 'absolute', right: '-15px', top: '40%', background: 'var(--panel-bg)', borderRadius:'50%', padding: '2px', border: '1px solid var(--accent-blue)' }}>⊕</div>
                     </div>
                   )}
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--danger-red)', fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>R-Half</div>
                <div style={{ width: '60px', height: '100px', border: '2px solid var(--danger-red)', borderLeft: 'none', position: 'relative' }}>
                  {isActiveRound && (
                    <div style={{ position: 'absolute', top: '50%', left: '-50%', transform: 'translateY(-50%)', background: 'var(--panel-bg)', border: '1px solid var(--primary-neon)', padding: '0.2rem 0.5rem', color: 'var(--primary-neon)', fontSize: '0.7rem' }}>
                      f-func
                    </div>
                  )}
                </div>
              </div>
            </div>

            <ArrowDown size={24} color="gray" style={{ margin: '0.5rem 0' }} />

            <div style={{
              background: currentRound > 16 ? 'var(--primary-neon)' : 'var(--panel-bg)',
              color: currentRound > 16 ? '#000' : 'var(--text-main)',
              border: '1px solid var(--primary-neon)',
              padding: '0.5rem 2rem', borderRadius: '4px', fontWeight: 'bold', transition: 'all 0.3s'
            }}>
              Ciphertext (64 bits)
            </div>

        </div>

      </div>

      <SimulationControls 
        showPlay={false}
        canStep={currentRound < totalRounds + 1} // Initial -> 16 rounds -> Final
        onStep={handleStep}
        onReset={handleReset}
      />
    </div>
  );
};

export default DESCipher;
