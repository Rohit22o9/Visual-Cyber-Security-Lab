import React, { useState, useEffect, useRef } from 'react';
import SimulationControls from './SimulationControls';

const OSI_LAYERS = [
  {
    num: 7, name: 'Application', icon: '🖥️',
    desc: 'Provides network services directly to end-user applications. Handles high-level APIs, resource sharing, and remote file access.',
    mechanisms: ['SSL/TLS', 'PGP', 'S/MIME', 'SSH', 'HTTPS'],
    protocols: ['HTTP', 'FTP', 'SMTP', 'DNS', 'SNMP'],
    services: { confidentiality: true, integrity: true, authentication: true, nonRepudiation: true },
    primaryService: 'all',
  },
  {
    num: 6, name: 'Presentation', icon: '🔄',
    desc: 'Translates data between application and network formats. Handles encryption, compression, and encoding conversions.',
    mechanisms: ['SSL/TLS encryption', 'Data encryption', 'Format conversion'],
    protocols: ['SSL', 'TLS', 'MIME', 'XDR', 'ASN.1'],
    services: { confidentiality: true, integrity: false, authentication: false, nonRepudiation: false },
    primaryService: 'confidentiality',
  },
  {
    num: 5, name: 'Session', icon: '🤝',
    desc: 'Manages sessions between applications. Controls dialogues, synchronization, and session establishment/termination.',
    mechanisms: ['Session authentication', 'Kerberos', 'NetBIOS'],
    protocols: ['NetBIOS', 'RPC', 'PPTP', 'L2TP'],
    services: { confidentiality: false, integrity: false, authentication: true, nonRepudiation: false },
    primaryService: 'authentication',
  },
  {
    num: 4, name: 'Transport', icon: '📦',
    desc: 'Provides reliable end-to-end data transfer, flow control, and error recovery between hosts.',
    mechanisms: ['TLS/SSL', 'Port-based firewalls', 'End-to-end encryption'],
    protocols: ['TCP', 'UDP', 'SCTP', 'DCCP'],
    services: { confidentiality: true, integrity: true, authentication: false, nonRepudiation: false },
    primaryService: 'integrity',
  },
  {
    num: 3, name: 'Network', icon: '🌐',
    desc: 'Handles logical addressing and routing of packets between networks across the internet.',
    mechanisms: ['IPSec', 'VPN', 'Packet Filtering', 'Router ACLs'],
    protocols: ['IP', 'ICMP', 'OSPF', 'BGP', 'IPSec'],
    services: { confidentiality: true, integrity: true, authentication: true, nonRepudiation: false },
    primaryService: 'all',
  },
  {
    num: 2, name: 'Data Link', icon: '🔗',
    desc: 'Provides node-to-node data transfer between directly connected nodes, handling error detection.',
    mechanisms: ['WPA2/WPA3', 'MAC Filtering', 'Switch Port Security', '802.1X'],
    protocols: ['Ethernet', 'Wi-Fi (802.11)', 'PPP', 'ARP'],
    services: { confidentiality: false, integrity: true, authentication: true, nonRepudiation: false },
    primaryService: 'integrity',
  },
  {
    num: 1, name: 'Physical', icon: '⚡',
    desc: 'Transmits raw bit streams over physical medium. Concerned with hardware and signal transmission.',
    mechanisms: ['Physical security', 'Cable shielding', 'Optical isolation'],
    protocols: ['USB', 'Ethernet cable', 'DSL', 'Bluetooth PHY'],
    services: { confidentiality: false, integrity: false, authentication: false, nonRepudiation: false },
    primaryService: 'none',
  },
];

const SERVICE_COLORS = {
  confidentiality: 'var(--accent-blue)',
  integrity: 'var(--primary-neon)',
  authentication: 'gold',
  nonRepudiation: '#b388ff',
};

