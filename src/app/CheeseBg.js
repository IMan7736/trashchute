'use client';

import { useEffect, useRef } from 'react';

export default function CheeseBg() {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  function startAnimation(canvas) {
    const ctx = canvas.getContext('2d');
    let time = 0;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);

    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array(columns).fill(0).map(() => Math.random() * -100);
    let opacities = Array(columns).fill(0).map(() => Math.random() * 0.15 + 0.03);

    const blobs = Array.from({ length: 6 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 200 + Math.random() * 300,
      hue: 220 + Math.random() * 40,
      alpha: 0.03 + Math.random() * 0.04,
    }));

    let glitchTimer = 0;
    let glitchActive = false;
    let glitchLines = [];

    function triggerGlitch() {
      glitchActive = true;
      glitchLines = Array.from({ length: Math.floor(Math.random() * 6 + 2) }, () => ({
        y: Math.random() * canvas.height,
        h: Math.random() * 4 + 1,
        offset: Math.random() * 40 - 20,
        alpha: Math.random() * 0.15 + 0.05,
        width: Math.random() * 0.6 + 0.2,
      }));
      setTimeout(() => { glitchActive = false; }, Math.random() * 150 + 50);
    }

    function draw() {
      time++;
      columns = Math.floor(canvas.width / fontSize);

      ctx.fillStyle = 'rgba(10, 14, 26, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      blobs.forEach(blob => {
        blob.x += blob.vx;
        blob.y += blob.vy;
        if (blob.x < -blob.r) blob.x = canvas.width + blob.r;
        if (blob.x > canvas.width + blob.r) blob.x = -blob.r;
        if (blob.y < -blob.r) blob.y = canvas.height + blob.r;
        if (blob.y > canvas.height + blob.r) blob.y = -blob.r;

        const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
        grad.addColorStop(0, `hsla(${blob.hue}, 60%, 40%, ${blob.alpha})`);
        grad.addColorStop(1, `hsla(${blob.hue}, 60%, 20%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < columns; i++) {
        const char = Math.random() > 0.5 ? '1' : '0';
        const alpha = opacities[i] || 0.05;
        ctx.fillStyle = `rgba(100, 120, 255, ${alpha})`;
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
          opacities[i] = Math.random() * 0.12 + 0.02;
        }
        drops[i] += 0.4;
      }

      glitchTimer++;
      if (glitchTimer > 180 && Math.random() > 0.97) {
        triggerGlitch();
        glitchTimer = 0;
      }

      if (glitchActive) {
        glitchLines.forEach(line => {
          const imageData = ctx.getImageData(0, line.y, canvas.width * line.width, line.h);
          ctx.putImageData(imageData, line.offset, line.y);
          ctx.fillStyle = `rgba(100, 120, 255, ${line.alpha})`;
          ctx.fillRect(0, line.y, canvas.width, line.h);
        });
      }

      animFrameRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    let cleanup = startAnimation(canvas);

    function handleVisibility() {
      if (document.visibilityState === 'visible') {
        cancelAnimationFrame(animFrameRef.current);
        cleanup();
        cleanup = startAnimation(canvas);
      }
    }

    function handlePageShow(e) {
      cancelAnimationFrame(animFrameRef.current);
      cleanup();
      cleanup = startAnimation(canvas);
    }

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      cleanup();
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        background: '#0a0e1a',
      }}
    />
  );
}