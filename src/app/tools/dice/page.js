'use client';

import { useState } from 'react';
import Link from 'next/link';

const DICE = [
  { sides: 4, label: 'D4', shape: 'triangle' },
  { sides: 6, label: 'D6', shape: 'square' },
  { sides: 8, label: 'D8', shape: 'diamond' },
  { sides: 10, label: 'D10', shape: 'diamond' },
  { sides: 12, label: 'D12', shape: 'pentagon' },
  { sides: 20, label: 'D20', shape: 'triangle' },
  { sides: 100, label: 'D100', shape: 'circle' },
];

function DiceShape({ sides, size = 80, rolling }) {
  const color = rolling ? '#a0a8ff' : 'rgba(255,255,255,0.08)';
  const stroke = rolling ? '#667eea' : 'rgba(255,255,255,0.15)';

  if (sides === 6) return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <rect x="8" y="8" width="64" height="64" rx="12"
        fill={color} stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
  if (sides === 4 || sides === 20) return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <polygon points="40,6 74,70 6,70"
        fill={color} stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
  if (sides === 8 || sides === 10) return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <polygon points="40,6 74,40 40,74 6,40"
        fill={color} stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
  if (sides === 12) return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <polygon points="40,4 62,16 74,38 66,62 48,74 32,74 14,62 6,38 18,16"
        fill={color} stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="34"
        fill={color} stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
}

