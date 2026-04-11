'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const tools = [
  { name: 'Todo', description: 'Crack your tasks', href: '/tools/todo', size: 'large' },
  { name: 'Pomodoro', description: 'Stay focused', href: '/tools/pomodoro', size: 'small' },
  { name: 'Password Generator', description: 'Stay secure', href: '/tools/password', size: 'small' },
  { name: 'Markdown Previewer', description: 'Write and preview', href: '/tools/markdown', size: 'large' },
  { name: 'Quote Generator', description: 'Get inspired', href: '/tools/quotes', size: 'small' },
  { name: 'Quest Generator', description: 'Find something to do', href: '/tools/quest', size: 'small' },
  { name: 'Dice & Coin', description: 'Leave it to chance', href: '/tools/dice', size: 'small' },
  { name: 'UUID Generator', description: 'Unique IDs instantly', href: '/tools/uuid', size: 'small' },
  { name: 'Image Converter', description: 'Convert anything', href: '/tools/image', size: 'large' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

export default function BentoGrid() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
      width: '100%',
    }}>
      {tools.map((tool, i) => (
        <motion.div
          key={tool.name}
          custom={i}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-50px' }}
          variants={cardVariants}
          style={{
            gridColumn: tool.size === 'large' ? 'span 2' : 'span 1',
          }}
        >
          <Link href={tool.href} style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ scale: 1.02, borderColor: 'rgba(100, 120, 255, 0.4)' }}
              transition={{ duration: 0.2 }}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: tool.size === 'large' ? '2.5rem' : '2rem',
                minHeight: tool.size === 'large' ? '200px' : '160px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* SVG illustration placeholder */}
              <div style={{
                position: 'absolute',
                right: '1.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                opacity: 0.15,
                fontSize: '5rem',
              }}>
                🗑️
              </div>

              <div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  marginBottom: '0.5rem',
                }}>
                  {tool.name}
                </h3>
                <p style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.4)',
                }}>
                  {tool.description}
                </p>
              </div>

              <motion.div
                initial={{ x: -10, opacity: 0 }}
                whileHover={{ x: 0, opacity: 1 }}
                style={{
                  fontSize: '0.85rem',
                  color: 'rgba(100, 120, 255, 0.8)',
                  marginTop: '1rem',
                }}
              >
                Open →
              </motion.div>
            </motion.div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}