'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RISKY_QUESTS } from './riskyQuests';

const CATEGORIES = ['education', 'recreational', 'social', 'diy', 'charity', 'cooking', 'relaxation', 'music', 'busywork'];

const CATEGORY_ICONS = {
  education: '📚',
  recreational: '🎮',
  social: '👥',
  diy: '🔧',
  charity: '❤️',
  cooking: '🍳',
  relaxation: '🧘',
  music: '🎵',
  busywork: '📋',
};

function getDifficultyLabel(accessibility) {
  if (!accessibility) return 'Unknown';
  if (accessibility.includes('Few') || accessibility.includes('Minor')) return 'Easy';
  if (accessibility.includes('Some')) return 'Medium';
  if (accessibility.includes('Major')) return 'Hard';
  return 'Extreme';
}

function getDifficultyColor(accessibility, risky) {
  if (!accessibility) return 'rgba(255,255,255,0.3)';
  if (risky) return '#ff4444';
  if (accessibility.includes('Few') || accessibility.includes('Minor')) return '#00ff88';
  if (accessibility.includes('Some')) return '#a0a8ff';
  if (accessibility.includes('Major')) return '#ffcc00';
  return '#ff4444';
}

export default function QuestGenerator() {
  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [completed, setCompleted] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [error, setError] = useState(false);
  const [risky, setRisky] = useState(false);

  async function fetchQuest() {
    setLoading(true);
    setError(false);
    try {
      if (risky) {
        const random = RISKY_QUESTS[Math.floor(Math.random() * RISKY_QUESTS.length)];
        setQuest({ activity: random, type: 'risky', participants: 1, accessibility: 'Extreme challenge' });
      } else {
        const url = selectedCategory ? `/api/quest?type=${selectedCategory}` : '/api/quest';
        const res = await fetch(url);
        const data = await res.json();
        if (Array.isArray(data)) {
          setQuest(data[Math.floor(Math.random() * data.length)]);
        } else {
          setQuest(data);
        }
      }
    } catch (e) {
      setError(true);
    }
    setLoading(false);
  }

  function completeQuest() {
    if (!quest) return;
    const updated = [{ ...quest, completedAt: new Date().toLocaleDateString(), wasRisky: risky }, ...completed];
    setCompleted(updated);
    setQuest(null);
  }

  function toggleRisky() {
    setRisky(r => !r);
    setQuest(null);
    setSelectedCategory('');
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
      transition: 'all 0.5s',
    }}>

      {risky && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100%', height: '100%',
          background: 'radial-gradient(ellipse at center, rgba(80,0,0,0.4) 0%, rgba(20,0,0,0.7) 100%)',
          zIndex: 0,
          pointerEvents: 'none',
          animation: 'riskyIn 0.5s ease forwards',
        }} />
      )}

      <Link href="/" style={{
        position: 'fixed',
        top: '2rem',
        left: '2rem',
        color: risky ? 'rgba(255,100,100,0.5)' : 'rgba(255,255,255,0.4)',
        textDecoration: 'none',
        fontSize: '0.9rem',
        letterSpacing: '0.1em',
        zIndex: 10,
      }}>
        ← TrashChute
      </Link>

      <button
        onClick={() => setShowCompleted(s => !s)}
        style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${risky ? 'rgba(255,50,50,0.2)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: '50px',
          color: risky ? 'rgba(255,100,100,0.5)' : 'rgba(255,255,255,0.4)',
          padding: '8px 16px',
          cursor: 'pointer',
          fontSize: '0.85rem',
          zIndex: 10,
        }}
      >
        ✓ Completed {completed.length > 0 && `(${completed.length})`}
      </button>

      {!showCompleted ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          width: '100%',
          maxWidth: '560px',
          position: 'relative',
          zIndex: 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1
              key={risky ? 'risky' : 'normal'}
              style={{
                fontSize: '1.8rem',
                fontWeight: 600,
                background: risky
                  ? 'linear-gradient(135deg, #ff4444 0%, #ff0000 100%)'
                  : 'linear-gradient(135deg, #ffffff 0%, #a0a8ff 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.05em',
                textAlign: 'center',
              }}
            >
              {risky ? '⚠ Risky Quests' : 'Quest Generator'}
            </h1>
          </div>

          <button
            onClick={toggleRisky}
            style={{
              padding: '8px 20px',
              borderRadius: '50px',
              border: `1px solid ${risky ? 'rgba(255,50,50,0.5)' : 'rgba(255,255,255,0.1)'}`,
              background: risky ? 'rgba(255,0,0,0.15)' : 'transparent',
              color: risky ? '#ff4444' : 'rgba(255,255,255,0.3)',
              fontSize: '0.85rem',
              cursor: 'pointer',
              letterSpacing: '0.05em',
              transition: 'all 0.3s',
            }}
          >
            {risky ? '⚠ Risky Mode ON' : '⚠ Risky Mode'}
          </button>

          {!risky && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              justifyContent: 'center',
            }}>
              <button
                onClick={() => setSelectedCategory('')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '50px',
                  border: `1px solid ${selectedCategory === '' ? 'rgba(100,120,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  background: selectedCategory === '' ? 'rgba(100,120,255,0.1)' : 'transparent',
                  color: selectedCategory === '' ? '#a0a8ff' : 'rgba(255,255,255,0.3)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                Any
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '50px',
                    border: `1px solid ${selectedCategory === cat ? 'rgba(100,120,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    background: selectedCategory === cat ? 'rgba(100,120,255,0.1)' : 'transparent',
                    color: selectedCategory === cat ? '#a0a8ff' : 'rgba(255,255,255,0.3)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'all 0.2s',
                  }}
                >
                  {CATEGORY_ICONS[cat]} {cat}
                </button>
              ))}
            </div>
          )}

          <div style={{
            background: risky ? 'rgba(40,0,0,0.5)' : 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${risky ? 'rgba(255,50,50,0.2)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: '24px',
            padding: '2.5rem',
            width: '100%',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            gap: '1.5rem',
            boxShadow: risky ? '0 8px 32px rgba(255,0,0,0.1)' : '0 8px 32px rgba(0,0,0,0.4)',
            transition: 'all 0.5s',
          }}>
            {loading ? (
              <div style={{
                width: '40px',
                height: '40px',
                border: `2px solid ${risky ? 'rgba(255,50,50,0.2)' : 'rgba(255,255,255,0.1)'}`,
                borderTop: `2px solid ${risky ? '#ff4444' : '#667eea'}`,
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
            ) : error ? (
              <p style={{ color: 'rgba(255,100,100,0.7)' }}>Failed to fetch a quest. Try again!</p>
            ) : quest ? (
              <>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                  {risky ? '⚠️' : (CATEGORY_ICONS[quest.type] || '🎯')}
                </div>
                <p style={{
                  fontSize: '1.3rem',
                  color: risky ? 'rgba(255,180,180,0.9)' : 'rgba(255,255,255,0.9)',
                  lineHeight: 1.5,
                  fontWeight: 500,
                  transition: 'all 0.3s',
                }}>
                  {quest.activity}
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {!risky && (
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '50px',
                      background: 'rgba(100,120,255,0.1)',
                      border: '1px solid rgba(100,120,255,0.2)',
                      color: '#a0a8ff',
                      fontSize: '0.75rem',
                      textTransform: 'capitalize',
                    }}>
                      {CATEGORY_ICONS[quest.type]} {quest.type}
                    </span>
                  )}
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '50px',
                    background: risky ? 'rgba(255,0,0,0.1)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${risky ? 'rgba(255,50,50,0.2)' : 'rgba(255,255,255,0.08)'}`,
                    color: risky ? 'rgba(255,150,150,0.6)' : 'rgba(255,255,255,0.4)',
                    fontSize: '0.75rem',
                  }}>
                    👥 {quest.participants === 1 ? 'Solo' : `${quest.participants} people`}
                  </span>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '50px',
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${getDifficultyColor(quest.accessibility, risky)}33`,
                    color: getDifficultyColor(quest.accessibility, risky),
                    fontSize: '0.75rem',
                  }}>
                    ⚡ {risky ? 'Risky' : getDifficultyLabel(quest.accessibility)}
                  </span>
                </div>
              </>
            ) : (
              <p style={{ color: risky ? 'rgba(255,100,100,0.3)' : 'rgba(255,255,255,0.2)', fontSize: '1rem' }}>
                {risky ? 'Dare to get a quest?' : 'Press the button to get a quest!'}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={fetchQuest}
              style={{
                padding: '12px 32px',
                borderRadius: '50px',
                border: 'none',
                background: risky
                  ? 'linear-gradient(135deg, #cc0000, #ff4444)'
                  : 'linear-gradient(135deg, #667eea, #764ba2)',
                color: '#fff',
                fontSize: '0.9rem',
                cursor: 'pointer',
                letterSpacing: '0.1em',
                transition: 'all 0.3s',
              }}
            >
              {quest ? 'New Quest' : risky ? 'I Dare' : 'Get Quest'}
            </button>
            {quest && (
              <button
                onClick={completeQuest}
                style={{
                  padding: '12px 20px',
                  borderRadius: '50px',
                  border: `1px solid ${risky ? 'rgba(255,50,50,0.4)' : 'rgba(0,255,136,0.3)'}`,
                  background: risky ? 'rgba(255,0,0,0.1)' : 'rgba(0,255,136,0.1)',
                  color: risky ? '#ff4444' : '#00ff88',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              >
                Complete
              </button>
            )}
          </div>
        </div>
      ) : (
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          padding: '2.5rem',
          width: '100%',
          maxWidth: '560px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          position: 'relative',
          zIndex: 1,
        }}>
          <h2 style={{
            fontSize: '1.4rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            color: '#00ff88',
          }}>
            ✓ Completed Quests
          </h2>
          {completed.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '2rem' }}>
              No completed quests yet
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {completed.map((q, i) => (
                <div key={i} style={{
                  background: q.wasRisky ? 'rgba(255,0,0,0.05)' : 'rgba(0,255,136,0.03)',
                  border: `1px solid ${q.wasRisky ? 'rgba(255,50,50,0.15)' : 'rgba(0,255,136,0.1)'}`,
                  borderRadius: '14px',
                  padding: '1rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                }}>
                  <div>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>{q.activity}</p>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: '4px' }}>
                      {q.wasRisky ? '⚠️ Risky' : `${CATEGORY_ICONS[q.type]} ${q.type}`} · {q.completedAt}
                    </p>
                  </div>
                  <button
                    onClick={() => setCompleted(completed.filter((_, idx) => idx !== i))}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: q.wasRisky ? '#ff4444' : '#00ff88',
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                      padding: '4px',
                      flexShrink: 0,
                    }}
                    title="Remove"
                  >
                    ✓
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes riskyIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}