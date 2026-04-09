import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DESCipher from '../../components/simulations/DESCipher';
import TripleDESCipher from '../../components/simulations/TripleDESCipher';
import AESCipher from '../../components/simulations/AESCipher';
import CipherModes from '../../components/simulations/CipherModes';

const Module2 = () => {
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
        Block & Symmetric Ciphers
      </h1>

      <section id="des" style={{ scrollMarginTop: '100px', marginBottom: '4rem' }}>
        <DESCipher />
      </section>

      <section id="3des" style={{ scrollMarginTop: '100px', marginBottom: '4rem' }}>
        <TripleDESCipher />
      </section>

      <section id="aes" style={{ scrollMarginTop: '100px', marginBottom: '4rem' }}>
        <AESCipher />
      </section>
      
      <section id="modes" style={{ scrollMarginTop: '100px', marginBottom: '4rem' }}>
        <CipherModes />
      </section>

    </div>
  );
};

export default Module2;