const LAYER_OVERLAY = {
  all: 'rgba(255,255,255,0.15)',
  confidentiality: 'rgba(0,180,255,0.2)',
  integrity: 'rgba(0,255,157,0.2)',
  authentication: 'rgba(255,200,0,0.2)',
  none: 'transparent',
};

const TOTAL_STEPS = 14; // 0=idle, 1-7=sender down, 8=physical transit, 9-14=receiver up (reuse 7)

const OSIArchitecture = () => {
  const [selectedLayer, setSelectedLayer] = useState(OSI_LAYERS[0]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [simStep, setSimStep] = useState(0);

  const handleStep = () => { if (simStep < TOTAL_STEPS) setSimStep(s => s + 1); };
  const handleReset = () => setSimStep(0);

  // Derive which layers are "active" for sender (0=none, 1-7=layer 7→1), receiver (8=transit, 9-15=layer 1→7)
  const senderActiveIdx = simStep >= 1 && simStep <= 7 ? simStep - 1 : -1;     // index 0-6 (index 0 = App = top)
  const receiverActiveIdx = simStep >= 9 && simStep <= 15 ? 15 - simStep : -1; // index 0-6 reversed upward

  const packetAtPhysical = simStep === 8;

  // Auto-update detail panel based on packet position
  useEffect(() => {
    if (senderActiveIdx >= 0) setSelectedLayer(OSI_LAYERS[senderActiveIdx]);
    else if (receiverActiveIdx >= 0) setSelectedLayer(OSI_LAYERS[receiverActiveIdx]);
  }, [senderActiveIdx, receiverActiveIdx]);

  const getLayerBg = (layer, isActive) => {
    if (isActive) return 'rgba(0,255,157,0.25)';
    if (showOverlay) return LAYER_OVERLAY[layer.primaryService];
    return 'var(--panel-bg)';
  };

  const getLayerBorder = (layer, isActive) => {
    if (isActive) return '1px solid var(--primary-neon)';
    if (layer === selectedLayer) return '1px solid var(--accent-blue)';
    return '1px solid var(--panel-border)';
  };

  const renderStack = (side) => {
    return (
      <div style={{ width: '220px' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>
          {side.toUpperCase()}
        </div>
        {OSI_LAYERS.map((layer, idx) => {
          const isSenderActive = side === 'sender' && senderActiveIdx === idx;
          const isReceiverActive = side === 'receiver' && receiverActiveIdx === idx;
          const isActive = isSenderActive || isReceiverActive;

          return (
            <div
              key={layer.num}
              onClick={() => setSelectedLayer(layer)}
              style={{
                padding: '0.5rem 0.75rem',
                marginBottom: '3px',
                borderRadius: '4px',
                cursor: 'pointer',
                background: getLayerBg(layer, isActive),
                border: getLayerBorder(layer, isActive),
                boxShadow: isActive ? '0 0 12px var(--primary-neon)' : 'none',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transform: isActive ? 'scaleX(1.04)' : 'scaleX(1)',
              }}
            >
              <span style={{ fontSize: '1rem' }}>{layer.icon}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Layer {layer.num}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: isActive ? 'var(--primary-neon)' : 'var(--text-main)' }}>
                  {layer.name}
                </div>
              </div>
              {isActive && (
                <div style={{
                  marginLeft: 'auto', width: '10px', height: '10px',
                  background: 'var(--primary-neon)', borderRadius: '50%',
                  boxShadow: '0 0 8px var(--primary-neon)',
                  animation: 'pulse 0.8s infinite alternate'
                }} />
              )}
            </div>
          );
        })}

        {/* Physical transit indicator */}
        {side === 'sender' && (
          <div style={{
            textAlign: 'center', padding: '0.3rem', marginTop: '3px',
            border: packetAtPhysical ? '1px solid var(--danger-red)' : '1px dashed var(--panel-border)',
            borderRadius: '4px', fontSize: '0.7rem', color: packetAtPhysical ? 'var(--danger-red)' : 'var(--text-muted)',
            fontFamily: 'var(--font-display)', transition: 'all 0.3s'
          }}>
            ──── Network ────►
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="glass-panel" style={{ marginTop: 0 }}>
      <style>{`
        @keyframes pulse { from { opacity: 0.5; } to { opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>OSI Security Architecture</h3>
        <button
          className="btn"
          onClick={() => setShowOverlay(o => !o)}
          style={{ color: showOverlay ? 'gold' : 'var(--text-muted)', border: `1px solid ${showOverlay ? 'gold' : 'var(--panel-border)'}` }}
        >
          {showOverlay ? '🛡️ Security Overlay ON' : '🛡️ Show Security Overlay'}
        </button>
      </div>

      {showOverlay && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Confidentiality', color: 'var(--accent-blue)' },
            { label: 'Integrity', color: 'var(--primary-neon)' },
            { label: 'Authentication', color: 'gold' },
            { label: 'All three', color: 'rgba(255,255,255,0.6)' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: l.color }} />
              <span style={{ color: 'var(--text-muted)' }}>{l.label}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>

        {/* LEFT: Dual-stack OSI */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          {renderStack('sender')}
          {renderStack('receiver')}
        </div>

        {/* RIGHT: Detail Panel */}
        <div style={{ flex: 1, minWidth: '300px', animation: 'fadeIn 0.3s' }} key={selectedLayer.num}>
          <div style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '1.5rem' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2rem' }}>{selectedLayer.icon}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', color: 'var(--text-muted)', fontSize: '0.75rem' }}>Layer {selectedLayer.num}</div>
                <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary-neon)', fontSize: '1.2rem', margin: 0 }}>{selectedLayer.name}</h4>
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {selectedLayer.desc}
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ color: 'var(--text-main)', fontFamily: 'var(--font-display)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Security Mechanisms</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {selectedLayer.mechanisms.map(m => (
                  <span key={m} style={{
                    padding: '0.2rem 0.6rem', borderRadius: '4px',
                    background: 'rgba(0,255,157,0.12)', border: '1px solid var(--primary-neon)',
                    color: 'var(--primary-neon)', fontSize: '0.75rem', fontFamily: 'var(--font-display)'
                  }}>{m}</span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ color: 'var(--text-main)', fontFamily: 'var(--font-display)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Security Services</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {Object.entries(SERVICE_COLORS).map(([service, color]) => {
                  const provided = selectedLayer.services[service];
                  const label = { confidentiality: 'Confidentiality', integrity: 'Integrity', authentication: 'Authentication', nonRepudiation: 'Non-Repudiation' }[service];
                  return (
                    <span key={service} style={{
                      padding: '0.25rem 0.75rem', borderRadius: '20px',
                      background: provided ? `rgba(${color === 'gold' ? '255,200,0' : color === 'var(--accent-blue)' ? '0,180,255' : color === '#b388ff' ? '179,136,255' : '0,255,157'}, 0.15)` : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${provided ? color : 'rgba(255,255,255,0.1)'}`,
                      color: provided ? color : 'rgba(255,255,255,0.2)',
                      fontSize: '0.75rem', fontFamily: 'var(--font-display)'
                    }}>
                      {provided ? '✓ ' : ''}{label}
                    </span>
                  );
                })}
              </div>
            </div>

            <div>
              <div style={{ color: 'var(--text-main)', fontFamily: 'var(--font-display)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Example Protocols</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {selectedLayer.protocols.map(p => (
                  <span key={p} style={{
                    padding: '0.2rem 0.5rem', borderRadius: '4px',
                    background: 'rgba(0,180,255,0.1)', border: '1px solid var(--accent-blue)',
                    color: 'var(--accent-blue)', fontSize: '0.75rem', fontFamily: 'var(--font-display)'
                  }}>{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SimulationControls
        showPlay={true}
        canStep={simStep < TOTAL_STEPS}
        onStep={handleStep}
        onReset={handleReset}
      />
    </div>
  );
};

export default OSIArchitecture;
