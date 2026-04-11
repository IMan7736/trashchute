import Link from 'next/link';

export default function ToolLayout({ children }) {
  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem',
      maxWidth: '900px',
      margin: '0 auto',
    }}>
      <Link href="/" style={{
        color: 'rgba(255,255,255,0.4)',
        textDecoration: 'none',
        fontSize: '0.9rem',
        letterSpacing: '0.1em',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '2rem',
        transition: 'color 0.2s',
      }}>
        ← Back to TrashChute
      </Link>
      {children}
    </div>
  );
}