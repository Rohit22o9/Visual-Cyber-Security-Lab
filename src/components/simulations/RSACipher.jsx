import React, { useState, useMemo } from 'react';
import { generateRSATimeline } from '../../utils/rsaLogic';
import SimulationControls from './SimulationControls';
import { ArrowRight, Lock, Unlock } from 'lucide-react';

const RSACipher = () => {
  const [pString, setPString] = useState('11');
  const [qString, setQString] = useState('13');
  const [mString, setMString] = useState('7');

  const pipeline = useMemo(() => {
    try {
      return generateRSATimeline(pString, qString, mString);
    } catch (e) {
      return { error: e.message };
    }
  }, [pString, qString, mString]);

  // Key Generation Tab (EEA Simulation)
  const [activeTab, setActiveTab] = useState('keygen'); // 'keygen', 'encrypt'
  
  // Simulation Step controls ONLY the EEA table right now
  const [eeaStep, setEeaStep] = useState(0);

  const handleStep = () => {
    if (pipeline && !pipeline.error && eeaStep < pipeline.eeaSteps.length - 1) {
      setEeaStep(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setEeaStep(0);
  };

  return (
    <div className="glass-panel" style={{ marginTop: '0rem' }}>
      <h3 style={{ color: 'var(--text-main)', fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>RSA (Rivest-Shamir-Adleman)</h3>
      <p className="text-muted" style={{ marginBottom: '2rem' }}>
        RSA relies on the practical difficulty of factoring the product of two large prime numbers.
        <br/><span style={{ color: 'var(--danger-red)', fontSize: '0.8rem' }}>* Small primes used for demonstration. Real RSA uses 1024–4096 bit primes.</span>
      </p>

      {/* Configuration */}
      <div className="grid grid-cols-3 gap-4" style={{ marginBottom: '2rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-blue)' }}>Prime 1 (p):</label>
          <input type="number" value={pString} onChange={(e) => setPString(e.target.value)} style={{ width: '100%', fontFamily: 'var(--font-display)' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-blue)' }}>Prime 2 (q):</label>
          <input type="number" value={qString} onChange={(e) => setQString(e.target.value)} style={{ width: '100%', fontFamily: 'var(--font-display)' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--primary-neon)' }}>Message (m):</label>
          <input type="number" value={mString} onChange={(e) => setMString(e.target.value)} style={{ width: '100%', fontFamily: 'var(--font-display)' }} />
        </div>
      </div>

      {pipeline.error ? (
        <div style={{ background: 'rgba(255,45,85,0.2)', color: 'var(--danger-red)', padding: '1rem', borderRadius: '8px' }}>
          Error: {pipeline.error} (Ensure p and q are prime primes)
        </div>
      ) : (
        <>
          {/* TABS */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--panel-border)' }}>
            <button className="btn" style={{ background: activeTab === 'keygen' ? 'var(--panel-border)' : 'transparent', color: activeTab === 'keygen' ? 'gold' : 'var(--text-main)', borderBottom: activeTab === 'keygen' ? '2px solid gold' : 'none', borderRadius: '4px 4px 0 0' }} onClick={() => setActiveTab('keygen')}>
              1. Key Generation (EEA)
            </button>
            <button className="btn" style={{ background: activeTab === 'encrypt' ? 'var(--panel-border)' : 'transparent', color: activeTab === 'encrypt' ? 'var(--primary-neon)' : 'var(--text-main)', borderBottom: activeTab === 'encrypt' ? '2px solid var(--primary-neon)' : 'none', borderRadius: '4px 4px 0 0' }} onClick={() => setActiveTab('encrypt')}>
              2. Encrypt & Decrypt
            </button>
          </div>

          {activeTab === 'keygen' && (
            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
              <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '2rem' }}>
                <div style={{ background: 'var(--panel-bg)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--accent-blue)' }}>
                   <div style={{ color: 'var(--accent-blue)', marginBottom: '0.5rem' }}>Step 1: Core Parameters</div>
                   <div style={{ fontFamily: 'var(--font-display)' }}>
                     <div>Modulus <span style={{ color: 'white' }}>n = p × q = {pipeline.n}</span></div>
                     <div>Totient <span style={{ color: 'white' }}>φ(n) = (p-1)(q-1) = {pipeline.phi}</span></div>
                   </div>
                </div>
                <div style={{ background: 'var(--panel-bg)', padding: '1rem', borderRadius: '8px', border: '1px solid gold' }}>
                   <div style={{ color: 'gold', marginBottom: '0.5rem' }}>Step 2: Public Key (e)</div>
                   <div style={{ fontFamily: 'var(--font-display)', color: 'white' }}>
                     Selected <span style={{ color: 'gold' }}>e = {pipeline.e}</span><br/>
                     <span style={{ fontSize: '0.8rem', color: 'gray' }}>gcd(e, φ(n)) === 1</span>
                   </div>
                </div>
              </div>

              {/* EEA Table Animation */}
              <div>
                <h4 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>Step 3: Finding Private Key d (Extended Euclidean Algorithm)</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  The Extended Euclidean Algorithm finds <span style={{ fontFamily: 'var(--font-display)' }}>d</span> such that <span style={{ fontFamily: 'var(--font-display)' }}>e · d ≡ 1 (mod φ(n))</span>.
                </p>

                <div style={{ overflowX: 'auto', marginBottom: '2rem', border: '1px solid var(--panel-border)', borderRadius: '8px' }}>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontFamily: 'var(--font-display)' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <th style={{ padding: '0.5rem' }}>Step</th>
                        <th style={{ padding: '0.5rem' }}>a</th>
                        <th style={{ padding: '0.5rem' }}>b</th>
                        <th style={{ padding: '0.5rem' }}>q = ⌊a/b⌋</th>
                        <th style={{ padding: '0.5rem' }}>r = a % b</th>
                        <th style={{ padding: '0.5rem' }}>s</th>
                        <th style={{ padding: '0.5rem' }}>t</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pipeline.eeaSteps.slice(0, eeaStep + 1).map((row, idx) => {
                        const isLast = idx === pipeline.eeaSteps.length - 1;
                        const isCurrentActive = idx === eeaStep && !isLast;
                        
                        return (
                          <tr key={idx} style={{ 
                            background: isCurrentActive ? 'rgba(0, 255, 157, 0.1)' : 'transparent',
                            color: isCurrentActive ? 'var(--primary-neon)' : 'var(--text-main)',
                            borderBottom: '1px solid var(--panel-border)',
                            transition: 'all 0.3s'
                          }}>
                            <td style={{ padding: '0.5rem' }}>{row.stepCount}</td>
                            <td style={{ padding: '0.5rem' }}>{row.a}</td>
                            <td style={{ padding: '0.5rem' }}>{row.b}</td>
                            <td style={{ padding: '0.5rem' }}>{row.q}</td>
                            <td style={{ padding: '0.5rem' }}>{row.r}</td>
                            <td style={{ padding: '0.5rem' }}>{row.s}</td>
                            <td style={{ padding: '0.5rem' }}>{row.t === '-' ? '-' : <span style={{ color: isLast ? 'gold' : 'inherit', fontWeight: isLast ? 'bold' : 'normal' }}>{row.t}</span>}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {eeaStep === pipeline.eeaSteps.length - 1 && (
                  <div style={{ background: 'rgba(255,180,0,0.2)', border: '1px solid gold', padding: '1rem', borderRadius: '8px', textAlign: 'center', fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: 'white' }}>
                    Private Key <span style={{ color: 'gold', fontWeight: 'bold' }}>d = {pipeline.d}</span>
                  </div>
                )}

                <SimulationControls 
                  showPlay={true}
                  canStep={eeaStep < pipeline.eeaSteps.length - 1}
                  onStep={handleStep}
                  onReset={handleReset}
                />
              </div>

            </div>
          )}

          {activeTab === 'encrypt' && (
            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
               
               {/* Public Key Encryption */}
               <div style={{ background: 'rgba(0,180,255,0.1)', border: '1px solid var(--accent-blue)', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '600px', textAlign: 'center' }}>
                 <Lock size={32} color="var(--accent-blue)" style={{ margin: '0 auto 1rem' }} />
                 <h4 style={{ color: 'var(--accent-blue)', marginBottom: '1rem' }}>Encryption (Alice using Bob's Public Key)</h4>
                 <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', background: 'var(--panel-bg)', padding: '1rem', borderRadius: '4px' }}>
                    c = m<sup style={{ color: 'gold' }}>e</sup> <span style={{ fontSize: '1rem' }}>mod n</span>
                 </div>
                 <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginTop: '1rem', color: 'var(--text-main)' }}>
                    c = {mString}<sup style={{ color: 'gold' }}>{pipeline.e}</sup> <span style={{ fontSize: '1rem' }}>mod {pipeline.n}</span>
                 </div>
                 <ArrowRight size={24} color="gray" style={{ margin: '1rem auto' }} />
                 <div style={{ fontSize: '2rem', color: 'var(--primary-neon)', fontFamily: 'var(--font-display)' }}>
                    Ciphertext = {pipeline.c}
                 </div>
               </div>

               {/* Private Key Decryption */}
               <div style={{ background: 'rgba(255,45,85,0.1)', border: '1px solid var(--danger-red)', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '600px', textAlign: 'center' }}>
                 <Unlock size={32} color="var(--danger-red)" style={{ margin: '0 auto 1rem' }} />
                 <h4 style={{ color: 'var(--danger-red)', marginBottom: '1rem' }}>Decryption (Bob using Private Key)</h4>
                 <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', background: 'var(--panel-bg)', padding: '1rem', borderRadius: '4px' }}>
                    m = c<sup style={{ color: 'gold' }}>d</sup> <span style={{ fontSize: '1rem' }}>mod n</span>
                 </div>
                 <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginTop: '1rem', color: 'var(--text-main)' }}>
                    m = {pipeline.c}<sup style={{ color: 'gold' }}>{pipeline.d}</sup> <span style={{ fontSize: '1rem' }}>mod {pipeline.n}</span>
                 </div>
                 <ArrowRight size={24} color="gray" style={{ margin: '1rem auto' }} />
                 <div style={{ fontSize: '2rem', color: 'var(--primary-neon)', fontFamily: 'var(--font-display)' }}>
                    Message = {pipeline.decryptedM}
                 </div>
               </div>

               <div style={{ color: pipeline.decryptedM == mString ? 'var(--primary-neon)' : 'var(--danger-red)' }}>
                  {pipeline.decryptedM == mString ? "Success: Decrypted message matches original!" : "Failed to decrypt."}
               </div>

            </div>
          )}
        </>
      )}

    </div>
  );
};

export default RSACipher;
