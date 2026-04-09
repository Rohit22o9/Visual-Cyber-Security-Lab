import React, { useState, useMemo } from 'react';
import { generateAESTimeline, getBitDifferences } from '../../utils/aesLogic';
import SimulationControls from './SimulationControls';

const toHex = (val) => val.toString(16).padStart(2, '0').toUpperCase();

const AESCipher = () => {
  const [plaintext, setPlaintext] = useState('00112233445566778899AABBCCDDEEFF');
  const [key, setKey] = useState('000102030405060708090A0B0C0D0E0F');
  
  const [activeTab, setActiveTab] = useState('main');
  const [showKeySidebar, setShowKeySidebar] = useState(false);
  
  // Simulation Steps
  const [simStep, setSimStep] = useState(0); 
  // Max steps = Initial(1) + 9 rounds * 4 phases(36) + Final round * 3 phases(3) = 40 steps total

  const pipeline = useMemo(() => {
    try {
      const pt = plaintext.padEnd(32, '0').substring(0, 32);
      const k = key.padEnd(32, '0').substring(0, 32);
      // Generate standard timeline
      const std = generateAESTimeline(pt, k);
      
      // For avalanche, flip 1 bit of plaintext
      const pBytes = [];
      for(let i=0; i<32; i+=2) pBytes.push(parseInt(pt.substr(i,2), 16));
      pBytes[0] ^= 1; // Flip LSB of first byte
      const ptFlipped = pBytes.map(toHex).join('');
      const flipped = generateAESTimeline(ptFlipped, k);

      return { std, flipped };
    } catch(e) {
      return null;
    }
  }, [plaintext, key]);

  const handleStep = () => {
    if (simStep < 39) setSimStep(prev => prev + 1);
  };

  const handleReset = () => {
    setSimStep(0);
  };

  if (!pipeline) return <div className="text-danger">Invalid input.</div>;

  // Derive Round and Phase from global simStep
  // 0: Initial AddRoundKey
  // 1-36: Rounds 1 to 9 (each has 4 phases)
  // 37-39: Round 10 (has 3 phases)
  let activeRound = 0;
  let activePhase = -1; // -1 for initial, 0:Sub, 1:Shift, 2:Mix, 3:Add
  let currentMatrix = null;
  let phaseName = "";
  
  if (simStep === 0) {
    activeRound = 0;
    activePhase = -1;
    currentMatrix = pipeline.std.timeline[0].state;
    phaseName = "Initial AddRoundKey";
  } else if (simStep >= 1 && simStep <= 36) {
    activeRound = Math.floor((simStep - 1) / 4) + 1;
    activePhase = (simStep - 1) % 4;
    const rData = pipeline.std.timeline[activeRound].states;
    if (activePhase === 0) { currentMatrix = rData.sub; phaseName = "SubBytes"; }
    else if (activePhase === 1) { currentMatrix = rData.shift; phaseName = "ShiftRows"; }
    else if (activePhase === 2) { currentMatrix = rData.mix; phaseName = "MixColumns"; }
    else if (activePhase === 3) { currentMatrix = rData.add; phaseName = "AddRoundKey"; }
  } else {
    activeRound = 10;
    activePhase = simStep - 37;
    const rData = pipeline.std.timeline[10].states;
    if (activePhase === 0) { currentMatrix = rData.sub; phaseName = "SubBytes"; }
    else if (activePhase === 1) { currentMatrix = rData.shift; phaseName = "ShiftRows"; }
    else if (activePhase === 2) { currentMatrix = rData.add; phaseName = "Final AddRoundKey"; }
  }

  const activeRoundKey = pipeline.std.timeline[activeRound].roundKey;

  // Helper for matrix render
  const renderMatrix = (matrix, highlightPhase) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', background: 'var(--panel-border)', padding: '4px', borderRadius: '8px', width: 'fit-content' }}>
      {matrix.map((row, r) => 
        row.map((val, c) => {
          let cellColor = 'var(--text-main)';
          let xOffset = 0;

          if (highlightPhase === 'SubBytes') cellColor = 'var(--primary-neon)';
          else if (highlightPhase === 'ShiftRows') {
            cellColor = 'var(--accent-blue)';
            xOffset = r * -5;
          }
          else if (highlightPhase === 'MixColumns') {
            cellColor = 'var(--danger-red)';
          }
          else if (highlightPhase === 'AddRoundKey' || highlightPhase === 'Final AddRoundKey' || highlightPhase === 'Initial AddRoundKey') {
            cellColor = 'gold';
          }

          return (
            <div key={`${r}-${c}`} className="aes-cell" style={{
              width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--panel-bg)', borderRadius: '4px', fontFamily: 'var(--font-display)', fontSize: '1rem',
              color: cellColor, transform: `translateX(${xOffset}px)`, transition: 'all 0.3s'
            }} title={`Row ${r}, Col ${c}`}>
              {toHex(val)}
            </div>
          )
        })
      )}
    </div>
  );

  return (
    <div className="glass-panel" style={{ marginTop: '0rem', position: 'relative' }}>
        
      {/* Config */}
      <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-blue)' }}>128-bit Plaintext (Hex):</label>
          <input type="text" value={plaintext} maxLength="32" onChange={(e) => { setPlaintext(e.target.value.toUpperCase().replace(/[^0-9A-F]/g, '')); handleReset(); }} style={{ width: '100%', fontFamily: 'var(--font-display)' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--danger-red)' }}>128-bit Key (Hex):</label>
          <input type="text" value={key} maxLength="32" onChange={(e) => { setKey(e.target.value.toUpperCase().replace(/[^0-9A-F]/g, '')); handleReset(); }} style={{ width: '100%', fontFamily: 'var(--font-display)' }} />
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--panel-border)' }}>
        <button className="btn" style={{ background: activeTab === 'main' ? 'var(--panel-border)' : 'transparent', color: activeTab === 'main' ? 'var(--primary-neon)' : 'var(--text-main)', borderBottom: activeTab === 'main' ? '2px solid var(--primary-neon)' : 'none', borderRadius: '4px 4px 0 0' }} onClick={() => setActiveTab('main')}>
          Main Animation
        </button>
        <button className="btn" style={{ background: activeTab === 'avalanche' ? 'var(--panel-border)' : 'transparent', color: activeTab === 'avalanche' ? 'var(--danger-red)' : 'var(--text-main)', borderBottom: activeTab === 'avalanche' ? '2px solid var(--danger-red)' : 'none', borderRadius: '4px 4px 0 0' }} onClick={() => setActiveTab('avalanche')}>
          Avalanche Effect Demo
        </button>
        <button className="btn" style={{ marginLeft: 'auto', color: 'gold' }} onClick={() => setShowKeySidebar(!showKeySidebar)}>
          Toggle Key Expansion Sidebar
        </button>
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        
        {/* VIEW: MAIN ANIMATION */}
        {activeTab === 'main' && (
          <div style={{ flex: 1, display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            
            {/* Left Panel */}
            <div style={{ flex: 1, minWidth: '250px', background: 'rgba(0,0,0,0.5)', padding: '1.5rem', borderRadius: '8px' }}>
              <h4 style={{ color: 'var(--text-main)', fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>AES Physics Simulator</h4>
              <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '2rem' }}>
                AES computes across a 4x4 coordinate matrix. Step through to visualize the non-linear substitutions and Galois Field alignments happening dynamically.
              </p>
              
              <div style={{ borderLeft: '2px solid var(--panel-border)', paddingLeft: '1rem' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Active Round Key ({activeRound})</div>
                {renderMatrix(activeRoundKey, null)}
              </div>
            </div>

            {/* Right Panel */}
            <div style={{ flex: 2, minWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              
              {/* Progress Timeline */}
              <div style={{ display: 'flex', width: '100%', overflowX: 'auto', paddingBottom: '1rem', borderBottom: '1px solid var(--panel-border)', marginBottom: '2rem' }}>
                {Array.from({length: 11}).map((_, i) => (
                  <div key={i} onClick={() => {
                        let step = 0;
                        if(i===0) step=0;
                        else if(i<10) step = 1 + ((i-1)*4);
                        else step = 37;
                        setSimStep(step);
                      }} 
                      style={{ 
                        padding: '0.5rem 1rem', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '0.8rem',
                        color: activeRound === i ? 'var(--primary-neon)' : 'var(--text-muted)',
                        borderBottom: activeRound === i ? '2px solid var(--primary-neon)' : 'none',
                        transition: 'all 0.2s'
                      }}
                  >
                    {i === 0 ? 'Init' : (i === 10 ? 'Final' : `R${i}`)}
                  </div>
                ))}
              </div>

              <div style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontFamily: 'var(--font-display)', marginBottom: '2rem' }}>
                Operation: <span style={{ color: 'var(--primary-neon)' }}>{phaseName}</span>
              </div>

              {renderMatrix(currentMatrix, phaseName)}

              <SimulationControls showPlay={true} canStep={simStep < 39} onStep={handleStep} onReset={handleReset} />
            </div>

          </div>
        )}

        {/* VIEW: AVALANCHE */}
        {activeTab === 'avalanche' && (() => {
           // We derive the avalanche stat based on activeRound
           // For simplicity in Avalanche, we just compare the final state of activeRound
           let sA, sB;
           if (activeRound === 0) { sA = pipeline.std.timeline[0].state; sB = pipeline.flipped.timeline[0].state; }
           else { 
             const rDataA = pipeline.std.timeline[activeRound];
             const rDataB = pipeline.flipped.timeline[activeRound];
             sA = rDataA.states.add; sB = rDataB.states.add;
           }

           const diffInfo = getBitDifferences(sA, sB);
           const totalBits = 128;
           const diffPercent = ((diffInfo.count / totalBits) * 100).toFixed(1);

           return (
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
               <h4 style={{ color: 'var(--danger-red)', fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>The Avalanche Effect</h4>
               <p className="text-muted" style={{ textAlign: 'center', maxWidth: '600px', marginBottom: '2rem' }}>
                 A single bit flip in the Plaintext should cascade rapidly due to the Diffusion and Confusion properties of AES. By Round 2 or 3, roughly 50% of the bits should differ entirely.
               </p>

               <div style={{ display: 'flex', gap: '3rem', margin: '2rem 0' }}>
                 <div style={{ textAlign: 'center' }}>
                   <div style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>Standard Plaintext</div>
                   {renderMatrix(sA, null)}
                 </div>

                 <div style={{ textAlign: 'center' }}>
                   <div style={{ color: 'var(--danger-red)', marginBottom: '1rem' }}>1-Bit Flipped Plaintext</div>
                   {/* Render Flipped Matrix with Red Overlays for changed cells */}
                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', background: 'var(--panel-border)', padding: '4px', borderRadius: '8px' }}>
                    {sB.map((row, r) => 
                      row.map((val, c) => {
                        const isDiff = diffInfo.mapMatrix[r][c];
                        return (
                          <div key={`${r}-${c}`} style={{
                            width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: isDiff ? 'rgba(255,45,85,0.3)' : 'var(--panel-bg)', borderRadius: '4px',
                            fontFamily: 'var(--font-display)', fontSize: '1rem',
                            color: isDiff ? 'var(--danger-red)' : 'var(--text-main)',
                            border: isDiff ? '1px solid var(--danger-red)' : 'none'
                          }}>
                            {toHex(val)}
                          </div>
                        )
                      })
                    )}
                  </div>
                 </div>
               </div>

               <div style={{ width: '100%', maxWidth: '600px', background: 'rgba(0,0,0,0.5)', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
                    Round {activeRound} Bit Divergence: <strong style={{ color: 'var(--danger-red)' }}>{diffInfo.count} / 128 bits ({diffPercent}%)</strong>
                  </div>
                  <div style={{ width: '100%', height: '20px', background: 'var(--panel-border)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${diffPercent}%`, height: '100%', background: 'var(--danger-red)', transition: 'width 0.3s ease' }}></div>
                  </div>
               </div>

               <SimulationControls showPlay={true} canStep={simStep < 39} onStep={handleStep} onReset={handleReset} />
             </div>
           );
        })()}

        {/* KEY EXPANSION SIDEBAR */}
        {showKeySidebar && (
          <div style={{ width: '300px', background: 'rgba(0,0,0,0.8)', borderLeft: '1px solid gold', padding: '1rem', height: '600px', overflowY: 'auto' }}>
            <h4 style={{ color: 'gold', fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>Key Expansion</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              The 16-byte key expands to 176 bytes spanning 44 words ($w_0$ to $w_{43}$). SubWords, RotWords, and Rcon operations protect the key lattice.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {pipeline.std.keyExpTimeline.map((log, i) => (
                <div key={i} style={{ background: 'var(--panel-bg)', padding: '0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontFamily: 'var(--font-display)' }}>
                   <div style={{ color: 'gold', marginBottom: '0.2rem' }}>Generative Step (Round {Math.floor(log.wordIdx/4)})</div>
                   <div style={{ color: 'var(--text-muted)' }}>In: [{log.preRot.map(toHex).join(' ')}]</div>
                   <div style={{ color: 'var(--primary-neon)' }}>RotWord: [{log.rotOut.map(toHex).join(' ')}]</div>
                   <div style={{ color: 'var(--accent-blue)' }}>SubWord: [{log.subOut.map(toHex).join(' ')}]</div>
                   <div style={{ color: 'var(--danger-red)' }}>⊕ RCON: 0x{toHex(log.rcon)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AESCipher;
