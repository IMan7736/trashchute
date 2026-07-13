'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const tools = [
  {
    name: 'Todo', description: 'Rid your tasks', href: '/tools/todo', size: 'large',
    illustration: '/illustrations/todo.jpg',
    illustrationAlt: 'Hand-colored 1829 caricature of two costumed opera performers gesturing dramatically',
  },
  {
    name: 'Pomodoro', description: 'Stay focused', href: '/tools/pomodoro', size: 'small',
    illustration: '/illustrations/pomodoro.jpg',
    illustrationAlt: 'Vintage hand-tinted photograph of a boat being rowed through a river gorge',
  },
  {
    name: 'Password Generator', description: 'Stay secure', href: '/tools/password', size: 'small',
    illustration: '/illustrations/password.jpg',
    illustrationAlt: 'Pen-and-ink illustration of armored battleships at sea',
  },
  {
    name: 'Markdown Previewer', description: 'Write and preview', href: '/tools/markdown', size: 'large',
    illustration: '/illustrations/markdown.jpg',
    illustrationAlt: 'Medieval woodcut of a comet and meteor shower over a walled town',
  },
  {
    name: 'Quote Generator', description: 'Get inspired', href: '/tools/quotes', size: 'small',
    illustration: '/illustrations/quotes.jpg',
    illustrationAlt: "Vintage engraving of a chimpanzee's face",
  },
  {
    name: 'Quest Generator', description: 'Find something to do', href: '/tools/quest', size: 'small',
    illustration: '/illustrations/quest.jpg',
    illustrationAlt: "Vintage Halloween postcard of a witch riding a watermelon-shaped car with a black cat and jack-o'-lantern",
  },
  {
    name: 'Dice & Coin', description: 'Leave it to chance', href: '/tools/dice', size: 'small',
    illustration: '/illustrations/dice.jpg',
    illustrationAlt: 'Illustration of four ornamental pigeon breeds in a garden',
  },
  {
    name: 'UUID Generator', description: 'Unique IDs instantly', href: '/tools/uuid', size: 'small',
    illustration: '/illustrations/uuid.jpg',
    illustrationAlt: 'Watercolor illustration of layered rock strata on a coastline',
  },
  {
    name: 'Image Converter', description: 'Convert anything', href: '/tools/image', size: 'large',
    illustration: '/illustrations/image.jpg',
    illustrationAlt: 'Japanese woodblock print of kites flying over rice paddies at sunset',
  },
];

export default function BentoGrid() {
  const shouldReduceMotion = useReducedMotion();

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 60 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: shouldReduceMotion ? 0 : i * 0.1,
        duration: shouldReduceMotion ? 0.01 : 0.6,
        ease: 'easeOut',
      },
    }),
  };

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
              className="bento-card"
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.02, borderColor: 'rgba(100, 120, 255, 0.4)' }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.2 }}
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
              {/* Illustration band: right half of the card, cropped to fill via object-fit
                  (source images are opaque JPEGs with no transparent margins, so cover-fit
                  inside an overflow:hidden box is the direct per-image-agnostic equivalent
                  of a manual transform-scale crop) */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: '50%',
                overflow: 'hidden',
                pointerEvents: 'none',
              }}>
                <Image
                  src={tool.illustration}
                  alt={tool.illustrationAlt}
                  fill
                  sizes="(max-width: 768px) 45vw, 320px"
                  className="bento-illustration"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                />
                {/* Scrim: protects text contrast at the seam and blends the crop into the card */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to right, rgba(10,14,26,0.95) 0%, rgba(10,14,26,0.5) 35%, rgba(10,14,26,0) 65%)',
                }} />
              </div>

              <div style={{ position: 'relative' }}>
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
                initial={{ x: shouldReduceMotion ? 0 : -10, opacity: shouldReduceMotion ? 0.6 : 0.35 }}
                whileHover={{ x: 0, opacity: 1 }}
                transition={{ duration: shouldReduceMotion ? 0.01 : 0.2 }}
                style={{
                  position: 'relative',
                  fontSize: '0.85rem',
                  color: 'rgba(100, 120, 255, 0.8)',
                  marginTop: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                Open <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </motion.div>
            </motion.div>
          </Link>
        </motion.div>
      ))}

      <style>{`
        .bento-illustration {
          opacity: 0.9;
          transition: opacity 0.2s ease-out;
        }
        .bento-card:hover .bento-illustration {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
