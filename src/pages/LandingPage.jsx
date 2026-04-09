import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const LandingPage = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      heroRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    );
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', textAlign: 'center' }}>
      <section ref={heroRef}>
        <h1 className="glitch-text" data-text="CIPHERVERSE" style={{ fontSize: '5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '0.1em' }}>
          CIPHERVERSE
        </h1>
        <p className="text-muted" style={{ fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '600px', fontFamily: 'var(--font-body)' }}>
          A clean, interactive visualizer for fundamental cybersecurity concepts. 
          Use the sidebar to navigate modules or search instantly for any concept.
        </p>
        
        <Link to="/modules/classical-encryption" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>
          Begin Simulation
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;
