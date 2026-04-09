import React, { useState, useMemo } from 'react';
import SimulationControls from './SimulationControls';

// Module-level: avoids stale closure in useMemo
const eccAdd = (a, P, Q) => {
  if (!P || !Q) return P || Q;
  if (Math.abs(P.x - Q.x) < 0.001 && Math.abs(P.y + Q.y) < 0.001) return null; // P + (-P) = O

  let m;
  if (Math.abs(P.x - Q.x) < 0.001 && Math.abs(P.y - Q.y) < 0.001) {
    // Point Doubling
    if (Math.abs(P.y) < 0.001) return null;
    m = (3 * Math.pow(P.x, 2) + a) / (2 * P.y);
  } else {
    // Point Addition
    m = (Q.y - P.y) / (Q.x - P.x);
  }

  const xr = Math.pow(m, 2) - P.x - Q.x;
  const yr = m * (P.x - xr) - P.y;
  return { x: xr, y: -yr, minusR: { x: xr, y: yr }, m };
};

const EllipticCurve = () => {
  const [aStr, setAStr] = useState('-1');
  const [bStr, setBStr] = useState('1');
  const [kStr, setKStr] = useState('5');
  const [simStep, setSimStep] = useState(0);
  const [activeTab, setActiveTab] = useState('addition');

  const a = parseFloat(aStr) || -1;
  const b = parseFloat(bStr) || 1;

  // SVG viewport
  const width = 600;
  const height = 400;
  const minX = -4, maxX = 4, minY = -6, maxY = 6;

  const mapX = (x) => ((x - minX) / (maxX - minX)) * width;
  const mapY = (y) => height - ((y - minY) / (maxY - minY)) * height;

  // Generate the curve polyline
  const curvePath = useMemo(() => {
    const pathTop = [], pathBottom = [];
    const step = (maxX - minX) / 300;
    for (let x = minX; x <= maxX; x += step) {
      const y2 = Math.pow(x, 3) + a * x + b;
      if (y2 >= 0) {
        const y = Math.sqrt(y2);
        pathTop.push(`${mapX(x)},${mapY(y)}`);
        pathBottom.push(`${mapX(x)},${mapY(-y)}`);
      }
    }
    return { top: pathTop.join(' L '), bottom: pathBottom.join(' L ') };
  }, [a, b]);

  // Safe base points that lie on y^2 = x^3 + ax + b
  const demoP = useMemo(() => {
    const y2 = Math.pow(0, 3) + a * 0 + b;
    return { x: 0, y: y2 >= 0 ? Math.sqrt(y2) : 1 };
  }, [a, b]);

  const demoQ = useMemo(() => {
    const y2 = Math.pow(-1, 3) + a * (-1) + b;
    return { x: -1, y: y2 >= 0 ? Math.sqrt(y2) : 1 };
  }, [a, b]);

  const additionData = useMemo(() => {
    const R = eccAdd(a, demoP, demoQ);
    return { P: demoP, Q: demoQ, R };
  }, [a, demoP, demoQ]);

  const doublingData = useMemo(() => {
    const R = eccAdd(a, demoP, demoP);
    return { P: demoP, R };
  }, [a, demoP]);

  const scalarData = useMemo(() => {
    const safeK = Math.min(Math.max(parseInt(kStr) || 2, 2), 20);
    const steps = [{ desc: 'Base Point P (k=1)', point: demoP }];
    let current = demoP;
    for (let i = 2; i <= safeK; i++) {
      const next = eccAdd(a, current, demoP);
      if (!next) break;
      steps.push({ desc: `${i}P = ${i - 1}P + P`, point: next, prev: current });
      current = next;
    }
    return { steps, finalP: current };
  }, [a, demoP, kStr]);

  const maxScalarSteps = scalarData.steps.length - 1;

  const handleStep = () => {
    const maxStep = activeTab === 'scalar' ? maxScalarSteps : 3;
    if (simStep < maxStep) setSimStep(prev => prev + 1);
  };

  const handleReset = () => setSimStep(0);

  const drawLine = (ptA, ptB, ext = 5) => {
    if (!ptA || !ptB) return null;
    const dx = ptB.x - ptA.x;
    const dy = ptB.y - ptA.y;
    const p1 = { x: ptA.x - ext * dx, y: ptA.y - ext * dy };
    const p2 = { x: ptB.x + ext * dx, y: ptB.y + ext * dy };
    return (
      <line
        x1={mapX(p1.x)} y1={mapY(p1.y)}
        x2={mapX(p2.x)} y2={mapY(p2.y)}
        stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="4 4"
      />
    );
  };

  return (
    <div className="glass-panel" style={{ marginTop: '0rem' }}>
      <h3 style={{ color: 'var(--text-main)', fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>
        Elliptic Curve Cryptography (ECC)
      </h3>
      <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.8rem' }}>
        <span style={{ color: 'var(--danger-red)' }}>* Plotted over real numbers for visualization. Cryptographic ECC uses finite prime fields (y² = x³ + ax + b mod p).</span>
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--panel-border)' }}>
        {['addition', 'doubling', 'scalar'].map(tab => (
          <button key={tab} className="btn" onClick={() => { setActiveTab(tab); setSimStep(0); }}
            style={{
              background: activeTab === tab ? 'var(--panel-border)' : 'transparent',
              color: activeTab === tab
                ? (tab === 'addition' ? 'var(--primary-neon)' : tab === 'doubling' ? 'var(--accent-blue)' : 'gold')
                : 'var(--text-main)',
              borderBottom: activeTab === tab ? `2px solid ${tab === 'addition' ? 'var(--primary-neon)' : tab === 'doubling' ? 'var(--accent-blue)' : 'gold'}` : 'none',
              borderRadius: '4px 4px 0 0'
            }}>
            {tab === 'addition' ? 'Point Addition' : tab === 'doubling' ? 'Point Doubling' : 'Scalar Multiplication'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>

        {/* SVG Canvas */}
        <div style={{ flex: 2, minWidth: '400px', background: 'var(--panel-bg)', borderRadius: '8px', overflow: 'hidden' }}>
          <svg width="100%" height="400" viewBox={`0 0 ${width} ${height}`}>
            {/* Axes */}
            <line x1="0" y1={mapY(0)} x2={width} y2={mapY(0)} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <line x1={mapX(0)} y1="0" x2={mapX(0)} y2={height} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            {/* Grid labels */}
            {[-3, -2, -1, 1, 2, 3].map(n => (
              <g key={n}>
                <text x={mapX(n)} y={mapY(0) + 15} fill="rgba(255,255,255,0.3)" fontSize="10" textAnchor="middle">{n}</text>
                <text x={mapX(0) - 10} y={mapY(n) + 4} fill="rgba(255,255,255,0.3)" fontSize="10" textAnchor="end">{n}</text>
              </g>
            ))}

            {/* Curve */}
            {curvePath.top && <path d={`M ${curvePath.top}`} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />}
            {curvePath.bottom && <path d={`M ${curvePath.bottom}`} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />}

            {/* POINT ADDITION */}
            {activeTab === 'addition' && (
              <>
                <circle cx={mapX(demoP.x)} cy={mapY(demoP.y)} r="5" fill="var(--primary-neon)" />
                <text x={mapX(demoP.x) + 8} y={mapY(demoP.y) - 5} fill="var(--primary-neon)" fontSize="13" fontWeight="bold">P</text>

                {simStep >= 1 && (
                  <>
                    <circle cx={mapX(demoQ.x)} cy={mapY(demoQ.y)} r="5" fill="var(--accent-blue)" />
                    <text x={mapX(demoQ.x) + 8} y={mapY(demoQ.y) - 5} fill="var(--accent-blue)" fontSize="13" fontWeight="bold">Q</text>
                  </>
                )}
                {simStep >= 2 && additionData.R && (
                  <>
                    {drawLine(additionData.P, additionData.Q)}
                    <circle cx={mapX(additionData.R.minusR.x)} cy={mapY(additionData.R.minusR.y)} r="4" fill="rgba(150,150,150,0.8)" />
                    <text x={mapX(additionData.R.minusR.x) + 8} y={mapY(additionData.R.minusR.y)} fill="gray" fontSize="11">−R</text>
                  </>
                )}
                {simStep >= 3 && additionData.R && (
                  <>
                    <line
                      x1={mapX(additionData.R.minusR.x)} y1={mapY(additionData.R.minusR.y)}
                      x2={mapX(additionData.R.x)} y2={mapY(additionData.R.y)}
                      stroke="var(--danger-red)" strokeWidth="1.5" strokeDasharray="3 3"
                    />
                    <circle cx={mapX(additionData.R.x)} cy={mapY(additionData.R.y)} r="7" fill="var(--danger-red)" />
                    <text x={mapX(additionData.R.x) + 10} y={mapY(additionData.R.y)} fill="var(--danger-red)" fontSize="13" fontWeight="bold">R = P+Q</text>
                  </>
                )}
              </>
            )}

            {/* POINT DOUBLING */}
            {activeTab === 'doubling' && (
              <>
                <circle cx={mapX(demoP.x)} cy={mapY(demoP.y)} r="5" fill="var(--accent-blue)" />
                <text x={mapX(demoP.x) + 8} y={mapY(demoP.y) - 5} fill="var(--accent-blue)" fontSize="13" fontWeight="bold">P</text>

                {simStep >= 1 && doublingData.R && drawLine(doublingData.P, doublingData.R.minusR)}
                {simStep >= 2 && doublingData.R && (
                  <>
                    <circle cx={mapX(doublingData.R.minusR.x)} cy={mapY(doublingData.R.minusR.y)} r="4" fill="rgba(150,150,150,0.8)" />
                    <text x={mapX(doublingData.R.minusR.x) + 8} y={mapY(doublingData.R.minusR.y)} fill="gray" fontSize="11">−2P</text>
                  </>
                )}
                {simStep >= 3 && doublingData.R && (
                  <>
                    <line
                      x1={mapX(doublingData.R.minusR.x)} y1={mapY(doublingData.R.minusR.y)}
                      x2={mapX(doublingData.R.x)} y2={mapY(doublingData.R.y)}
                      stroke="var(--danger-red)" strokeWidth="1.5" strokeDasharray="3 3"
                    />
                    <circle cx={mapX(doublingData.R.x)} cy={mapY(doublingData.R.y)} r="7" fill="var(--danger-red)" />
                    <text x={mapX(doublingData.R.x) + 10} y={mapY(doublingData.R.y)} fill="var(--danger-red)" fontSize="13" fontWeight="bold">2P</text>
                  </>
                )}
              </>
            )}

            {/* SCALAR MULTIPLICATION */}
            {activeTab === 'scalar' && (
              <>
                {scalarData.steps.slice(0, simStep + 1).map((s, idx) => {
                  if (!s.point) return null;
                  const isActive = idx === simStep;
                  return (
                    <g key={idx}>
                      <circle
                        cx={mapX(s.point.x)} cy={mapY(s.point.y)}
                        r={isActive ? 7 : 4}
                        fill={isActive ? 'gold' : 'rgba(255,255,255,0.4)'}
                      />
                      {isActive && (
                        <text x={mapX(s.point.x) + 10} y={mapY(s.point.y)} fill="gold" fontSize="12">{s.desc}</text>
                      )}
                    </g>
                  );
                })}
                {/* Base point P always shown */}
                <circle cx={mapX(demoP.x)} cy={mapY(demoP.y)} r="5" fill="var(--primary-neon)" />
                <text x={mapX(demoP.x) + 8} y={mapY(demoP.y) + 15} fill="var(--primary-neon)" fontSize="11">P</text>
              </>
            )}
          </svg>
        </div>

        {/* Info Panel */}
        <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {activeTab === 'scalar' && (
            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
              <label style={{ display: 'block', color: 'gold', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Scalar k (2–20)</label>
              <input type="number" value={kStr} min="2" max="20"
                onChange={e => { setKStr(e.target.value); setSimStep(0); }}
                style={{ width: '100px', fontFamily: 'var(--font-display)' }}
              />
              <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Q = k·P is how ECC public keys are generated. k is the private key.
              </p>
            </div>
          )}

          <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--panel-border)', flexGrow: 1 }}>
            <h4 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>Procedure Log</h4>

            {activeTab === 'addition' && (
              <ul style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '2' }}>
                <li style={{ color: simStep >= 0 ? 'var(--primary-neon)' : 'inherit' }}>{simStep >= 0 ? '✓ ' : ''}Plot P on curve</li>
                <li style={{ color: simStep >= 1 ? 'var(--accent-blue)' : 'inherit' }}>{simStep >= 1 ? '✓ ' : ''}Plot Q on curve</li>
                <li style={{ color: simStep >= 2 ? 'white' : 'inherit' }}>{simStep >= 2 ? '✓ ' : ''}Draw secant PQ, find −R</li>
                <li style={{ color: simStep >= 3 ? 'var(--danger-red)' : 'inherit' }}>{simStep >= 3 ? '✓ ' : ''}Reflect −R → R = P+Q</li>
              </ul>
            )}

            {activeTab === 'doubling' && (
              <ul style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '2' }}>
                <li style={{ color: simStep >= 0 ? 'var(--accent-blue)' : 'inherit' }}>{simStep >= 0 ? '✓ ' : ''}Plot P on curve</li>
                <li style={{ color: simStep >= 1 ? 'white' : 'inherit' }}>{simStep >= 1 ? '✓ ' : ''}Draw tangent at P</li>
                <li style={{ color: simStep >= 2 ? 'white' : 'inherit' }}>{simStep >= 2 ? '✓ ' : ''}Find tangent intersection −2P</li>
                <li style={{ color: simStep >= 3 ? 'var(--danger-red)' : 'inherit' }}>{simStep >= 3 ? '✓ ' : ''}Reflect → 2P</li>
              </ul>
            )}

            {activeTab === 'scalar' && (
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                <div style={{ color: 'gold', marginBottom: '0.5rem' }}>Computing Q = {kStr}P</div>
                {scalarData.steps.slice(0, simStep + 1).map((s, i) => (
                  <div key={i} style={{ padding: '0.3rem 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{s.desc}</div>
                ))}
                {simStep === maxScalarSteps && (
                  <div style={{ marginTop: '1rem', color: 'var(--primary-neon)', fontWeight: 'bold' }}>
                    ✓ Public Key Q = {kStr}P Generated!
                  </div>
                )}
              </div>
            )}
          </div>

          <SimulationControls
            showPlay={true}
            canStep={activeTab === 'scalar' ? simStep < maxScalarSteps : simStep < 3}
            onStep={handleStep}
            onReset={handleReset}
          />
        </div>
      </div>
    </div>
  );
};

export default EllipticCurve;