export default function DiceCoin() {
  const [selectedDie, setSelectedDie] = useState(DICE[1]);
  const [diceResult, setDiceResult] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [diceCount, setDiceCount] = useState(1);
  const [allResults, setAllResults] = useState([]);

  const [coinResult, setCoinResult] = useState(null);
  const [flipping, setFlipping] = useState(false);
  const [coinHistory, setCoinHistory] = useState([]);

  function rollDice() {
    setRolling(true);
    setDiceResult(null);

    let flips = 0;
    const interval = setInterval(() => {
      setDiceResult(Math.floor(Math.random() * selectedDie.sides) + 1);
      flips++;
      if (flips > 12) {
        clearInterval(interval);
        const results = Array.from({ length: diceCount }, () =>
          Math.floor(Math.random() * selectedDie.sides) + 1
        );
        setAllResults(results);
        setDiceResult(results.reduce((a, b) => a + b, 0));
        setRolling(false);
      }
    }, 60);
  }

  function flipCoin() {
    setFlipping(true);
    setCoinResult(null);

    let flips = 0;
    const interval = setInterval(() => {
      setCoinResult(Math.random() > 0.5 ? 'heads' : 'tails');
      flips++;
      if (flips > 12) {
        clearInterval(interval);
        const result = Math.random() > 0.5 ? 'heads' : 'tails';
        setCoinResult(result);
        setCoinHistory(prev => [result, ...prev].slice(0, 10));
        setFlipping(false);
      }
    }, 60);
  }

  const total = allResults.reduce((a, b) => a + b, 0);

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
      gap: '3rem',
    }}>
      <Link href="/" style={{
        position: 'fixed',
        top: '2rem',
        left: '2rem',
        color: 'rgba(255,255,255,0.4)',
        textDecoration: 'none',
        fontSize: '0.9rem',
        letterSpacing: '0.1em',
      }}>
        ← TrashChute
      </Link>

      <h1 style={{
        fontSize: '1.8rem',
        fontWeight: 600,
        background: 'linear-gradient(135deg, #ffffff 0%, #a0a8ff 100%)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '0.05em',
      }}>
        Dice & Coin
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        width: '100%',
        maxWidth: '760px',
      }}>

        {/* Dice Section */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', letterSpacing: '0.15em' }}>DICE ROLLER</p>

          {/* Die selector */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {DICE.map(die => (
              <button
                key={die.sides}
                onClick={() => { setSelectedDie(die); setDiceResult(null); setAllResults([]); }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '50px',
                  border: `1px solid ${selectedDie.sides === die.sides ? 'rgba(100,120,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  background: selectedDie.sides === die.sides ? 'rgba(100,120,255,0.1)' : 'transparent',
                  color: selectedDie.sides === die.sides ? '#a0a8ff' : 'rgba(255,255,255,0.3)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {die.label}
              </button>
            ))}
          </div>

          {/* Dice count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setDiceCount(c => Math.max(1, c - 1))}
              style={{
                width: '32px', height: '32px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'transparent',
                color: 'rgba(255,255,255,0.5)',
                fontSize: '1.2rem',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >−</button>
            <span style={{ color: '#fff', fontSize: '1rem', minWidth: '60px', textAlign: 'center' }}>
              {diceCount}× {selectedDie.label}
            </span>
            <button
              onClick={() => setDiceCount(c => Math.min(10, c + 1))}
              style={{
                width: '32px', height: '32px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'transparent',
                color: 'rgba(255,255,255,0.5)',
                fontSize: '1.2rem',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >+</button>
          </div>

          {/* Die display */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100px',
            height: '100px',
            animation: rolling ? 'shake 0.1s infinite' : 'none',
          }}>
            <DiceShape sides={selectedDie.sides} size={90} rolling={rolling} />
            {diceResult !== null && (
              <span style={{
                position: 'absolute',
                color: '#fff',
                fontSize: diceResult > 99 ? '1rem' : '1.4rem',
                fontWeight: 600,
              }}>
                {diceResult}
              </span>
            )}
          </div>

          {/* Individual results */}
          {allResults.length > 1 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
              {allResults.map((r, i) => (
                <span key={i} style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: 'rgba(100,120,255,0.1)',
                  color: '#a0a8ff',
                  fontSize: '0.8rem',
                }}>
                  {r}
                </span>
              ))}
              <span style={{
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.4)',
                fontSize: '0.8rem',
              }}>
                = {total}
              </span>
            </div>
          )}

          <button
            onClick={rollDice}
            disabled={rolling}
            style={{
              padding: '12px 32px',
              borderRadius: '50px',
              border: 'none',
              background: rolling ? 'rgba(100,120,255,0.3)' : 'linear-gradient(135deg, #667eea, #764ba2)',
              color: '#fff',
              fontSize: '0.9rem',
              cursor: rolling ? 'not-allowed' : 'pointer',
              letterSpacing: '0.1em',
              transition: 'all 0.2s',
            }}
          >
            {rolling ? 'Rolling...' : 'Roll'}
          </button>
        </div>

        {/* Coin Section */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', letterSpacing: '0.15em' }}>COIN FLIP</p>

          {/* Coin display */}
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: coinResult === 'heads'
              ? 'linear-gradient(135deg, #f6d365, #fda085)'
              : coinResult === 'tails'
              ? 'linear-gradient(135deg, #a0a8ff, #667eea)'
              : 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            animation: flipping ? 'coinFlip 0.1s infinite' : 'none',
            transition: 'background 0.3s',
          }}>
            {coinResult === 'heads' ? '👑' : coinResult === 'tails' ? '⭐' : '🪙'}
          </div>

          {coinResult && !flipping && (
            <p style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: coinResult === 'heads' ? '#fda085' : '#a0a8ff',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
            }}>
              {coinResult}
            </p>
          )}

          <button
            onClick={flipCoin}
            disabled={flipping}
            style={{
              padding: '12px 32px',
              borderRadius: '50px',
              border: 'none',
              background: flipping ? 'rgba(100,120,255,0.3)' : 'linear-gradient(135deg, #667eea, #764ba2)',
              color: '#fff',
              fontSize: '0.9rem',
              cursor: flipping ? 'not-allowed' : 'pointer',
              letterSpacing: '0.1em',
              transition: 'all 0.2s',
            }}
          >
            {flipping ? 'Flipping...' : 'Flip'}
          </button>

          {/* Coin history */}
          {coinHistory.length > 0 && (
            <div style={{ width: '100%' }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', letterSpacing: '0.1em', marginBottom: '8px' }}>
                HISTORY
              </p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {coinHistory.map((r, i) => (
                  <span key={i} style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: r === 'heads' ? 'rgba(253,160,133,0.1)' : 'rgba(100,120,255,0.1)',
                    color: r === 'heads' ? '#fda085' : '#a0a8ff',
                    fontSize: '0.75rem',
                  }}>
                    {r === 'heads' ? 'H' : 'T'}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes coinFlip {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(0.1); }
        }
      `}</style>
    </div>
  );
}