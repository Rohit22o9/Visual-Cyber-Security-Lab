import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ModulePlaceholder = () => {
  const { id } = useParams();

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/" className="btn" style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.1)' }}>
          <ArrowLeft size={20} />
        </Link>
        <h1 style={{ fontSize: '2.5rem', textTransform: 'capitalize' }}>{id.replace('-', ' ')}</h1>
      </div>

      <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2><span className="text-primary">Simulation Ready</span> to be built</h2>
        <p className="text-muted" style={{ marginTop: '1rem', maxWidth: '600px', margin: '1rem auto' }}>
          This module is currently unlocked. The interactive simulations for this section will be added in the next development phase.
        </p>
      </div>
    </div>
  );
};

export default ModulePlaceholder;
