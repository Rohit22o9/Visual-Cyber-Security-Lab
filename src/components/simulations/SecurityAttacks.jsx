import React, { useState, useEffect, useRef } from 'react';
import SimulationControls from './SimulationControls';

/* ─────────────── ATTACK DATA ─────────────── */
const ATTACKS = [
  {
    id: 'eavesdrop', group: 'passive', label: 'Eavesdropping',
    tooltip: 'Eve intercepts the communication without altering it. Alice and Bob are completely unaware.',
    maxStep: 4,
  },
  {
    id: 'traffic', group: 'passive', label: 'Traffic Analysis',
    tooltip: 'Even encrypted traffic reveals patterns — frequency, timing, and volume leak information.',
    maxStep: 4,
  },
  {
    id: 'masquerade', group: 'active', label: 'Masquerade / Spoofing',
    tooltip: 'Mallory pretends to be Alice. Bob has no way to verify the true sender without authentication.',
    maxStep: 5,
  },
  {
    id: 'replay', group: 'active', label: 'Replay Attack',
    tooltip: 'A valid captured message is resent later. Bob cannot tell it\'s a replay without timestamps or nonces.',
    maxStep: 6,
  },
  {
    id: 'modification', group: 'active', label: 'Message Modification',
    tooltip: 'Mallory alters the message content in transit. Integrity mechanisms like MACs prevent this.',
    maxStep: 5,
  },
  {
    id: 'dos', group: 'active', label: 'Denial of Service',
    tooltip: 'Mallory overwhelms Bob with traffic. Legitimate requests from Alice cannot get through.',
    maxStep: 4,
  },
];

/* ─────────────── NODE COMPONENT ─────────────── */
const Node = ({ label, color, glow, icon, extraText, style }) => (
  <div style={{
    padding: '0.75rem 1rem', borderRadius: '8px', textAlign: 'center',
    background: `rgba(${color === 'blue' ? '0,180,255' : color === 'red' ? '255,45,85' : color === 'green' ? '0,255,157' : '255,200,0'}, 0.1)`,
    border: `1px solid ${color === 'blue' ? 'var(--accent-blue)' : color === 'red' ? 'var(--danger-red)' : color === 'green' ? 'var(--primary-neon)' : 'gold'}`,
    boxShadow: glow ? `0 0 16px ${color === 'blue' ? 'var(--accent-blue)' : color === 'red' ? 'var(--danger-red)' : color === 'green' ? 'var(--primary-neon)' : 'gold'}` : 'none',
    transition: 'all 0.4s',
    minWidth: '90px',
    ...style
  }}>
    <div style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>{icon}</div>
    <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: color === 'blue' ? 'var(--accent-blue)' : color === 'red' ? 'var(--danger-red)' : color === 'green' ? 'var(--primary-neon)' : 'gold' }}>
      {label}
    </div>
    {extraText && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{extraText}</div>}
  </div>
);

/* ─────────────── PACKET COMPONENT ─────────────── */
const Packet = ({ label, color, style }) => (
  <div style={{
    padding: '0.2rem 0.5rem', borderRadius: '12px',
    background: `rgba(${color === 'green' ? '0,255,157' : color === 'red' ? '255,45,85' : color === 'blue' ? '0,180,255' : '255,200,0'}, 0.25)`,
    border: `1px solid ${color === 'green' ? 'var(--primary-neon)' : color === 'red' ? 'var(--danger-red)' : color === 'blue' ? 'var(--accent-blue)' : 'gold'}`,
    color: color === 'green' ? 'var(--primary-neon)' : color === 'red' ? 'var(--danger-red)' : color === 'blue' ? 'var(--accent-blue)' : 'gold',
    fontFamily: 'var(--font-display)', fontSize: '0.75rem',
    boxShadow: `0 0 8px ${color === 'green' ? 'var(--primary-neon)' : color === 'red' ? 'var(--danger-red)' : 'var(--accent-blue)'}`,
    ...style
  }}>
    {label}
  </div>
);

