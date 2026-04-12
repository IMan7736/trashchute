'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ForestBg from './ForestBg';

const MODES = {
  work:  { label: 'Focus',       duration: 25 * 60, color: '#667eea' },
  short: { label: 'Short Break', duration:  5 * 60, color: '#43e97b' },
  long:  { label: 'Long Break',  duration: 15 * 60, color: '#f093fb' },
};

function fmt(secs) {
  const s = Math.abs(secs);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export default function Pomodoro() {
  // ── Pomodoro ──────────────────────────────────────────────────────────
  const [mode, setMode]         = useState('work');
  const [duration, setDuration] = useState(MODES.work.duration); // configured session length
  const [timeLeft, setTimeLeft] = useState(MODES.work.duration);
  const [running, setRunning]   = useState(false);
  const [sessions, setSessions] = useState(0);
  const [customBg, setCustomBg] = useState(null);
  const pomRef  = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (running) {
      pomRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(pomRef.current);
            setSessions(s => s + 1);
            // auto-restart with same duration
            setTimeLeft(duration);
            return duration;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(pomRef.current);
    }
    return () => clearInterval(pomRef.current);
  }, [running, duration]);

  function switchMode(m) {
    const d = MODES[m].duration;
    setMode(m);
    setDuration(d);
    setTimeLeft(d);
    setRunning(false);
  }

  function reset() { setTimeLeft(duration); setRunning(false); }

  // ── Tasks ─────────────────────────────────────────────────────────────
  const [panelOpen, setPanelOpen] = useState(false);
  const [tasks, setTasks]         = useState([]);
  const [activeId, setActiveId]   = useState(null);
  const [newName, setNewName]     = useState('');
  const [newEst, setNewEst]       = useState('');
  const taskRef = useRef(null);

  useEffect(() => {
    clearInterval(taskRef.current);
    if (activeId !== null) {
      taskRef.current = setInterval(() => {
        setTasks(prev => prev.map(t =>
          t.id === activeId && !t.done ? { ...t, elapsed: t.elapsed + 1 } : t
        ));
      }, 1000);
    }
    return () => clearInterval(taskRef.current);
  }, [activeId]);

  function addTask() {
    if (!newName.trim()) return;
    const mins = parseFloat(newEst);
    setTasks(prev => [...prev, {
      id: Date.now(),
      name: newName.trim(),
      estimate: isNaN(mins) || mins <= 0 ? 0 : Math.round(mins * 60),
      elapsed: 0,
      done: false,
    }]);
    setNewName('');
    setNewEst('');
  }

  function toggleActive(id) {
    setActiveId(prev => (prev === id ? null : id));
  }

  function completeTask(id) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: true } : t));
    if (activeId === id) setActiveId(null);
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (activeId === id) setActiveId(null);
  }

  // ── Ring scroll-to-adjust ─────────────────────────────────────────────
  const [hoverSide, setHoverSide] = useState(null); // 'minutes' | 'seconds' | null
  const ringRef      = useRef(null);
  const hoverRef     = useRef(null);
  const runningRef   = useRef(false);

  useEffect(() => { hoverRef.current   = hoverSide; }, [hoverSide]);
  useEffect(() => { runningRef.current = running;   }, [running]);

  // Non-passive wheel listener — active whenever a side is hovered
  useEffect(() => {
    const el = ringRef.current;
    if (!el) return;
    function onWheel(e) {
      if (!hoverRef.current || runningRef.current) return;
      e.preventDefault();
      const delta = e.deltaY < 0 ? 1 : -1;
      const side  = hoverRef.current;
      const adj   = side === 'minutes' ? delta * 60 : delta;
      setDuration(prev => {
        const next = Math.max(60, Math.min(99 * 60 + 59, prev + adj));
        setTimeLeft(next);
        return next;
      });
    }
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────
  const minutes      = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds      = String(timeLeft % 60).padStart(2, '0');
  const progress     = 1 - timeLeft / duration;
  const circumference = 2 * Math.PI * 120;
  const color        = MODES[mode].color;
  const activeTasks  = tasks.filter(t => !t.done);
  const doneTasks    = tasks.filter(t =>  t.done);

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <>
      <ForestBg customBg={customBg} />

      {/* Outer row: timer col + task panel */}
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'row',
        position: 'relative',
        zIndex: 2,
        overflow: 'hidden',
      }}>

        {/* ── Timer column ── */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          gap: '2rem',
          overflowY: 'auto',
          transition: 'padding 0.35s ease',
        }}>

          {/* Title + tasks toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={{
              fontSize: '1rem',
              fontWeight: 400,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
              margin: 0,
            }}>Pomodoro</h1>
            <button
              onClick={() => setPanelOpen(o => !o)}
              style={{
                padding: '4px 14px',
                borderRadius: '50px',
                border: `1px solid ${panelOpen ? color + '55' : 'rgba(255,255,255,0.1)'}`,
                background: panelOpen ? color + '18' : 'rgba(255,255,255,0.04)',
                color: panelOpen ? color : 'rgba(255,255,255,0.35)',
                fontSize: '0.72rem',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {panelOpen ? '✕ Tasks' : `Tasks${activeTasks.length ? ` (${activeTasks.length})` : ''}`}
            </button>
          </div>

          {/* Mode switcher */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {Object.entries(MODES).map(([key, { label }]) => (
              <button
                key={key}
                onClick={() => switchMode(key)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '50px',
                  border: `1px solid ${mode === key ? color : 'rgba(255,255,255,0.1)'}`,
                  background: mode === key ? `${color}22` : 'rgba(255,255,255,0.04)',
                  color: mode === key ? color : 'rgba(255,255,255,0.4)',
                  fontSize: '0.8rem',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >{label}</button>
            ))}
          </div>

          {/* Timer ring */}
          <div
            ref={ringRef}
            style={{
              position: 'relative',
              width: 280,
              height: 280,
              flexShrink: 0,
            }}
          >
            <svg width={280} height={280} style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx={140} cy={140} r={120}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={8}
              />
              <circle
                cx={140} cy={140} r={120}
                fill="none"
                stroke={color}
                strokeWidth={8}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
                style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.4s ease' }}
              />
            </svg>

            {/* Inner display */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem',
              userSelect: 'none',
            }}>
              {/* MM:SS — each half is independently hoverable in focus mode */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '4rem',
                fontWeight: 200,
                letterSpacing: '0.05em',
                color: '#fff',
                fontVariantNumeric: 'tabular-nums',
              }}>
                <span
                  onMouseEnter={() => !running && setHoverSide('minutes')}
                  onMouseLeave={() => setHoverSide(null)}
                  style={{
                    padding: '2px 4px',
                    borderRadius: '6px',
                    background: !running && hoverSide === 'minutes' ? 'rgba(255,255,255,0.1)' : 'transparent',
                    cursor: running ? 'default' : 'ns-resize',
                    transition: 'background 0.15s',
                  }}
                >{minutes}</span>
                <span style={{ opacity: 0.4, margin: '0 1px', lineHeight: 1 }}>:</span>
                <span
                  onMouseEnter={() => !running && setHoverSide('seconds')}
                  onMouseLeave={() => setHoverSide(null)}
                  style={{
                    padding: '2px 4px',
                    borderRadius: '6px',
                    background: !running && hoverSide === 'seconds' ? 'rgba(255,255,255,0.1)' : 'transparent',
                    cursor: running ? 'default' : 'ns-resize',
                    transition: 'background 0.15s',
                  }}
                >{seconds}</span>
              </div>

              <span style={{
                fontSize: '0.72rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: color,
                opacity: 0.8,
              }}>{MODES[mode].label}</span>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={() => setRunning(r => !r)}
              style={{
                padding: '14px 40px',
                borderRadius: '50px',
                border: `1px solid ${color}44`,
                background: `${color}22`,
                color: color,
                fontSize: '0.9rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s',
                minWidth: 120,
              }}
            >{running ? 'Pause' : 'Start'}</button>
            <button
              onClick={reset}
              style={{
                padding: '14px 24px',
                borderRadius: '50px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.3)',
                fontSize: '0.85rem',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >Reset</button>
          </div>

          {/* Session dots */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.4rem',
            opacity: 0.5,
          }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{
                  width: 8, height: 8,
                  borderRadius: '50%',
                  background: i < (sessions % 4) ? color : 'rgba(255,255,255,0.15)',
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)' }}>
              {sessions} session{sessions !== 1 ? 's' : ''}
            </span>
          </div>

        </div>

        {/* ── Task panel ── */}
        <div style={{
          width: panelOpen ? 360 : 0,
          flexShrink: 0,
          transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(24px)',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Fixed-width inner so content doesn't compress during animation */}
          <div style={{
            width: 360,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '2rem 1.5rem',
            gap: '1.25rem',
            overflowY: 'auto',
          }}>

            <h2 style={{
              fontSize: '0.78rem',
              fontWeight: 400,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.25)',
              margin: 0,
            }}>Tasks</h2>

            {/* Add form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTask()}
                placeholder="Task name…"
                style={inputStyle}
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  value={newEst}
                  onChange={e => setNewEst(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTask()}
                  placeholder="Est. (min)"
                  type="number"
                  min="0"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  onClick={addTask}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: `1px solid ${color}44`,
                    background: `${color}18`,
                    color: color,
                    fontSize: '0.82rem',
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >+ Add</button>
              </div>
            </div>

            {/* Active tasks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              {activeTasks.length === 0 && (
                <p style={{
                  fontSize: '0.78rem',
                  color: 'rgba(255,255,255,0.18)',
                  textAlign: 'center',
                  marginTop: '1.5rem',
                }}>No tasks yet</p>
              )}
              {activeTasks.map(task => {
                const isActive = task.id === activeId;
                const over     = task.estimate > 0 && task.elapsed > task.estimate;
                return (
                  <div key={task.id} style={{
                    background: isActive ? `${color}10` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isActive ? color + '30' : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: '10px',
                    padding: '12px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    transition: 'background 0.2s, border-color 0.2s',
                  }}>
                    {/* Top row: check · name · play · delete */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => completeTask(task.id)}
                        title="Mark complete"
                        style={{
                          width: 18, height: 18,
                          borderRadius: '50%',
                          border: '1px solid rgba(255,255,255,0.18)',
                          background: 'transparent',
                          cursor: 'pointer',
                          flexShrink: 0,
                          color: 'rgba(255,255,255,0.25)',
                          fontSize: '0.58rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >✓</button>

                      <span style={{
                        fontSize: '0.85rem',
                        color: 'rgba(255,255,255,0.85)',
                        flex: 1,
                        minWidth: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>{task.name}</span>

                      <button
                        onClick={() => toggleActive(task.id)}
                        title={isActive ? 'Pause' : 'Start'}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: isActive ? color : 'rgba(255,255,255,0.22)',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          padding: '2px 4px',
                          flexShrink: 0,
                          transition: 'color 0.2s',
                        }}
                      >{isActive ? '⏸' : '▶'}</button>

                      <button
                        onClick={() => deleteTask(task.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'rgba(255,255,255,0.13)',
                          cursor: 'pointer',
                          fontSize: '0.7rem',
                          padding: '2px 4px',
                          flexShrink: 0,
                        }}
                      >✕</button>
                    </div>

                    {/* Timer row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingLeft: '26px' }}>
                      <span style={{
                        fontSize: '0.78rem',
                        fontFamily: 'monospace',
                        fontVariantNumeric: 'tabular-nums',
                        color: over
                          ? '#ff6b6b'
                          : isActive ? color : 'rgba(255,255,255,0.3)',
                        transition: 'color 0.3s',
                      }}>
                        {over ? '+' : ''}{fmt(over ? task.elapsed - task.estimate : task.elapsed)}
                      </span>
                      {task.estimate > 0 && (
                        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.18)' }}>
                          / {fmt(task.estimate)}
                        </span>
                      )}
                      {isActive && (
                        <span style={{
                          fontSize: '0.58rem',
                          letterSpacing: '0.12em',
                          color: color,
                          opacity: 0.65,
                          marginLeft: 2,
                        }}>● LIVE</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Completed section */}
            {doneTasks.length > 0 && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                <p style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.18)',
                  marginBottom: '0.6rem',
                }}>Completed</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {doneTasks.map(task => (
                    <div key={task.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.02)',
                    }}>
                      <span style={{ color: '#43e97b', fontSize: '0.65rem', opacity: 0.55, flexShrink: 0 }}>✓</span>
                      <span style={{
                        fontSize: '0.8rem',
                        color: 'rgba(255,255,255,0.25)',
                        textDecoration: 'line-through',
                        flex: 1,
                        minWidth: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>{task.name}</span>
                      <span style={{
                        fontSize: '0.7rem',
                        fontFamily: 'monospace',
                        color: 'rgba(255,255,255,0.18)',
                        flexShrink: 0,
                      }}>{fmt(task.elapsed)}</span>
                      <button
                        onClick={() => deleteTask(task.id)}
                        style={{
                          background: 'transparent', border: 'none',
                          color: 'rgba(255,255,255,0.12)', cursor: 'pointer',
                          fontSize: '0.65rem', padding: '2px', flexShrink: 0,
                        }}
                      >✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Back link (fixed, matches tool layout style) */}
      <Link href="/" style={{
        position: 'fixed',
        top: '2rem',
        left: '2rem',
        zIndex: 10,
        color: 'rgba(255,255,255,0.4)',
        textDecoration: 'none',
        fontSize: '0.9rem',
        letterSpacing: '0.1em',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'color 0.2s',
      }}>← Back to TrashChute</Link>

      {/* Wallpaper button (fixed, always on top) */}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 10 }}>
        <input ref={fileRef} type="file" accept="image/*"
          onChange={e => { const f = e.target.files[0]; if (f) setCustomBg(URL.createObjectURL(f)); }}
          style={{ display: 'none' }}
        />
        <button onClick={() => fileRef.current.click()} style={{
          padding: '10px 18px', borderRadius: '50px',
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          color: 'rgba(255,255,255,0.5)',
          fontSize: '0.8rem', cursor: 'pointer', letterSpacing: '0.1em',
        }}>🖼 Wallpaper</button>
        {customBg && (
          <button onClick={() => setCustomBg(null)} style={{
            marginLeft: '8px', padding: '10px 18px', borderRadius: '50px',
            border: '1px solid rgba(255,100,100,0.2)',
            background: 'rgba(255,100,100,0.05)',
            backdropFilter: 'blur(10px)',
            color: 'rgba(255,100,100,0.5)',
            fontSize: '0.8rem', cursor: 'pointer',
          }}>Reset</button>
        )}
      </div>
    </>
  );
}

const inputStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px',
  padding: '10px 12px',
  color: '#fff',
  fontSize: '0.85rem',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};
