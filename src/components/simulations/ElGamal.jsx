import React, { useState } from 'react';
import SimulationControls from './SimulationControls';
import { modExp, modInverse } from '../../utils/rsaLogic';
import { ArrowRight, Lock, Unlock } from 'lucide-react';

const ElGamal = () => {
  const [pString, setPString] = useState('23');
  const [gString, setGString] = useState('5');
  const [xString, setXString] = useState('4'); // Private key
  const [kString, setKString] = useState('3'); // Ephemeral key
  const [mString, setMString] = useState('10'); // Plaintext Message

  const p = parseInt(pString) || 23;
  const g = parseInt(gString) || 5;
  const x = parseInt(xString) || 4;
  const k = parseInt(kString) || 3;
  const m = parseInt(mString) || 10;

  // Key Gen
  const y = modExp(g, x, p);
  
  // Encrypt
  const c1 = modExp(g, k, p);
  const yk = modExp(y, k, p);
  const c2 = (m * yk) % p;

  // Decrypt
  const s = modExp(c1, x, p);
  const sInv = modInverse(s, p);
  const mRec = (c2 * sInv) % p;

  // Steps:
  // 0: Initial
  // 1: Key Gen
  // 2: Encrypt Phase 1 (c1)
  // 3: Encrypt Phase 2 (c2)
  // 4: Decrypt Phase 1 (s)
  // 5: Decrypt Phase 2 (m)
  const [simStep, setSimStep] = useState(0);

  const handleStep = () => {
    if (simStep < 5) setSimStep(prev => prev + 1);
  };
  const handleReset = () => {
    setSimStep(0);
  };

  return (
    <div className="glass-panel" style={{ marginTop: '0rem' }}>
      <h3 style={{ color: 'var(--text-main)', fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>ElGamal Encryption</h3>
      <p className="text-muted" style={{ marginBottom: '2rem' }}>
        ElGamal extends the Diffie-Hellman discrete logarithm problem directly into an asymmetric encryption algorithm. Every encryption uniquely mixes a randomized ephemeral key (<span style={{ fontFamily: 'var(--font-display)' }}>k</span>).
      </p>

      {/* Config */}
      <div className="grid grid-cols-5 gap-4" style={{ marginBottom: '2rem' }}>
        <div>
          <label style={{ fontSize: '0.8rem', color: 'gray' }}>Prime (p)</label>
          <input type="number" value={pString} onChange={e=>setPString(e.target.value)} style={{width: '100%'}} />
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', color: 'gray' }}>Gen (g)</label>
          <input type="number" value={gString} onChange={e=>setGString(e.target.value)} style={{width: '100%'}} />
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--danger-red)' }}>Private (x)</label>
          <input type="number" value={xString} onChange={e=>setXString(e.target.value)} style={{width: '100%'}} />
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', color: 'gold' }}>Ephemeral (k)</label>
          <input type="number" value={kString} onChange={e=>setKString(e.target.value)} style={{width: '100%'}} />
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--primary-neon)' }}>Message (m)</label>
          <input type="number" value={mString} onChange={e=>setMString(e.target.value)} style={{width: '100%'}} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Step 1: Key Generation */}
        <div style={{ padding: '1rem', background: simStep >= 1 ? 'rgba(0,180,255,0.1)' : 'rgba(0,0,0,0.3)', border: simStep >= 1 ? '1px solid var(--accent-blue)' : '1px solid var(--panel-border)', borderRadius: '8px', transition: 'all 0.5s' }}>
           <h4 style={{ color: 'var(--accent-blue)', marginBottom: '1rem' }}>Step 1: Receiver Key Generation</h4>
           
           <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', opacity: simStep >= 1 ? 1 : 0.3 }}>
             <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--danger-red)', fontSize: '0.8rem' }}>Secret Picked</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--danger-red)' }}>x = {x}</div>
             </div>
             
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <div style={{ padding: '0.5rem', border: '1px dashed gray', borderRadius: '50%', color: 'var(--text-muted)' }}>g^x mod p</div>
               <ArrowRight size={24} color="var(--accent-blue)" />
             </div>

             <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(0,180,255,0.2)', borderRadius: '8px', boxShadow: '0 0 10px var(--accent-blue)' }}>
                <div style={{ color: 'var(--accent-blue)', fontSize: '0.8rem' }}>Public Key Published</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--accent-blue)' }}>y = {y}</div>
             </div>
           </div>
        </div>

        {/* Step 2: Encryption */}
        <div style={{ padding: '1rem', background: simStep >= 2 ? 'rgba(0,255,157,0.1)' : 'rgba(0,0,0,0.3)', border: simStep >= 2 ? '1px solid var(--primary-neon)' : '1px solid var(--panel-border)', borderRadius: '8px', transition: 'all 0.5s' }}>
           <h4 style={{ color: 'var(--primary-neon)', marginBottom: '1rem' }}><Lock size={16} style={{display: 'inline', marginRight: '0.5rem'}}/>Step 2: Sender Encryption</h4>
           
           <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', opacity: simStep >= 2 ? 1 : 0.3 }}>
             <div style={{ textAlign: 'center', maxWidth: '150px' }}>
                <div style={{ color: 'gold', fontSize: '0.8rem' }}>1. Ephemeral Key</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'gold' }}>k = {k}</div>
                <div style={{ fontSize: '0.7rem', color: 'gray', marginTop: '0.5rem' }}>Randomly generated per message</div>
             </div>
             
             {/* c1 Clock */}
             <div style={{ textAlign: 'center', background: 'var(--panel-bg)', padding: '1rem', borderRadius: '50%', border: '2px solid var(--accent-blue)', width: '120px', height: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>c<sub>1</sub> = g<sup>k</sup> mod p</div>
                {simStep >= 2 ? (
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--accent-blue)' }}>{c1}</div>
                ) : <div style={{color:'gray'}}>-</div>}
             </div>

             {/* c2 Combos */}
             <div style={{ textAlign: 'center', opacity: simStep >= 3 ? 1 : 0.2 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>c<sub>2</sub> = m · y<sup>k</sup> mod p</div>
                {simStep >= 3 ? (
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--accent-blue)', background: 'rgba(0,180,255,0.2)', padding: '1rem', borderRadius: '8px' }}>
                    {c2}
                  </div>
                ) : <div style={{color:'gray'}}>-</div>}
             </div>

             {simStep >= 3 && (
               <div style={{ textAlign: 'center' }}>
                 <div style={{ color: 'var(--accent-blue)' }}>Ciphertext Pair</div>
                 <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--accent-blue)' }}>({c1}, {c2})</div>
               </div>
             )}
           </div>
        </div>

        {/* Step 3: Decryption */}
        <div style={{ padding: '1rem', background: simStep >= 4 ? 'rgba(255,180,0,0.1)' : 'rgba(0,0,0,0.3)', border: simStep >= 4 ? '1px solid gold' : '1px solid var(--panel-border)', borderRadius: '8px', transition: 'all 0.5s' }}>
           <h4 style={{ color: 'gold', marginBottom: '1rem' }}><Unlock size={16} style={{display: 'inline', marginRight: '0.5rem'}}/>Step 3: Receiver Decryption</h4>
           
           <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', opacity: simStep >= 4 ? 1 : 0.3 }}>
             <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--danger-red)', fontSize: '0.8rem' }}>Recover Shared Secret</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--danger-red)' }}>s = c<sub>1</sub><sup style={{color: 'var(--danger-red)'}}>x</sup> mod p</div>
                {simStep >= 4 && <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'gold', marginTop: '0.5rem' }}>s = {s}</div>}
             </div>

             <ArrowRight size={24} color="gray" />

             <div style={{ textAlign: 'center', opacity: simStep >= 5 ? 1 : 0.2 }}>
                <div style={{ color: 'var(--primary-neon)', fontSize: '0.8rem' }}>Recover Message</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--primary-neon)' }}>m = c<sub>2</sub> · s<sup>-1</sup> mod p</div>
                {simStep >= 5 && (
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--primary-neon)', marginTop: '0.5rem', textShadow: '0 0 10px var(--primary-neon)' }}>
                    m = {mRec}
                  </div>
                )}
             </div>
           </div>
        </div>
      </div>

      <SimulationControls showPlay={true} canStep={simStep < 5} onStep={handleStep} onReset={handleReset} />
    </div>
  );
};

export default ElGamal;
