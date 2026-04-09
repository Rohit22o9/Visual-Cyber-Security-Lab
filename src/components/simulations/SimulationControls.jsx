import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';

const SimulationControls = ({ 
  onStep, 
  onReset, 
  canStep = true,
  canPlay = true,
  showPlay = true,
  showStep = true
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPlaying && canStep) {
      const ms = 1000 / speedMultiplier;
      intervalRef.current = setInterval(() => {
        onStep();
      }, ms);
    } else if (!canStep && isPlaying) {
      // Auto-stop when simulation ends
      setIsPlaying(false);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speedMultiplier, canStep, onStep]);

  const handleResetInternal = () => {
    setIsPlaying(false);
    onReset();
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center',
      padding: '1rem',
      background: 'rgba(0,0,0,0.4)',
      borderRadius: '8px',
      border: '1px solid var(--panel-border)',
      marginTop: '2rem'
    }}>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        {showPlay && (
          isPlaying ? (
            <button className="btn btn-primary" onClick={() => setIsPlaying(false)} title="Pause">
              <Pause size={18} /> Pause
            </button>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={() => setIsPlaying(true)} 
              disabled={!canPlay || !canStep}
              style={{ opacity: (canPlay && canStep) ? 1 : 0.5 }}
              title="Play"
            >
              <Play size={18} /> Play
            </button>
          )
        )}

        {showStep && (
          <button 
            className="btn btn-accent" 
            onClick={() => { setIsPlaying(false); onStep(); }} 
            disabled={isPlaying || !canStep}
            style={{ opacity: (!isPlaying && canStep) ? 1 : 0.5 }}
            title="Step Forward"
          >
            <SkipForward size={18} /> Step
          </button>
        )}

        <button className="btn btn-danger" onClick={handleResetInternal} title="Reset">
          <RotateCcw size={18} /> Reset
        </button>
      </div>

      {showPlay && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '300px' }}>
          <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>Speed: {speedMultiplier}x</label>
          <input 
            type="range" 
            min="0.5" 
            max="3" 
            step="0.5" 
            value={speedMultiplier} 
            onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
            style={{ flex: 1, accentColor: 'var(--accent-blue)' }}
          />
        </div>
      )}
    </div>
  );
};

export default SimulationControls;
