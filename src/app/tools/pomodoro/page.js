'use client';

import { useState, useEffect, useRef } from 'react';
import ForestBg from './ForestBg';

const MODES = {
  work: { label: 'Focus', duration: 25 * 60, color: '#667eea' },
  short: { label: 'Short Break', duration: 5 * 60, color: '#43e97b' },
  long: { label: 'Long Break', duration: 15 * 60, color: '#f093fb' },
};

export default function Pomodoro() {
  const [mode, setMode] = useState('work');
  const [timeLeft, setTimeLeft] = useState(MODES.work.duration);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [customBg, setCustomBg] = useState(null);
  const intervalRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setSessions(s => s + 1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  function switchMode(newMode) {
    setMode(newMode);
    setTimeLeft(MODES[newMode].duration);
    setRunning(false);
  }

  function reset() {
    setTimeLeft(MODES[mode].duration);
    setRunning(false);
  }

  function handleWallpaper(e) {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCustomBg(url);
  }

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');
  const progress = 1 - timeLeft / MODES[mode].duration;
  const circumference = 2 * Math.PI * 120;
  const color = MODES[mode].color;

  return (
    <>
      <ForestBg customBg={customBg} />

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        gap: '2rem',
        position: 'relative',
        zIndex: 2,
      }}>

        {/* Title */}
        <h1 style={{
          fontSize: '1rem',
          fontWeight: 400,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)',
        }}>Pomodoro</h1>

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
            >
              {label}
            </button>
          ))}
        </div>

        {/* Timer ring */}
        <div style={{ position: 'relative', width: 280, height: 280 }}>
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
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem',
          }}>
            <span style={{
              fontSize: '4rem',
              fontWeight: 200,
              letterSpacing: '0.05em',
              color: '#fff',
              fontVariantNumeric: 'tabular-nums',
            }}>{minutes}:{seconds}</span>
            <span style={{
              fontSize: '0.75rem',
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
          >
            {running ? 'Pause' : 'Start'}
          </button>
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
          >
            Reset
          </button>
        </div>

        {/* Session counter */}
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

        {/* Wallpaper button */}
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 10 }}>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleWallpaper} style={{ display: 'none' }} />
          <button onClick={() => fileInputRef.current.click()} style={{
            padding: '10px 18px',
            borderRadius: '50px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.8rem',
            cursor: 'pointer',
            letterSpacing: '0.1em',
          }}>
            🖼 Wallpaper
          </button>
          {customBg && (
            <button onClick={() => setCustomBg(null)} style={{
              marginLeft: '8px',
              padding: '10px 18px',
              borderRadius: '50px',
              border: '1px solid rgba(255,100,100,0.2)',
              background: 'rgba(255,100,100,0.05)',
              backdropFilter: 'blur(10px)',
              color: 'rgba(255,100,100,0.5)',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}>
              Reset
            </button>
          )}
        </div>

      </div>
    </>
  );
}