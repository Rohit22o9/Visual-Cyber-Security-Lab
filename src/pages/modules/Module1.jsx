import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CaesarCipher from '../../components/simulations/CaesarCipher';
import MonoalphabeticCipher from '../../components/simulations/MonoalphabeticCipher';
import PlayfairCipher from '../../components/simulations/PlayfairCipher';
import VigenereCipher from '../../components/simulations/VigenereCipher';
import HillCipher from '../../components/simulations/HillCipher';
import TranspositionCipher from '../../components/simulations/TranspositionCipher';
import StreamCipher from '../../components/simulations/StreamCipher';

const Module1 = () => {
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
        Classical Encryption
      </h1>

      <section id="caesar" style={{ scrollMarginTop: '100px', marginBottom: '4rem' }}>
        <CaesarCipher />
      </section>

      <section id="monoalphabetic" style={{ scrollMarginTop: '100px', marginBottom: '4rem' }}>
        <MonoalphabeticCipher />
      </section>

      <section id="playfair" style={{ scrollMarginTop: '100px', marginBottom: '4rem' }}>
        <PlayfairCipher />
      </section>

      <section id="vigenere" style={{ scrollMarginTop: '100px', marginBottom: '4rem' }}>
        <VigenereCipher />
      </section>

      <section id="hill" style={{ scrollMarginTop: '100px', marginBottom: '4rem' }}>
        <HillCipher />
      </section>

      <section id="transposition" style={{ scrollMarginTop: '100px', marginBottom: '4rem' }}>
        <TranspositionCipher />
      </section>

      <section id="stream" style={{ scrollMarginTop: '100px', marginBottom: '4rem' }}>
        <StreamCipher />
      </section>

      {/* Module complete */}
      
    </div>
  );
};

export default Module1;