/* ─────────────── MAIN SIMULATION ─────────────── */
const SecurityAttacks = () => {
  const [attackId, setAttackId] = useState('eavesdrop');
  const [simStep, setSimStep] = useState(0);
  const [trafficBars, setTrafficBars] = useState([]);
  const [dosPackets, setDosPackets] = useState([]);
  const timerRef = useRef(null);

  const attack = ATTACKS.find(a => a.id === attackId);

  const handleStep = () => { if (simStep < attack.maxStep) setSimStep(s => s + 1); };
  const handleReset = () => { setSimStep(0); setTrafficBars([]); setDosPackets([]); };
  const switchAttack = (id) => { setAttackId(id); handleReset(); };

  // Traffic analysis: build bars over time
  useEffect(() => {
    if (attackId === 'traffic' && simStep >= 2) {
      const interval = setInterval(() => {
        setTrafficBars(prev => {
          if (prev.length >= 12) return prev;
          return [...prev, Math.random() * 60 + 20];
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [attackId, simStep]);

  // DoS: flood animation
  useEffect(() => {
    if (attackId === 'dos' && simStep >= 2) {
      const interval = setInterval(() => {
        setDosPackets(prev => [...prev.slice(-30), { id: Date.now(), left: Math.random() * 40 + 5 }]);
      }, 120);
      return () => clearInterval(interval);
    } else {
      setDosPackets([]);
    }
  }, [attackId, simStep]);

  /* ─── CANVAS RENDER ─── */
  const renderCanvas = () => {
    switch (attackId) {
      case 'eavesdrop': return renderEavesdrop();
      case 'traffic': return renderTraffic();
      case 'masquerade': return renderMasquerade();
      case 'replay': return renderReplay();
      case 'modification': return renderModification();
      case 'dos': return renderDoS();
      default: return null;
    }
  };

  const NetworkLine = ({ dashed = false, color = 'rgba(255,255,255,0.2)' }) => (
    <div style={{
      flex: 1, height: '2px',
      background: dashed ? `repeating-linear-gradient(90deg, ${color} 0, ${color} 8px, transparent 8px, transparent 16px)` : color,
      alignSelf: 'center'
    }} />
  );

  /* 1. Eavesdropping */
  const renderEavesdrop = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
      {simStep >= 2 && (
        <Node label="Eve" icon="👁️" color="red" glow={simStep >= 3} extraText={simStep >= 3 ? 'Passive — reading copy' : 'Tapping line...'} />
      )}
      {simStep >= 2 && (
        <div style={{ color: 'var(--danger-red)', fontSize: '0.8rem', fontFamily: 'var(--font-display)' }}>
          ↑ Branch intercept {simStep >= 3 ? '— copy captured' : ''}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '0', width: '100%', maxWidth: '600px' }}>
        <Node label="Alice" icon="👩‍💻" color="blue" glow={simStep === 1} />
        <NetworkLine dashed color="rgba(0,180,255,0.4)" />
        {simStep >= 1 && <Packet label="MSG" color="blue" style={{ position: 'relative', zIndex: 2 }} />}
        <NetworkLine dashed color={simStep >= 2 ? 'rgba(255,45,85,0.4)' : 'rgba(0,180,255,0.4)'} />
        <Node label="Bob" icon="👨‍💻" color="blue" glow={simStep >= 4} extraText={simStep >= 4 ? '✓ Received (unaware)' : ''} />
      </div>

      {simStep >= 4 && (
        <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,45,85,0.1)', border: '1px solid var(--danger-red)', borderRadius: '8px', color: 'var(--danger-red)', fontFamily: 'var(--font-display)', fontSize: '0.85rem', textAlign: 'center' }}>
          ⚠️ Passive Attack — No modification. Eve has the message. Neither Alice nor Bob know.
        </div>
      )}
    </div>
  );

  /* 2. Traffic Analysis */
  const renderTraffic = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '600px', gap: 0 }}>
        <Node label="Alice" icon="👩‍💻" color="blue" glow={simStep >= 1} />
        <NetworkLine dashed color="rgba(0,180,255,0.3)" />
        {simStep >= 1 && ['🔒', '🔒', '🔒'].map((icon, i) => (
          <span key={i} style={{ fontSize: '1rem', animation: `fadeIn 0.3s ${i * 0.2}s both`, margin: '0 4px' }}>{icon}</span>
        ))}
        <NetworkLine dashed color="rgba(0,180,255,0.3)" />
        <Node label="Bob" icon="👨‍💻" color="blue" glow={simStep >= 1} />
      </div>

      {simStep >= 2 && (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Node label="Eve" icon="📊" color="red" glow style={{ minWidth: '150px' }} extraText="Watching metadata..." />
          <div style={{ minWidth: '200px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--danger-red)', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ color: 'var(--danger-red)', fontSize: '0.75rem', fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>Traffic Pattern Analysis</div>
            <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '60px' }}>
              {trafficBars.map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, background: 'var(--danger-red)', borderRadius: '2px 2px 0 0', opacity: 0.7, transition: 'height 0.3s' }} />
              ))}
            </div>
            {simStep >= 3 && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}>
                <div>Packets/sec: {trafficBars.length}</div>
                <div>Source: 192.168.1.10</div>
                <div>Dest: 10.0.0.5</div>
              </div>
            )}
          </div>
        </div>
      )}

      {simStep >= 4 && (
        <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,45,85,0.1)', border: '1px solid var(--danger-red)', borderRadius: '8px', color: 'var(--danger-red)', fontFamily: 'var(--font-display)', fontSize: '0.85rem', textAlign: 'center' }}>
          ⚠️ Content is encrypted — but frequency, timing, and volume patterns are exposed.
        </div>
      )}
    </div>
  );

  /* 3. Masquerade */
  const renderMasquerade = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
      <Node label="Mallory" icon="🎭" color="red" glow={simStep >= 2} extraText={simStep >= 2 ? 'Spoofing Alice\'s ID' : 'Waiting...'} />

      <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '600px', gap: 0 }}>
        <Node label="Alice" icon="👩‍💻" color="blue" glow={simStep === 1} />
        <NetworkLine dashed color={simStep >= 2 ? 'rgba(255,45,85,0.4)' : 'rgba(0,180,255,0.3)'} />
        {simStep === 1 && <Packet label="Hi Bob!" color="blue" />}
        {simStep >= 3 && <Packet label="FAKE: From Alice" color="red" />}
        <NetworkLine dashed color="rgba(255,45,85,0.4)" />
        <Node label="Bob" icon="👨‍💻" color="blue" glow={simStep >= 4} extraText={simStep >= 4 ? '✓ Accepted (deceived)' : ''} />
      </div>

      {simStep >= 2 && simStep < 4 && (
        <div style={{ color: 'var(--danger-red)', fontFamily: 'var(--font-display)', fontSize: '0.85rem' }}>
          Mallory intercepts and sends forged packet with Alice's identity
        </div>
      )}
      {simStep >= 5 && (
        <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,45,85,0.1)', border: '1px solid var(--danger-red)', borderRadius: '8px', color: 'var(--danger-red)', fontFamily: 'var(--font-display)', fontSize: '0.85rem', textAlign: 'center' }}>
          ⚠️ Active Attack — Bob thinks Mallory is Alice. Authentication prevents this.
        </div>
      )}
    </div>
  );

  /* 4. Replay */
  const renderReplay = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
        <Node label="Mallory" icon="📋" color="red" glow={simStep >= 3} extraText={simStep >= 3 ? 'Saved copy!' : 'Watching...'} />
        {simStep >= 5 && (
          <div style={{ padding: '0.5rem 1rem', background: 'rgba(255,200,0,0.1)', border: '1px solid gold', borderRadius: '8px', alignSelf: 'center', fontFamily: 'var(--font-display)', fontSize: '0.8rem', color: 'gold' }}>
            🕐 Time passes...
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '600px', gap: 0 }}>
        <Node label="Alice" icon="👩‍💻" color="blue" glow={simStep === 1} />
        <NetworkLine dashed color="rgba(0,180,255,0.3)" />
        {(simStep === 1 || simStep === 6) && (
          <Packet label={simStep === 6 ? '🔄 REPLAY' : '✅ Auth Token'} color={simStep === 6 ? 'red' : 'green'} />
        )}
        <NetworkLine dashed color="rgba(0,180,255,0.3)" />
        <Node label="Bob" icon="👨‍💻" color="blue" glow={simStep === 4 || simStep === 6} extraText={simStep >= 4 ? (simStep === 6 ? '✓ Accepted AGAIN!' : '✓ Received') : ''} />
      </div>

      {simStep >= 6 && (
        <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,45,85,0.1)', border: '1px solid var(--danger-red)', borderRadius: '8px', color: 'var(--danger-red)', fontFamily: 'var(--font-display)', fontSize: '0.85rem', textAlign: 'center' }}>
          ⚠️ Bob accepted the same message twice. Use timestamps or nonces to prevent replay.
        </div>
      )}
    </div>
  );

  /* 5. Modification */
  const renderModification = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
      <Node label="Mallory" icon="✏️" color="red" glow={simStep >= 2} extraText={simStep >= 2 ? 'Modifying content...' : 'Waiting...'} />

      <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '600px', gap: 0 }}>
        <Node label="Alice" icon="👩‍💻" color="blue" glow={simStep === 1} />
        <NetworkLine dashed color={simStep >= 2 ? 'rgba(255,45,85,0.4)' : 'rgba(0,180,255,0.3)'} />
        {simStep === 1 && <Packet label="Pay $10" color="green" />}
        {simStep >= 2 && simStep < 4 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--danger-red)' }}>⚡ intercepted</div>
            <Packet label="Pay $1000" color="red" />
          </div>
        )}
        {simStep >= 4 && <Packet label="Pay $1000" color="red" />}
        <NetworkLine dashed color="rgba(255,45,85,0.4)" />
        <Node label="Bob" icon="👨‍💻" color={simStep >= 5 ? 'red' : 'blue'} glow={simStep >= 5} extraText={simStep >= 5 ? '❌ Wrong content!' : ''} />
      </div>

      {simStep >= 5 && (
        <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,45,85,0.1)', border: '1px solid var(--danger-red)', borderRadius: '8px', color: 'var(--danger-red)', fontFamily: 'var(--font-display)', fontSize: '0.85rem', textAlign: 'center' }}>
          ⚠️ Content altered in transit. Message Authentication Codes (MACs) detect and prevent this.
        </div>
      )}
    </div>
  );

  /* 6. DoS */
  const renderDoS = () => {
    const loadPct = Math.min(dosPackets.length * 3, 100);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <Node label="Mallory" icon="💥" color="red" glow={simStep >= 2} extraText={simStep >= 2 ? `Flooding: ${dosPackets.length} junk pkts` : 'Charging...'} />

        <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '600px', position: 'relative', gap: 0 }}>
          <Node label="Alice" icon="👩‍💻" color="blue" glow={simStep === 1} extraText={simStep >= 3 ? '⌛ Queued' : ''} />
          <div style={{ flex: 1, height: '50px', position: 'relative', overflow: 'hidden' }}>
            {dosPackets.map(p => (
              <div key={p.id} style={{
                position: 'absolute', left: `${p.left}%`, top: '50%', transform: 'translateY(-50%)',
                width: '8px', height: '8px', background: 'var(--danger-red)', borderRadius: '50%',
                boxShadow: '0 0 6px var(--danger-red)',
                animation: 'flyRight 0.8s forwards'
              }} />
            ))}
            <style>{`@keyframes flyRight { 0% { left: 0; opacity: 1; } 100% { left: 100%; opacity: 0; } }`}</style>
          </div>
          <div style={{ minWidth: '100px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', color: loadPct >= 80 ? 'var(--danger-red)' : 'var(--text-muted)', marginBottom: '0.3rem' }}>
              Load: {loadPct}%
            </div>
            <div style={{ width: '80px', height: '10px', background: 'var(--panel-border)', borderRadius: '5px', overflow: 'hidden', margin: '0 auto' }}>
              <div style={{ width: `${loadPct}%`, height: '100%', background: loadPct >= 80 ? 'var(--danger-red)' : 'var(--primary-neon)', transition: 'all 0.3s', borderRadius: '5px' }} />
            </div>
            {loadPct >= 80 && <div style={{ color: 'var(--danger-red)', fontFamily: 'var(--font-display)', fontSize: '0.7rem', marginTop: '0.3rem', animation: 'pulse 0.5s infinite alternate' }}>OVERLOADED</div>}
          </div>
          <Node label="Bob" icon="🖥️" color={loadPct >= 80 ? 'red' : 'blue'} glow={loadPct >= 80} extraText={loadPct >= 80 ? '❌ Dropping pkts' : ''} />
        </div>

        {simStep >= 4 && (
          <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,45,85,0.1)', border: '1px solid var(--danger-red)', borderRadius: '8px', color: 'var(--danger-red)', fontFamily: 'var(--font-display)', fontSize: '0.85rem', textAlign: 'center' }}>
            ⚠️ Bob is overwhelmed. Alice's legitimate packets are being dropped. Rate limiting and firewalls mitigate DoS.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="glass-panel" style={{ marginTop: 0 }}>
      <style>{`@keyframes pulse{from{opacity:0.5;}to{opacity:1;}} @keyframes fadeIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}`}</style>

      <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)', marginBottom: '1.5rem' }}>Security Attacks: Active & Passive</h3>

      {/* Attack Selector Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--panel-border)' }}>
        <div style={{ width: '100%', display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
          <span style={{ alignSelf: 'center', fontFamily: 'var(--font-display)', fontSize: '0.75rem', color: 'var(--accent-blue)', marginRight: '0.3rem' }}>PASSIVE:</span>
          {ATTACKS.filter(a => a.group === 'passive').map(a => (
            <button key={a.id} className="btn" onClick={() => switchAttack(a.id)} style={{
              color: attackId === a.id ? 'var(--accent-blue)' : 'var(--text-muted)',
              background: attackId === a.id ? 'rgba(0,180,255,0.15)' : 'transparent',
              border: attackId === a.id ? '1px solid var(--accent-blue)' : '1px solid var(--panel-border)',
              fontSize: '0.8rem',
            }}>{a.label}</button>
          ))}
          <span style={{ alignSelf: 'center', fontFamily: 'var(--font-display)', fontSize: '0.75rem', color: 'var(--danger-red)', marginLeft: '1rem', marginRight: '0.3rem' }}>ACTIVE:</span>
          {ATTACKS.filter(a => a.group === 'active').map(a => (
            <button key={a.id} className="btn" onClick={() => switchAttack(a.id)} style={{
              color: attackId === a.id ? 'var(--danger-red)' : 'var(--text-muted)',
              background: attackId === a.id ? 'rgba(255,45,85,0.15)' : 'transparent',
              border: attackId === a.id ? '1px solid var(--danger-red)' : '1px solid var(--panel-border)',
              fontSize: '0.8rem',
            }}>{a.label}</button>
          ))}
        </div>
      </div>

      {/* Animation Canvas */}
      <div style={{ minHeight: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', marginBottom: '2rem', animation: 'fadeIn 0.3s' }} key={attackId}>
        {renderCanvas()}
      </div>

      {/* Tooltip */}
      <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--panel-border)', borderRadius: '8px', marginBottom: '2rem', fontSize: '0.88rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
        💡 {attack.tooltip}
      </div>

      <SimulationControls showPlay={true} canStep={simStep < attack.maxStep} onStep={handleStep} onReset={handleReset} />

      {/* Comparison Card */}
      <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {[
          {
            title: 'Passive Attacks', color: 'var(--accent-blue)', examples: ['Eavesdropping', 'Traffic Analysis'],
            traits: ['Does NOT modify data', 'Hard to detect', 'Goal: Obtain information', 'Prevention: Encryption'],
          },
          {
            title: 'Active Attacks', color: 'var(--danger-red)', examples: ['Masquerade', 'Replay', 'Modification', 'DoS'],
            traits: ['Modifies or disrupts data', 'Easier to detect', 'Goal: Disrupt / corrupt', 'Prevention: Auth + Integrity'],
          }
        ].map(col => (
          <div key={col.title} style={{ background: 'var(--panel-bg)', border: `1px solid ${col.color}`, borderRadius: '8px', padding: '1.5rem' }}>
            <h4 style={{ color: col.color, fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>{col.title}</h4>
            <div style={{ marginBottom: '0.75rem' }}>
              {col.examples.map(e => (
                <span key={e} style={{ display: 'inline-block', marginRight: '0.4rem', marginBottom: '0.4rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: `${col.color}20`, border: `1px solid ${col.color}`, color: col.color, fontFamily: 'var(--font-display)', fontSize: '0.75rem' }}>{e}</span>
              ))}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {col.traits.map(t => (
                <li key={t} style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '0.2rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>→ {t}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityAttacks;
