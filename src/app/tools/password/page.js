'use client';

import { useState, useCallback } from 'react';

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  });
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState(0);

  function getStrength(pwd, opts) {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 16) score++;
    if (opts.uppercase && opts.lowercase) score++;
    if (opts.numbers) score++;
    if (opts.symbols) score++;
    return score;
  }

  const generate = useCallback(() => {
    let chars = '';
    if (options.uppercase) chars += UPPERCASE;
    if (options.lowercase) chars += LOWERCASE;
    if (options.numbers) chars += NUMBERS;
    if (options.symbols) chars += SYMBOLS;
    if (!chars) return;

    let pwd = '';
    // Ensure at least one of each selected type
    if (options.uppercase) pwd += UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)];
    if (options.lowercase) pwd += LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)];
    if (options.numbers) pwd += NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
    if (options.symbols) pwd += SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

    for (let i = pwd.length; i < length; i++) {
      pwd += chars[Math.floor(Math.random() * chars.length)];
    }

    // Shuffle
    pwd = pwd.split('').sort(() => Math.random() - 0.5).join('');
    setPassword(pwd);
    setStrength(getStrength(pwd, options));
  }, [length, options]);

  function copy() {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function toggleOption(key) {
    const newOptions = { ...options, [key]: !options[key] };
    const anyEnabled = Object.values(newOptions).some(Boolean);
    if (!anyEnabled) return;
    setOptions(newOptions);
  }

  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strengthColors = ['', '#ff4444', '#ff8800', '#ffcc00', '#44cc44', '#00ff88'];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      zIndex: 1,
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '24px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '520px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: 600,
          marginBottom: '2rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #ffffff 0%, #a0a8ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '0.05em',
        }}>
          Password Generator
        </h1>

        {/* Password display */}
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '14px',
          padding: '1.2rem 1.5rem',
          marginBottom: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          minHeight: '60px',
        }}>
          <span style={{
            fontFamily: 'monospace',
            fontSize: '1.1rem',
            color: password ? '#fff' : 'rgba(255,255,255,0.2)',
            letterSpacing: '0.08em',
            wordBreak: 'break-all',
            flex: 1,
          }}>
            {password || 'Click generate...'}
          </span>
          <button
            onClick={copy}
            style={{
              background: copied ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${copied ? 'rgba(0,255,136,0.3)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '8px',
              color: copied ? '#00ff88' : 'rgba(255,255,255,0.5)',
              padding: '6px 14px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              letterSpacing: '0.05em',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>

        {/* Strength bar */}
        {password && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              display: 'flex',
              gap: '4px',
              marginBottom: '4px',
            }}>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '2px',
                  background: i <= strength ? strengthColors[strength] : 'rgba(255,255,255,0.1)',
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>
            <p style={{
              fontSize: '0.75rem',
              color: strengthColors[strength],
              textAlign: 'right',
            }}>
              {strengthLabels[strength]}
            </p>
          </div>
        )}

        {/* Length slider */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
          }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Length</span>
            <span style={{ color: '#fff', fontWeight: 500 }}>{length}</span>
          </div>
          <input
            type="range"
            min="6"
            max="64"
            value={length}
            onChange={e => setLength(+e.target.value)}
            style={{ width: '100%', accentColor: '#667eea' }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '4px',
          }}>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>6</span>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>64</span>
          </div>
        </div>

        {/* Options */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginBottom: '2rem',
        }}>
          {Object.entries(options).map(([key, val]) => (
            <button
              key={key}
              onClick={() => toggleOption(key)}
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                border: `1px solid ${val ? 'rgba(100,120,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                background: val ? 'rgba(100,120,255,0.1)' : 'rgba(255,255,255,0.03)',
                color: val ? '#a0a8ff' : 'rgba(255,255,255,0.3)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s',
                letterSpacing: '0.05em',
              }}
            >
              {val ? '✓ ' : ''}{key}
            </button>
          ))}
        </div>

        {/* Generate button */}
        <button
          onClick={generate}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '14px',
            border: 'none',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 500,
            cursor: 'pointer',
            letterSpacing: '0.1em',
            transition: 'opacity 0.2s',
          }}
        >
          Generate
        </button>
      </div>
    </div>
  );
}