import React, { useState } from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';

const CipherModes = () => {
  const [mode, setMode] = useState('ECB');

  return (
    <div className="glass-panel" style={{ marginTop: '0rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h4 style={{ color: 'var(--text-main)', margin: 0, fontFamily: 'var(--font-display)' }}>Block Chaining Visualization</h4>
        
        <select 
          value={mode} 
          onChange={(e) => setMode(e.target.value)}
          style={{ 
            background: 'rgba(0,0,0,0.5)', border: '1px solid var(--accent-blue)', color: 'var(--text-main)', 
            padding: '0.5rem 1rem', borderRadius: '4px', fontFamily: 'var(--font-display)' 
          }}
        >
          <option value="ECB">Electronic Codebook (ECB)</option>
          <option value="CBC">Cipher Block Chaining (CBC)</option>
        </select>
      </div>

      <p className="text-muted" style={{ marginBottom: '3rem' }}>
        {mode === 'ECB' && "ECB Mode encrypts each block independently. Identical plaintext blocks produce identical ciphertext blocks, revealing patterns."}
        {mode === 'CBC' && "CBC Mode XORs each plaintext block with the previous ciphertext block before encryption. Requires an Initialization Vector (IV)."}
      </p>

      {/* Visualizer */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', padding: '2rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', overflowX: 'auto', minHeight: '300px' }}>
        
        {/* Block 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          {mode === 'CBC' && (
             <div style={{ position: 'absolute', left: '-60px', top: '70px', color: 'var(--danger-red)', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                IV <ArrowRight size={16} />
             </div>
          )}

          <div style={{ background: 'var(--panel-bg)', border: '1px solid gray', padding: '0.5rem', borderRadius: '4px', width: '100px', textAlign: 'center', color: 'var(--text-main)' }}>
            Plaintext 1
          </div>
          
          <ArrowDown size={24} color="gray" style={{ margin: '0.5rem 0' }} />
          
          {mode === 'CBC' && (
            <>
              <div style={{ border: '1px solid var(--danger-red)', color: 'var(--danger-red)', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⊕</div>
              <ArrowDown size={24} color="gray" style={{ margin: '0.5rem 0' }} />
            </>
          )}

          <div style={{ background: 'rgba(0,180,255,0.2)', border: '2px solid var(--accent-blue)', padding: '1rem', borderRadius: '4px', width: '100px', textAlign: 'center', color: 'var(--accent-blue)' }}>
            Block Cipher
            <br/><span style={{ fontSize: '0.7rem' }}>Key</span>
          </div>
          
          <ArrowDown size={24} color="gray" style={{ margin: '0.5rem 0' }} />
          
          <div style={{ background: 'var(--panel-bg)', border: '1px solid var(--primary-neon)', padding: '0.5rem', borderRadius: '4px', width: '100px', textAlign: 'center', color: 'var(--primary-neon)' }}>
            Ciphertext 1
          </div>
        </div>

        {/* CBC Connection Arrow */}
        {mode === 'CBC' && (
          <div style={{ position: 'relative', width: '50px' }}>
             <svg style={{ position: 'absolute', top: '240px', left: '-50px', width: '150px', height: '100px', overflow: 'visible', zIndex: 0 }} pointerEvents="none">
               <path d="M 0 0 L 70 0 L 70 -138 L 115 -138" fill="none" stroke="var(--danger-red)" strokeWidth="2" strokeDasharray="4 4" />
               <polygon points="115,-142 120,-138 115,-134" fill="var(--danger-red)" />
             </svg>
          </div>
        )}

        {/* Block 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <div style={{ background: 'var(--panel-bg)', border: '1px solid gray', padding: '0.5rem', borderRadius: '4px', width: '100px', textAlign: 'center', color: 'var(--text-main)' }}>
            Plaintext 2
          </div>
          
          <ArrowDown size={24} color="gray" style={{ margin: '0.5rem 0' }} />
          
          {mode === 'CBC' && (
            <>
              <div style={{ border: '1px solid var(--danger-red)', color: 'var(--danger-red)', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⊕</div>
              <ArrowDown size={24} color="gray" style={{ margin: '0.5rem 0' }} />
            </>
          )}

          <div style={{ background: 'rgba(0,180,255,0.2)', border: '2px solid var(--accent-blue)', padding: '1rem', borderRadius: '4px', width: '100px', textAlign: 'center', color: 'var(--accent-blue)' }}>
            Block Cipher
            <br/><span style={{ fontSize: '0.7rem' }}>Key</span>
          </div>
          
          <ArrowDown size={24} color="gray" style={{ margin: '0.5rem 0' }} />
          
          <div style={{ background: 'var(--panel-bg)', border: '1px solid var(--primary-neon)', padding: '0.5rem', borderRadius: '4px', width: '100px', textAlign: 'center', color: 'var(--primary-neon)' }}>
            Ciphertext 2
          </div>
        </div>

        {/* CBC Connection Arrow */}
        {mode === 'CBC' && (
          <div style={{ position: 'relative', width: '50px' }}>
             <svg style={{ position: 'absolute', top: '240px', left: '-50px', width: '150px', height: '100px', overflow: 'visible', zIndex: 0 }} pointerEvents="none">
               <path d="M 0 0 L 70 0 L 70 -138 L 115 -138" fill="none" stroke="var(--danger-red)" strokeWidth="2" strokeDasharray="4 4" />
               <polygon points="115,-142 120,-138 115,-134" fill="var(--danger-red)" />
             </svg>
          </div>
        )}

        {/* Block 3 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <div style={{ background: 'var(--panel-bg)', border: '1px solid gray', padding: '0.5rem', borderRadius: '4px', width: '100px', textAlign: 'center', color: 'var(--text-main)' }}>
            Plaintext 3
          </div>
          
          <ArrowDown size={24} color="gray" style={{ margin: '0.5rem 0' }} />
          
          {mode === 'CBC' && (
            <>
              <div style={{ border: '1px solid var(--danger-red)', color: 'var(--danger-red)', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⊕</div>
              <ArrowDown size={24} color="gray" style={{ margin: '0.5rem 0' }} />
            </>
          )}

          <div style={{ background: 'rgba(0,180,255,0.2)', border: '2px solid var(--accent-blue)', padding: '1rem', borderRadius: '4px', width: '100px', textAlign: 'center', color: 'var(--accent-blue)' }}>
            Block Cipher
            <br/><span style={{ fontSize: '0.7rem' }}>Key</span>
          </div>
          
          <ArrowDown size={24} color="gray" style={{ margin: '0.5rem 0' }} />
          
          <div style={{ background: 'var(--panel-bg)', border: '1px solid var(--primary-neon)', padding: '0.5rem', borderRadius: '4px', width: '100px', textAlign: 'center', color: 'var(--primary-neon)' }}>
            Ciphertext 3
          </div>
        </div>

      </div>
    </div>
  );
};

export default CipherModes;
