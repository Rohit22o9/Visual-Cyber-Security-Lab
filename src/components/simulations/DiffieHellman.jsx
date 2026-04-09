import React, { useState, useEffect } from 'react';
import SimulationControls from './SimulationControls';
import { modExp } from '../../utils/rsaLogic'; // Reusing modular exponentiation

const DiffieHellman = () => {
  const p = 23;
  const g = 5;
  const a = 4; // Alice private
  const b = 3; // Bob private

  const A = modExp(g, a, p); // 5^4 mod 23 = 4
  const B = modExp(g, b, p); // 5^3 mod 23 = 10
  
  const sharedA = modExp(B, a, p); // 10^4 mod 23 = 18
  const sharedB = modExp(A, b, p); // 4^3 mod 23 = 18

  const [simStep, setSimStep] = useState(0);

  // Steps:
  // 0: Initial state (Public parameters agreed)
  // 1: Secret keys selected
  // 2: Mixed keys computed
  // 3: Mixed keys exchanged over public channel
  // 4: Shared secret computed
  // 5: Eve attempts to crack (Attacker panel slides in)

  const handleStep = () => {
    if(simStep < 5) setSimStep(prev => prev + 1);
  };
  const handleReset = () => {
    setSimStep(0);
  };

  const [eveCracking, setEveCracking] = useState(false);
  const [eveGuess, setEveGuess] = useState('');

  // Handle Eve's brute force animation
  useEffect(() => {
    if (simStep === 5) {
      setEveCracking(true);
      
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        const randX = Math.floor(Math.random() * p);
        const testA = modExp(g, randX, p);
        setEveGuess(`Trying x = ${randX} -> g^x mod p = ${testA}`);
        
        if (attempts > 20) {
          clearInterval(interval);
          setEveCracking(false);
          setEveGuess('Cannot solve — Discrete Logarithm Problem');
        }
      }, 100);

      return () => clearInterval(interval);
    } else {
      setEveCracking(false);
      setEveGuess('');
    }
  }, [simStep]);

  return (
    <div className="glass-panel" style={{ marginTop: '0rem' }}>
      <h3 style={{ color: 'var(--text-main)', fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>Diffie-Hellman Key Exchange</h3>
      <p className="text-muted" style={{ marginBottom: '2rem' }}>
        Diffie-Hellman allows two parties to securely generate a shared secret over an insecure public channel. We demonstrate this using the classic paint-mixing analogy alongside the real <span style={{ fontFamily: 'var(--font-display)' }}>g<sup>x</sup> mod p</span> discrete logarithm mathematics.
      </p>

      {/* Main visualization area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', position: 'relative', minHeight: '500px' }}>
        
        {/* ALICE COLUMN */}
        <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '1rem', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>Alice</h4>
          
          {/* Public Base */}
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Public Base</div>
            <div style={{ width: '40px', height: '40px', background: 'gold', borderRadius: '50%', margin: '0.5rem auto', boxShadow: '0 0 10px gold' }}></div>
            <div style={{ fontFamily: 'var(--font-display)' }}>g = {g}, p = {p}</div>
          </div>

          {/* Private Key */}
          {simStep >= 1 && (
            <div style={{ textAlign: 'center', marginBottom: '1rem', animation: 'fadeIn 0.5s' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Private Secret</div>
              <div style={{ width: '40px', height: '40px', background: 'var(--danger-red)', borderRadius: '50%', margin: '0.5rem auto', boxShadow: '0 0 10px var(--danger-red)' }}></div>
              <div style={{ fontFamily: 'var(--font-display)', color: 'var(--danger-red)' }}>a = {a}</div>
            </div>
          )}

          {/* Mixed Key (Public to send) */}
          {simStep >= 2 && (
            <div style={{ textAlign: 'center', marginBottom: '1rem', padding: '1rem', background: 'rgba(255,180,0,0.2)', borderRadius: '8px', border: '1px solid gold', animation: 'fadeIn 0.5s' }}>
              <div style={{ color: 'gold', fontSize: '0.8rem' }}>Public Mixture</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.5rem 0' }}>
                 <div style={{ width: '20px', height: '20px', background: 'gold', borderRadius: '50%' }}></div> + 
                 <div style={{ width: '20px', height: '20px', background: 'var(--danger-red)', borderRadius: '50%' }}></div> =
                 <div style={{ width: '30px', height: '30px', background: '#FF8800', borderRadius: '50%', marginLeft: '0.5rem' }}></div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)' }}>A = g<sup style={{ color: 'var(--danger-red)' }}>a</sup> mod p</div>
              <div style={{ fontFamily: 'var(--font-display)', color: 'gold', fontSize: '1.2rem' }}>{A}</div>
            </div>
          )}

          {/* Final Shared Secret */}
          {simStep >= 4 && (
            <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(0,255,157,0.2)', borderRadius: '8px', border: '1px solid var(--primary-neon)', animation: 'fadeIn 0.5s', marginTop: 'auto' }}>
              <div style={{ color: 'var(--primary-neon)', fontSize: '0.8rem', fontWeight: 'bold' }}>Shared Secret</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.5rem 0' }}>
                 <div style={{ width: '20px', height: '20px', background: 'var(--danger-red)', borderRadius: '50%' }}></div> + 
                 <div style={{ width: '20px', height: '20px', background: '#8888FF', borderRadius: '50%' }}></div> =
                 <div style={{ width: '40px', height: '40px', background: '#996633', borderRadius: '50%', marginLeft: '0.5rem', border: '2px solid var(--primary-neon)' }}></div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)' }}>S = B<sup style={{ color: 'var(--danger-red)' }}>a</sup> mod p</div>
              <div style={{ fontFamily: 'var(--font-display)', color: 'var(--primary-neon)', fontSize: '1.5rem' }}>{sharedA}</div>
            </div>
          )}
        </div>

        {/* EVE COLUMN (ATTACKER) - Hidden unless Step 5 */}
        <div style={{ 
          flex: 1, background: 'rgba(0,0,0,0.8)', border: '1px dashed var(--danger-red)', borderRadius: '8px', padding: '1rem', zIndex: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          opacity: simStep === 5 ? 1 : 0, transform: simStep === 5 ? 'translateY(0)' : 'translateY(50px)', transition: 'all 0.5s ease-out'
        }}>
           <h4 style={{ color: 'var(--danger-red)', marginBottom: '1rem' }}>Eve (Attacker)</h4>
           
           <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Intercepted Public Values:</div>
           <div style={{ background: 'rgba(255,45,85,0.2)', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--danger-red)', margin: '1rem 0', fontFamily: 'var(--font-display)' }}>
             <div style={{ color: 'gold' }}>g = {g}, p = {p}</div>
             <div style={{ color: '#FF8800' }}>A = {A}</div>
             <div style={{ color: '#8888FF' }}>B = {B}</div>
           </div>

           <div style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)', fontSize: '0.8rem', textAlign: 'center', marginTop: '1rem' }}>
             Attacking g<sup style={{ color: 'red' }}>x</sup> mod p = A...
           </div>

           <div style={{ 
             marginTop: '0.5rem', fontFamily: 'var(--font-display)', fontSize: '0.9rem',
             color: eveCracking ? 'gold' : 'var(--danger-red)',
             background: 'var(--panel-bg)', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--panel-border)',
             width: '100%', textAlign: 'center'
           }}>
             {eveGuess || 'Waiting...'}
             {!eveCracking && eveGuess && (
               <div style={{ fontSize: '2rem', marginTop: '0.5rem' }}>✗</div>
             )}
           </div>

        </div>

        {/* NETWORK SWAP ANIMATION LAYER */}
        {simStep === 3 && (
          <div style={{ position: 'absolute', top: '250px', left: '0', width: '100%', height: '50px', zIndex: 20, pointerEvents: 'none' }}>
             <div style={{ position: 'absolute', left: '20%', width: '30px', height: '30px', background: '#FF8800', borderRadius: '50%', boxShadow: '0 0 10px #FF8800', animation: 'flyRight 2s forwards' }}></div>
             <div style={{ position: 'absolute', right: '20%', width: '30px', height: '30px', background: '#8888FF', borderRadius: '50%', boxShadow: '0 0 10px #8888FF', animation: 'flyLeft 2s forwards' }}></div>
             <style>{`
               @keyframes flyRight { 0% { left: 20%; opacity: 1; } 100% { left: 70%; opacity: 0; } }
               @keyframes flyLeft { 0% { right: 20%; opacity: 1; } 100% { right: 70%; opacity: 0; } }
             `}</style>
          </div>
        )}

        {/* BOB COLUMN */}
        <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '1rem', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>Bob</h4>
          
          {/* Public Base */}
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Public Base</div>
            <div style={{ width: '40px', height: '40px', background: 'gold', borderRadius: '50%', margin: '0.5rem auto', boxShadow: '0 0 10px gold' }}></div>
            <div style={{ fontFamily: 'var(--font-display)' }}>g = {g}, p = {p}</div>
          </div>

          {/* Private Key */}
          {simStep >= 1 && (
            <div style={{ textAlign: 'center', marginBottom: '1rem', animation: 'fadeIn 0.5s' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Private Secret</div>
              <div style={{ width: '40px', height: '40px', background: 'var(--accent-blue)', borderRadius: '50%', margin: '0.5rem auto', boxShadow: '0 0 10px var(--accent-blue)' }}></div>
              <div style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-blue)' }}>b = {b}</div>
            </div>
          )}

          {/* Mixed Key (Public to send) */}
          {simStep >= 2 && (
            <div style={{ textAlign: 'center', marginBottom: '1rem', padding: '1rem', background: 'rgba(0,180,255,0.2)', borderRadius: '8px', border: '1px solid var(--accent-blue)', animation: 'fadeIn 0.5s' }}>
              <div style={{ color: 'var(--accent-blue)', fontSize: '0.8rem' }}>Public Mixture</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.5rem 0' }}>
                 <div style={{ width: '20px', height: '20px', background: 'gold', borderRadius: '50%' }}></div> + 
                 <div style={{ width: '20px', height: '20px', background: 'var(--accent-blue)', borderRadius: '50%' }}></div> =
                 <div style={{ width: '30px', height: '30px', background: '#8888FF', borderRadius: '50%', marginLeft: '0.5rem' }}></div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)' }}>B = g<sup style={{ color: 'var(--accent-blue)' }}>b</sup> mod p</div>
              <div style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-blue)', fontSize: '1.2rem' }}>{B}</div>
            </div>
          )}

          {/* Final Shared Secret */}
          {simStep >= 4 && (
            <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(0,255,157,0.2)', borderRadius: '8px', border: '1px solid var(--primary-neon)', animation: 'fadeIn 0.5s', marginTop: 'auto' }}>
              <div style={{ color: 'var(--primary-neon)', fontSize: '0.8rem', fontWeight: 'bold' }}>Shared Secret</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.5rem 0' }}>
                 <div style={{ width: '20px', height: '20px', background: 'var(--accent-blue)', borderRadius: '50%' }}></div> + 
                 <div style={{ width: '20px', height: '20px', background: '#FF8800', borderRadius: '50%' }}></div> =
                 <div style={{ width: '40px', height: '40px', background: '#996633', borderRadius: '50%', marginLeft: '0.5rem', border: '2px solid var(--primary-neon)' }}></div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)' }}>S = A<sup style={{ color: 'var(--accent-blue)' }}>b</sup> mod p</div>
              <div style={{ fontFamily: 'var(--font-display)', color: 'var(--primary-neon)', fontSize: '1.5rem' }}>{sharedB}</div>
            </div>
          )}
        </div>

      </div>

      <SimulationControls 
        showPlay={true}
        canStep={simStep < 5} 
        onStep={handleStep} 
        onReset={handleReset} 
      />
    </div>
  );
};

export default DiffieHellman;
