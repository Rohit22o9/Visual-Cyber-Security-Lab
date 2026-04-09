import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { modulesData } from '../../data/modules';
import { ChevronDown, ChevronRight, Terminal } from 'lucide-react';

const Sidebar = () => {
  const [openModules, setOpenModules] = useState(['classical-encryption']);
  const location = useLocation();

  const toggleModule = (id) => {
    if (openModules.includes(id)) {
      setOpenModules(openModules.filter(m => m !== id));
    } else {
      setOpenModules([...openModules, id]);
    }
  };

  return (
    <aside style={{
      width: '300px',
      height: 'calc(100vh - 60px)',
      position: 'fixed',
      top: '60px',
      left: 0,
      background: 'rgba(10, 15, 30, 0.95)',
      borderRight: '1px solid var(--panel-border)',
      overflowY: 'auto',
      padding: '1rem 0',
      zIndex: 50
    }}>
      <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem' }}>
        <h3 className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
          Simulation Overview
        </h3>
      </div>

      <nav>
        {modulesData.map((mod) => {
          const isOpen = openModules.includes(mod.id);
          const isActiveModule = location.pathname.includes(mod.id);

          return (
            <div key={mod.id} style={{ marginBottom: '0.5rem' }}>
              <button
                onClick={() => toggleModule(mod.id)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  color: isActiveModule ? 'var(--primary-neon)' : 'var(--text-main)',
                  padding: '0.75rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,255,157,0.05)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Terminal size={16} />
                  {mod.title}
                </div>
                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>

              {isOpen && (
                <div style={{ padding: '0.5rem 0', background: 'rgba(0,0,0,0.2)' }}>
                  {mod.simulations.map((sim) => (
                    <Link
                      key={sim.id}
                      to={sim.path}
                      style={{
                        display: 'block',
                        padding: '0.5rem 1.5rem 0.5rem 3rem',
                        color: 'var(--text-muted)',
                        fontSize: '0.9rem',
                        textDecoration: 'none',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.color = 'var(--primary-neon)';
                        e.currentTarget.style.paddingLeft = '3.5rem';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.color = 'var(--text-muted)';
                        e.currentTarget.style.paddingLeft = '3rem';
                      }}
                    >
                      {sim.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
