'use client';

export default function ForestBg({ customBg }) {
  return (
    <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    backgroundImage: `url(${customBg || '/pomodoro-bg.jpg'})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'brightness(0.4)',
  }} />
  );
}