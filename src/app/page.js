'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import BentoGrid from './components/BentoGrid';

export default function Home() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <main>
      {/* Hero Section */}
      <section style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 2rem',
      }}>
        <motion.h1
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.8, ease: 'easeOut' }}
          style={{
            fontSize: 'clamp(3rem, 10vw, 8rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #ffffff 0%, #a0a8ff 50%, #6b7fff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem',
          }}
        >
          TrashChute
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.8, delay: shouldReduceMotion ? 0 : 0.3, ease: 'easeOut' }}
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: '3rem',
            letterSpacing: '0.1em',
          }}
        >
          do whatever you'd like
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 1, delay: shouldReduceMotion ? 0 : 0.8 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '0.85rem',
            letterSpacing: '0.15em',
            cursor: 'pointer',
          }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span>SCROLL</span>
          <motion.div
            animate={shouldReduceMotion ? { y: 0 } : { y: [0, 8, 0] }}
            transition={shouldReduceMotion ? { duration: 0.01 } : { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: '1.2rem' }}
          >
            ↓
          </motion.div>
        </motion.div>
      </section>

      {/* Tools Section */}
      <section style={{
        minHeight: '100vh',
        padding: '4rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <motion.h2
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.6 }}
          style={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.2em',
            marginBottom: '3rem',
            textTransform: 'uppercase',
          }}
        >
          Tools
        </motion.h2>

        <BentoGrid />
      </section>
    </main>
  );
}
