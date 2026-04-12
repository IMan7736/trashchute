'use client';

import { useState } from 'react';

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function generateShortID(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function generateNanoID(length = 21) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function generateHex(length = 32) {
  return Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

const FORMATS = [
  { label: 'UUID v4', key: 'uuid', generate: generateUUID, description: 'Standard universally unique identifier' },
  { label: 'Short ID', key: 'short', generate: () => generateShortID(8), description: '8 character alphanumeric ID' },
  { label: 'Nano ID', key: 'nano', generate: () => generateNanoID(21), description: 'URL-safe unique string' },
  { label: 'Hex', key: 'hex', generate: () => generateHex(32), description: '32 character hex string' },
];

export default function UUIDGenerator() {
  const [format, setFormat] = useState(FORMATS[0]);
  const [count, setCount] = useState(1);
  const [ids, setIds] = useState([]);
  const [copied, setCopied] = useState(null);
  const [uppercase, setUppercase] = useState(false);

  function generate() {
    const newIds = Array.from({ length: count }, () => {
      const id = format.generate();
      return uppercase ? id.toUpperCase() : id;
    });
    setIds(newIds);
  }

  function copyOne(id, index) {
    navigator.clipboard.writeText(id);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  }

  function copyAll() {
    navigator.clipboard.writeText(ids.join('\n'));
    setCopied('all');
    setTimeout(() => setCopied(null), 2000);
  }

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
        maxWidth: '600px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}>
        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: 600,
          background: 'linear-gradient(135deg, #ffffff 0%, #a0a8ff 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '0.05em',
          textAlign: 'center',
        }}>
          UUID Generator
        </h1>

        {/* Format selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>FORMAT</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {FORMATS.map(f => (
              <button
                key={f.key}
                onClick={() => { setFormat(f); setIds([]); }}
                style={{
                  padding: '10px 16px',
                  borderRadius: '12px',
                  border: `1px solid ${format.key === f.key ? 'rgba(100,120,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  background: format.key === f.key ? 'rgba(100,120,255,0.1)' : 'rgba(255,255,255,0.03)',
                  color: format.key === f.key ? '#a0a8ff' : 'rgba(255,255,255,0.4)',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ fontWeight: 500 }}>{f.label}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: '2px' }}>{f.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>COUNT</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setCount(c => Math.max(1, c - 1))}
                style={{
                  width: '28px', height: '28px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >−</button>
              <span style={{ color: '#fff', minWidth: '24px', textAlign: 'center' }}>{count}</span>
              <button
                onClick={() => setCount(c => Math.min(20, c + 1))}
                style={{
                  width: '28px', height: '28px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >+</button>
            </div>
          </div>

          {/* Uppercase toggle */}
          <button
            onClick={() => setUppercase(u => !u)}
            style={{
              padding: '6px 16px',
              borderRadius: '50px',
              border: `1px solid ${uppercase ? 'rgba(100,120,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
              background: uppercase ? 'rgba(100,120,255,0.1)' : 'transparent',
              color: uppercase ? '#a0a8ff' : 'rgba(255,255,255,0.3)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            UPPERCASE
          </button>
        </div>

        {/* Generate button */}
        <button
          onClick={generate}
          style={{
            padding: '14px',
            borderRadius: '14px',
            border: 'none',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 500,
            cursor: 'pointer',
            letterSpacing: '0.1em',
          }}
        >
          Generate
        </button>

        {/* Results */}
        {ids.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                GENERATED
              </p>
              {ids.length > 1 && (
                <button
                  onClick={copyAll}
                  style={{
                    background: 'none',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    color: copied === 'all' ? '#00ff88' : 'rgba(255,255,255,0.4)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    padding: '4px 10px',
                  }}
                >
                  {copied === 'all' ? '✓ Copied all' : 'Copy all'}
                </button>
              )}
            </div>
            {ids.map((id, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  gap: '1rem',
                }}
              >
                <span style={{
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  color: '#a0a8ff',
                  letterSpacing: '0.05em',
                  wordBreak: 'break-all',
                }}>
                  {id}
                </span>
                <button
                  onClick={() => copyOne(id, i)}
                  style={{
                    background: 'none',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    color: copied === i ? '#00ff88' : 'rgba(255,255,255,0.4)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    padding: '4px 10px',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                  }}
                >
                  {copied === i ? '✓' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}