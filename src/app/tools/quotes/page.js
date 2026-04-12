'use client';

import { useState, useEffect } from 'react';

export default function QuoteGenerator() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  async function fetchQuote() {
    setLoading(true);
    try {
      const res = await fetch('https://api.adviceslip.com/advice', { cache: 'no-store' });
      const data = await res.json();
      setQuote(data.slip);
    } catch (e) {
      setQuote({ advice: 'Failed to fetch a quote. Try again!', id: 0 });
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchQuote();
    const saved = localStorage.getItem('favorite-quotes');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  function copy() {
    if (!quote) return;
    navigator.clipboard.writeText(`"${quote.advice}"`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function toggleFavorite() {
    if (!quote) return;
    const exists = favorites.find(f => f.id === quote.id);
    let updated;
    if (exists) {
      updated = favorites.filter(f => f.id !== quote.id);
    } else {
      updated = [...favorites, quote];
    }
    setFavorites(updated);
    localStorage.setItem('favorite-quotes', JSON.stringify(updated));
  }

  const isFavorited = quote && favorites.find(f => f.id === quote.id);

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
      {/* Favorites toggle */}
      <button
        onClick={() => setShowFavorites(s => !s)}
        style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '50px',
          color: 'rgba(255,255,255,0.4)',
          padding: '8px 16px',
          cursor: 'pointer',
          fontSize: '0.85rem',
          zIndex: 10,
        }}
      >
        ★ Favorites {favorites.length > 0 && `(${favorites.length})`}
      </button>

      {/* Main quote card */}
      {!showFavorites && (
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          padding: '3rem',
          width: '100%',
          maxWidth: '600px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontSize: '1.4rem',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #ffffff 0%, #a0a8ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.05em',
          }}>
            Quote Generator
          </h1>

          {/* Quote */}
          <div style={{ minHeight: '120px', display: 'flex', alignItems: 'center' }}>
            {loading ? (
              <div style={{
                width: '40px',
                height: '40px',
                border: '2px solid rgba(255,255,255,0.1)',
                borderTop: '2px solid #667eea',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
            ) : quote ? (
              <div>
                <p style={{
                  fontSize: '1.4rem',
                  color: 'rgba(255,255,255,0.9)',
                  lineHeight: 1.6,
                  fontStyle: 'italic',
                  marginBottom: '1rem',
                }}>
                  "{quote.advice}"
                </p>
              </div>
            ) : null}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={fetchQuote}
              style={{
                padding: '12px 28px',
                borderRadius: '50px',
                border: 'none',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: '#fff',
                fontSize: '0.9rem',
                cursor: 'pointer',
                letterSpacing: '0.1em',
              }}
            >
              New Quote
            </button>

            <button
              onClick={toggleFavorite}
              style={{
                padding: '12px 20px',
                borderRadius: '50px',
                border: `1px solid ${isFavorited ? 'rgba(255,200,0,0.4)' : 'rgba(255,255,255,0.1)'}`,
                background: isFavorited ? 'rgba(255,200,0,0.1)' : 'transparent',
                color: isFavorited ? '#ffcc00' : 'rgba(255,255,255,0.4)',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {isFavorited ? '★ Saved' : '☆ Save'}
            </button>

            <button
              onClick={copy}
              style={{
                padding: '12px 20px',
                borderRadius: '50px',
                border: `1px solid ${copied ? 'rgba(0,255,136,0.3)' : 'rgba(255,255,255,0.1)'}`,
                background: copied ? 'rgba(0,255,136,0.1)' : 'transparent',
                color: copied ? '#00ff88' : 'rgba(255,255,255,0.4)',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {/* Favorites panel */}
      {showFavorites && (
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          padding: '2.5rem',
          width: '100%',
          maxWidth: '600px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          <h2 style={{
            fontSize: '1.4rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            color: '#ffcc00',
          }}>
            ★ Saved Quotes
          </h2>

          {favorites.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '2rem' }}>
              No saved quotes yet
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {favorites.map(fav => (
                <div key={fav.id} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '14px',
                  padding: '1.2rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}>
                  <p style={{
                    color: 'rgba(255,255,255,0.8)',
                    fontStyle: 'italic',
                    fontSize: '0.95rem',
                    lineHeight: 1.5,
                  }}>
                    "{fav.advice}"
                  </p>
                  <button
                    onClick={() => {
                      const updated = favorites.filter(f => f.id !== fav.id);
                      setFavorites(updated);
                      localStorage.setItem('favorite-quotes', JSON.stringify(updated));
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255,100,100,0.5)',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      flexShrink: 0,
                    }}
                  >
                    ✕
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
      `}</style>
    </div>
  );
}