import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function About() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <Link href="/" style={{
        position: 'fixed',
        top: '2rem',
        left: '2rem',
        color: 'rgba(255,255,255,0.4)',
        textDecoration: 'none',
        fontSize: '0.9rem',
        letterSpacing: '0.1em',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'color 0.2s',
      }}>
        <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" /> Back to TrashChute
      </Link>

      <div style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '24px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '520px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: 600,
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #a0a8ff 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '0.05em',
        }}>
          About
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.6)',
          fontSize: '1rem',
        }}>
          This is the about page.
        </p>
      </div>
    </div>
  );
}
