import React, { useState, useEffect, useMemo } from 'react';
import { generateDESTimeline, SBOXES } from '../../utils/desLogic';
import SimulationControls from './SimulationControls';
import { ArrowDown, ArrowRight, ArrowLeft } from 'lucide-react';

const DESCipher = () => {
  const [plaintext, setPlaintext] = useState('0123456789ABCDEF');
  const [key, setKey] = useState('133457799BBCDFF1');
  
  // Math Engine Pipeline calculation
  const pipeline = useMemo(() => {
     try {
       // Validate hex
       const pt = plaintext.padEnd(16, '0').substring(0, 16);
       const k = key.padEnd(16, '0').substring(0, 16);
       return generateDESTimeline(pt, k);
     } catch(e) {
       return null;
     }
  }, [plaintext, key]);

  const [currentStep, setCurrentStep] = useState(0);

  const handleStep = () => {
    if (pipeline && currentStep < pipeline.timeline.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  if (!pipeline) return <div className="text-danger">Invalid Hex Input. Please use 0-9, A-F.</div>;

  const currentData = pipeline.timeline[currentStep];
  const isRound = currentData.round > 0 && currentData.round < 17;
  const isFinal = currentData.round === 17;

  // Formatting helpers
  const formatBin = (bin, chunk) => {
    if(!bin) return '';
    return bin.match(new RegExp(`.{1,${chunk}}`, 'g')).join(' ');
  };

  return (
    <div className="glass-panel" style={{ marginTop: '0rem', position: 'relative' }}>
      
      {/* Configuration Header */}
      <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '2rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-blue)' }}>64-bit Plaintext (Hex):</label>
          <input 
            type="text" 
            value={plaintext}
            maxLength="16"
            onChange={(e) => { setPlaintext(e.target.value.toUpperCase().replace(/[^0-9A-F]/g, '')); handleReset(); }}
            style={{ width: '100%', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--danger-red)' }}>64-bit Key (Hex):</label>
          <input 
            type="text" 
            value={key}
            maxLength="16"
            onChange={(e) => { setKey(e.target.value.toUpperCase().replace(/[^0-9A-F]/g, '')); handleReset(); }}
            style={{ width: '100%', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
        
        {/* LEFT PANEL: Key Schedule */}
        <div style={{ flex: '1', minWidth: '320px', background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--panel-border)' }}>
          <h4 style={{ color: 'var(--danger-red)', textAlign: 'center', fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>Key Schedule</h4>
          
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', textAlign: 'center' }}>
            64-bit Key shrinks to 56 bits (PC-1), splits to C & D, shifts left, then compresses to 48 bits (PC-2) per round.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-display)', fontSize: '0.9rem' }}>
            <div style={{ border: '1px solid gray', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>K: {key}</div>
            <ArrowDown size={16} color="gray" />
            <div style={{ background: 'rgba(255,45,85,0.1)', border: '1px solid var(--danger-red)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: 'var(--danger-red)' }}>PC-1 (56-bit)</div>
            <ArrowDown size={16} color="var(--danger-red)" />
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>C Half (28-bit)</div>
                <div style={{ border: '1px solid gray', padding: '0.2rem', fontSize: '0.7rem', width: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {isRound ? formatBin(currentData.keyPhase.C, 4) : '...'}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>D Half (28-bit)</div>
                <div style={{ border: '1px solid gray', padding: '0.2rem', fontSize: '0.7rem', width: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {isRound ? formatBin(currentData.keyPhase.D, 4) : '...'}
                </div>
              </div>
            </div>

            {isRound && (
              <div style={{ color: 'var(--primary-neon)', fontSize: '0.7rem', marginTop: '0.5rem' }}>
                {`< Left Shift by ${currentData.keyPhase.shifts} >`}
              </div>
            )}

            <ArrowDown size={16} color="gray" />
            <div style={{ background: 'rgba(255,45,85,0.1)', border: '1px solid var(--danger-red)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: 'var(--danger-red)' }}>PC-2 (48-bit Subkey)</div>
            
            <div style={{ 
              marginTop: '1rem', padding: '0.5rem', borderRadius: '4px', textAlign: 'center', width: '100%',
              background: isRound ? 'rgba(0,255,157,0.1)' : 'transparent',
              border: isRound ? '1px solid var(--primary-neon)' : '1px dashed gray',
              color: isRound ? 'var(--primary-neon)' : 'gray'
            }}>
               {isRound ? formatBin(currentData.subkey, 6) : 'Awaiting Round...'}
            </div>
          </div>
        </div>

        {/* CENTER PANEL: Main Feistel Run */}
        <div style={{ flex: '2', minWidth: '500px', background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--panel-border)' }}>
          <h4 style={{ color: 'var(--primary-neon)', textAlign: 'center', fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>Active Feistel Phase</h4>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem', fontFamily: 'var(--font-display)' }}>
             <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--accent-blue)' }}>Left Half (L)</div>
                <div style={{ fontSize: '1.2rem' }}>{currentData.hexL || '...'}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{formatBin(currentData.L, 8)}</div>
             </div>
             <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'gold' }}>Right Half (R)</div>
                <div style={{ fontSize: '1.2rem' }}>{currentData.hexR || '...'}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{formatBin(currentData.R, 8)}</div>
             </div>
          </div>

          {/* F-Function details if Round is active */}
          {isRound && (
            <div style={{ background: 'rgba(0,180,255,0.05)', border: '1px solid var(--accent-blue)', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ textAlign: 'center', color: 'var(--accent-blue)', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>f(R, K) Decomposition</div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>
                <div style={{ width: '45%' }}>
                   <div style={{ color: 'gold' }}>1. Expansion P-Box (32 → 48)</div>
                   <div style={{ color: 'var(--text-main)', wordBreak: 'break-all' }}>{formatBin(currentData.expandedR, 6)}</div>
                </div>
                <div style={{ width: '45%' }}>
                   <div style={{ color: 'var(--primary-neon)' }}>2. XOR with Subkey K (48-bit)</div>
                   <div style={{ color: 'var(--text-main)', wordBreak: 'break-all' }}>{formatBin(currentData.xorRes, 6)}</div>
                </div>
              </div>

              {/* 8 S-Boxes render */}
              <div style={{ color: 'var(--danger-red)', fontSize: '0.8rem', fontFamily: 'var(--font-display)' }}>3. S-Box Substitutions (48 → 32)</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginTop: '0.5rem' }}>
                {currentData.sboxDetails.map((box, i) => (
                  <div key={i} style={{ background: 'var(--panel-bg)', border: '1px solid gray', padding: '0.2rem', borderRadius: '4px', fontSize: '0.65rem', fontFamily: 'var(--font-display)', textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-muted)' }}>S-Box {i+1}</div>
                    <div style={{ color: 'var(--primary-neon)' }}>In: {box.chunk}</div>
                    <div style={{ color: 'gray' }}>R:{box.row} C:{box.col}</div>
                    <div style={{ color: 'gold', fontWeight: 'bold' }}>Out: {box.valBin} ({box.hexVal})</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.8rem', fontFamily: 'var(--font-display)' }}>
                <div style={{ color: 'var(--accent-blue)' }}>4. Straight P-Box Permutation</div>
                <div style={{ color: 'var(--text-main)' }}>{formatBin(currentData.fOut, 8)}</div>
              </div>

            </div>
          )}

          {isFinal && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
               <h3 style={{ color: 'var(--primary-neon)' }}>Final Ciphertext Produced</h3>
               <div style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', letterSpacing: '2px', marginTop: '1rem' }}>
                 {currentData.ciphertext}
               </div>
            </div>
          )}

        </div>

        {/* RIGHT PANEL: Timeline Stack */}
        <div style={{ flex: '1', minWidth: '250px', background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--panel-border)', maxHeight: '600px', overflowY: 'auto' }}>
           <h4 style={{ color: 'var(--accent-blue)', textAlign: 'center', fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>Timeline</h4>

           {pipeline.timeline.map((stage, idx) => {
             const isActive = idx === currentStep;
             const isPast = idx < currentStep;

             return (
               <div 
                 key={idx}
                 onClick={() => setCurrentStep(idx)}
                 style={{
                   padding: '0.5rem', marginBottom: '0.5rem', borderRadius: '4px', cursor: 'pointer',
                   background: isActive ? 'rgba(0,180,255,0.2)' : (isPast ? 'rgba(0,255,157,0.05)' : 'transparent'),
                   border: isActive ? '1px solid var(--accent-blue)' : (isPast ? '1px solid var(--primary-neon)' : '1px solid rgba(255,255,255,0.1)'),
                   transition: 'all 0.2s', fontFamily: 'var(--font-display)', fontSize: '0.8rem'
                 }}
               >
                 <div style={{ color: isActive ? 'white' : (isPast ? 'var(--primary-neon)' : 'gray'), fontWeight: isActive ? 'bold' : 'normal' }}>
                   {stage.desc}
                 </div>
                 {isActive && stage.hexL && (
                   <div style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                     <div>L: {stage.hexL}</div>
                     <div>R: {stage.hexR}</div>
                   </div>
                 )}
               </div>
             )
           })}

        </div>

      </div>

      <SimulationControls 
        showPlay={true}
        canStep={currentStep < pipeline.timeline.length - 1}
        onStep={handleStep}
        onReset={handleReset}
      />
    </div>
  );
};

export default DESCipher;
