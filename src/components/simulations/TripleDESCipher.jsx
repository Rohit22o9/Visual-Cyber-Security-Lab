import React, { useState } from 'react';
import { ArrowRight, Lock, Unlock } from 'lucide-react';
import SimulationControls from './SimulationControls';

const TripleDESCipher = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  return (
    <div className="glass-panel" style={{ marginTop: '0rem' }}>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
        <h4 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>3DES Pipeline (Encrypt-Decrypt-Encrypt)</h4>
        <p className="text-muted" style={{ marginBottom: '2rem', textAlign: 'center', maxWidth: '600px' }}>
          Triple DES runs the standard DES algorithm three times on each data block using either 2 or 3 unique keys. This drastically increases the effective key length to protect against brute-force attacks.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', overflowX: 'auto', padding: '1rem 0' }}>
          
          {/* Plaintext */}
          <div style={{
            background: currentStep === 0 ? 'var(--primary-neon)' : 'var(--panel-bg)',
            color: currentStep === 0 ? '#000' : 'var(--text-main)',
            border: '1px solid var(--primary-neon)',
            padding: '1rem', borderRadius: '4px', transition: 'all 0.3s'
          }}>
            Plaintext
          </div>

          <ArrowRight size={24} color={currentStep >= 1 ? 'var(--primary-neon)' : 'gray'} style={{ transition: 'color 0.3s' }} />

          {/* Machine 1 */}
          <div style={{
            background: currentStep === 1 ? 'rgba(0,180,255,0.2)' : 'var(--panel-bg)',
            border: currentStep === 1 ? '2px solid var(--accent-blue)' : '1px solid gray',
            padding: '1.5rem 1rem', borderRadius: '8px', textAlign: 'center', transition: 'all 0.3s'
          }}>
            <Lock size={24} color={currentStep === 1 ? 'var(--accent-blue)' : 'gray'} style={{ margin: '0 auto 0.5rem' }} />
            <div style={{ color: currentStep === 1 ? 'white' : 'gray' }}>Encrypt</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', marginTop: '0.5rem', fontFamily: 'var(--font-display)' }}>Key 1</div>
          </div>

          <ArrowRight size={24} color={currentStep >= 2 ? 'var(--accent-blue)' : 'gray'} style={{ transition: 'color 0.3s' }} />

          {/* Machine 2 */}
          <div style={{
            background: currentStep === 2 ? 'rgba(255,45,85,0.2)' : 'var(--panel-bg)',
            border: currentStep === 2 ? '2px solid var(--danger-red)' : '1px solid gray',
            padding: '1.5rem 1rem', borderRadius: '8px', textAlign: 'center', transition: 'all 0.3s'
          }}>
            <Unlock size={24} color={currentStep === 2 ? 'var(--danger-red)' : 'gray'} style={{ margin: '0 auto 0.5rem' }} />
            <div style={{ color: currentStep === 2 ? 'white' : 'gray' }}>Decrypt</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--danger-red)', marginTop: '0.5rem', fontFamily: 'var(--font-display)' }}>Key 2</div>
          </div>

          <ArrowRight size={24} color={currentStep >= 3 ? 'var(--danger-red)' : 'gray'} style={{ transition: 'color 0.3s' }} />

          {/* Machine 3 */}
          <div style={{
            background: currentStep === 3 ? 'rgba(255,180,0,0.2)' : 'var(--panel-bg)',
            border: currentStep === 3 ? '2px solid gold' : '1px solid gray',
            padding: '1.5rem 1rem', borderRadius: '8px', textAlign: 'center', transition: 'all 0.3s'
          }}>
            <Lock size={24} color={currentStep === 3 ? 'gold' : 'gray'} style={{ margin: '0 auto 0.5rem' }} />
            <div style={{ color: currentStep === 3 ? 'white' : 'gray' }}>Encrypt</div>
            <div style={{ fontSize: '0.8rem', color: 'gold', marginTop: '0.5rem', fontFamily: 'var(--font-display)' }}>Key 3</div>
          </div>

          <ArrowRight size={24} color={currentStep >= 4 ? 'gold' : 'gray'} style={{ transition: 'color 0.3s' }} />

          {/* Ciphertext */}
          <div style={{
            background: currentStep === 4 ? 'var(--primary-neon)' : 'var(--panel-bg)',
            color: currentStep === 4 ? '#000' : 'var(--text-main)',
            border: '1px solid var(--primary-neon)',
            padding: '1rem', borderRadius: '4px', transition: 'all 0.3s'
          }}>
            Ciphertext
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

export default TripleDESCipher;
