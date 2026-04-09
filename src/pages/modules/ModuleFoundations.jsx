import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import OSIArchitecture from '../../components/simulations/OSIArchitecture';
import SecurityAttacks from '../../components/simulations/SecurityAttacks';
import ErrorBoundary from '../../components/layout/ErrorBoundary';

const ModuleFoundations = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.substring(1));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hash]);

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--panel-border)' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          Foundations of Security
        </h1>
        <p className="text-muted" style={{ fontSize: '1rem' }}>
          Core concepts of information security — the OSI security architecture and the taxonomy of network attacks.
        </p>
      </div>

      {/* Scroll Nav */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--panel-border)' }}>
        {[
          { label: 'OSI Architecture', anchor: 'osi' },
          { label: 'Security Attacks', anchor: 'attacks' },
        ].map(({ label, anchor }) => (
          <a
            key={anchor}
            href={`#${anchor}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              color: 'var(--text-muted)', textDecoration: 'none', fontFamily: 'var(--font-display)',
              fontSize: '0.9rem', padding: '0.25rem 0.75rem', borderRadius: '4px',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => { e.currentTarget.style.color = 'var(--primary-neon)'; e.currentTarget.style.background = 'rgba(0,255,157,0.08)'; }}
            onMouseOut={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
          >
            {label}
          </a>
        ))}
      </div>

      <section id="osi" style={{ scrollMarginTop: '80px', marginBottom: '5rem' }}>
        <ErrorBoundary>
          <OSIArchitecture />
        </ErrorBoundary>
      </section>

      <section id="attacks" style={{ scrollMarginTop: '80px', marginBottom: '5rem' }}>
        <ErrorBoundary>
          <SecurityAttacks />
        </ErrorBoundary>
      </section>
    </div>
  );
};

export default ModuleFoundations;
