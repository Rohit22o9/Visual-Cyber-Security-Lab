import React from 'react';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';

const SimulationControls = ({ 
  onPlay, 
  onPause, 
  onStep, 
  onReset, 
  isPlaying = false,
  canStep = true,
  canPlay = true,
  showPlay = true,
  showStep = true
}) => {
  return (
    <div style={{
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      padding: '1rem',
      background: 'rgba(0,0,0,0.4)',
      borderRadius: '8px',
      border: '1px solid var(--panel-border)',
      marginTop: '2rem'
    }}>
      {showPlay && (
        isPlaying ? (
          <button className="btn btn-primary" onClick={onPause} title="Pause">
            <Pause size={18} /> Pause
          </button>
        ) : (
          <button 
            className="btn btn-primary" 
            onClick={onPlay} 
            disabled={!canPlay}
            style={{ opacity: canPlay ? 1 : 0.5 }}
            title="Play"
          >
            <Play size={18} /> Play
          </button>
        )
      )}

      {showStep && (
        <button 
          className="btn btn-accent" 
          onClick={onStep} 
          disabled={isPlaying || !canStep}
          style={{ opacity: (!isPlaying && canStep) ? 1 : 0.5 }}
          title="Step Forward"
        >
          <SkipForward size={18} /> Step
        </button>
      )}

      <button className="btn btn-danger" onClick={onReset} title="Reset">
        <RotateCcw size={18} /> Reset
      </button>
    </div>
  );
};

export default SimulationControls;
