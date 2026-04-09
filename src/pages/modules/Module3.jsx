import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RSACipher from '../../components/simulations/RSACipher';
import DiffieHellman from '../../components/simulations/DiffieHellman';
import ElGamal from '../../components/simulations/ElGamal';
import EllipticCurve from '../../components/simulations/EllipticCurve';
import ErrorBoundary from '../../components/layout/ErrorBoundary';

const Module3 = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--panel-border)', paddingBottom: '1rem' }}>
        Public Key Cryptography
      </h1>

      <section id="rsa" style={{ scrollMarginTop: '100px', marginBottom: '4rem' }}>
        <ErrorBoundary>
          <RSACipher />
        </ErrorBoundary>
      </section>

      <section id="diffie-hellman" style={{ scrollMarginTop: '100px', marginBottom: '4rem' }}>
        <ErrorBoundary>
          <DiffieHellman />
        </ErrorBoundary>
      </section>
      
      <section id="elgamal" style={{ scrollMarginTop: '100px', marginBottom: '4rem' }}>
        <ErrorBoundary>
          <ElGamal />
        </ErrorBoundary>
      </section>

      <section id="ecc" style={{ scrollMarginTop: '100px', marginBottom: '4rem' }}>
        <ErrorBoundary>
          <EllipticCurve />
        </ErrorBoundary>
      </section>

      {/* CROSS-MODULE SUMMARY CARD */}
      <section style={{ marginTop: '6rem' }}>
        <h3 style={{ color: 'var(--text-main)', fontFamily: 'var(--font-display)', marginBottom: '2rem', textAlign: 'center' }}>Mathematical Hard Problems</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          
          {/* Column 1: RSA */}
          <div style={{ background: 'var(--panel-bg)', border: '1px solid var(--primary-neon)', borderRadius: '8px', padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary-neon)' }}>
              {'{'} <span style={{ fontFamily: 'var(--font-display)' }}>p × q</span> {'}'}
            </div>
            <h4 style={{ color: 'var(--primary-neon)', fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>RSA</h4>
            <div style={{ color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '1rem' }}>Hard Problem: Integer Factorization</div>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
              Easy to multiply <span style={{ fontFamily: 'var(--font-display)' }}>p × q</span>, hard to factor <span style={{ fontFamily: 'var(--font-display)' }}>n</span> back.
            </p>
          </div>

          {/* Column 2: DH / ElGamal */}
          <div style={{ background: 'var(--panel-bg)', border: '1px solid var(--accent-blue)', borderRadius: '8px', padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--accent-blue)', fontFamily: 'var(--font-display)' }}>
              g<sup>x</sup> <span style={{ fontSize: '1rem' }}>mod p</span>
            </div>
            <h4 style={{ color: 'var(--accent-blue)', fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>Diffie-Hellman / ElGamal</h4>
            <div style={{ color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '1rem' }}>Hard Problem: Discrete Logarithm</div>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
              Easy to compute <span style={{ fontFamily: 'var(--font-display)' }}>g<sup>x</sup> mod p</span>, hard to find <span style={{ fontFamily: 'var(--font-display)' }}>x</span>.
            </p>
          </div>

          {/* Column 3: ECC */}
          <div style={{ background: 'var(--panel-bg)', border: '1px solid var(--danger-red)', borderRadius: '8px', padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--danger-red)', fontFamily: 'var(--font-display)' }}>
              kP
            </div>
            <h4 style={{ color: 'var(--danger-red)', fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>ECC</h4>
            <div style={{ color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '1rem' }}>Hard Problem: Elliptic Curve Discrete Log</div>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
              Easy to compute <span style={{ fontFamily: 'var(--font-display)' }}>k · P</span>, hard to find <span style={{ fontFamily: 'var(--font-display)' }}>k</span> from P and kP.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Module3;
