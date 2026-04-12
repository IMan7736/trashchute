'use client';

import { useState, useRef } from 'react';

const FORMATS = ['PNG', 'JPEG', 'WEBP', 'BMP', 'ICO'];

export default function ImageConverter() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [outputFormat, setOutputFormat] = useState('PNG');
  const [quality, setQuality] = useState(90);
  const [converting, setConverting] = useState(false);
  const [originalSize, setOriginalSize] = useState(null);
  const [convertedSize, setConvertedSize] = useState(null);
  const [originalFormat, setOriginalFormat] = useState(null);
  const [scale, setScale] = useState(100);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setOriginalSize((file.size / 1024).toFixed(1));
    setOriginalFormat(file.name.split('.').pop().toUpperCase());
    setConvertedSize(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(ev.target.result);
      setPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFile({ target: { files: [file] } });
    }
  }

  function convert() {
    if (!image) return;
    setConverting(true);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;

      if (outputFormat === 'ICO') {
        import('ico-endec').then(async ({ encode }) => {
          const sizes = [16, 32, 48, 256];

          const buffers = await Promise.all(sizes.map(size => {
            return new Promise(resolve => {
              const c = document.createElement('canvas');
              c.width = size;
              c.height = size;
              const cx = c.getContext('2d');

              // Crop to center square
              const srcSize = Math.min(img.width, img.height);
              const srcX = (img.width - srcSize) / 2;
              const srcY = (img.height - srcSize) / 2;

              cx.drawImage(img, srcX, srcY, srcSize, srcSize, 0, 0, size, size);

              c.toBlob(blob => {
                blob.arrayBuffer().then(resolve);
              }, 'image/png');
            });
          }));

          const icoBuffer = encode(buffers);
          const blob = new Blob([icoBuffer], { type: 'image/x-icon' });
          setConvertedSize((blob.size / 1024).toFixed(1));
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'converted.ico';
          a.click();
          URL.revokeObjectURL(url);
          setConverting(false);
        });
        return;
      }

      if (outputFormat === 'JPEG') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const mimeType = outputFormat === 'JPEG' ? 'image/jpeg'
        : outputFormat === 'WEBP' ? 'image/webp'
        : outputFormat === 'BMP' ? 'image/bmp'
        : outputFormat === 'ICO' ? 'image/x-icon'
        : 'image/png';

      const qualityValue = outputFormat === 'PNG' || outputFormat === 'BMP'
        ? undefined
        : quality / 100;

      canvas.toBlob(blob => {
        setConvertedSize((blob.size / 1024).toFixed(1));
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `converted.${outputFormat.toLowerCase() === 'ico' ? 'ico' : outputFormat.toLowerCase()}`;
        a.click();
        URL.revokeObjectURL(url);
        setConverting(false);
      }, mimeType, qualityValue);
    };
    img.src = image;
  }

  const sizeChange = originalSize && convertedSize
    ? (((convertedSize - originalSize) / originalSize) * 100).toFixed(1)
    : null;

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
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '24px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '580px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}>
        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: 600,
          background: 'linear-gradient(135deg, #ffffff 0%, #a0a8ff 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '0.05em',
          textAlign: 'center',
        }}>
          Image Converter
        </h1>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => fileInputRef.current.click()}
          style={{
            border: '2px dashed rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '2rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: image ? 'rgba(100,120,255,0.05)' : 'transparent',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            style={{ display: 'none' }}
          />

          {preview ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <img
                src={preview}
                alt="preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  borderRadius: '10px',
                  objectFit: 'contain',
                }}
              />
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {originalFormat && (
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '50px',
                    background: 'rgba(100,120,255,0.1)',
                    border: '1px solid rgba(100,120,255,0.2)',
                    color: '#a0a8ff',
                    fontSize: '0.75rem',
                  }}>
                    {originalFormat}
                  </span>
                )}
                {originalSize && (
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '50px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '0.75rem',
                  }}>
                    {originalSize} KB
                  </span>
                )}
              </div>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
                Click to change image
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ fontSize: '2.5rem' }}>🖼</div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}>
                Drop an image here or click to upload
              </p>
              <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>
                PNG, JPEG, WEBP, BMP, GIF supported
              </p>
            </div>
          )}
        </div>

        {/* Output format */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
            CONVERT TO
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {FORMATS.map(f => (
              <button
                key={f}
                onClick={() => setOutputFormat(f)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '12px',
                  border: `1px solid ${outputFormat === f ? 'rgba(100,120,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  background: outputFormat === f ? 'rgba(100,120,255,0.1)' : 'rgba(255,255,255,0.03)',
                  color: outputFormat === f ? '#a0a8ff' : 'rgba(255,255,255,0.4)',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontWeight: outputFormat === f ? 500 : 400,
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Quality slider — only for JPEG and WEBP */}
        {(outputFormat === 'JPEG' || outputFormat === 'WEBP') && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                QUALITY
              </span>
              <span style={{ color: '#fff', fontSize: '0.85rem' }}>{quality}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={quality}
              onChange={e => setQuality(+e.target.value)}
              style={{ width: '100%', accentColor: '#667eea' }}
            />
          </div>
        )}

        {/* Scale slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
              SCALE
            </span>
            <span style={{ color: '#fff', fontSize: '0.85rem' }}>{scale}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="200"
            value={scale}
            onChange={e => setScale(+e.target.value)}
            style={{ width: '100%', accentColor: '#667eea' }}
          />
        </div>

        {/* Size comparison */}
        {convertedSize && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            padding: '1rem',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '12px',
            flexWrap: 'wrap',
          }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
              Original: {originalSize} KB
            </span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>→</span>
            <span style={{ color: '#a0a8ff', fontSize: '0.85rem' }}>
              Converted: {convertedSize} KB
            </span>
            {sizeChange && (
              <span style={{
                color: sizeChange < 0 ? '#00ff88' : '#ff8800',
                fontSize: '0.85rem',
              }}>
                ({sizeChange > 0 ? '+' : ''}{sizeChange}%)
              </span>
            )}
          </div>
        )}

        {/* Convert button */}
        <button
          onClick={convert}
          disabled={!image || converting}
          style={{
            padding: '14px',
            borderRadius: '14px',
            border: 'none',
            background: !image
              ? 'rgba(255,255,255,0.05)'
              : 'linear-gradient(135deg, #667eea, #764ba2)',
            color: !image ? 'rgba(255,255,255,0.2)' : '#fff',
            fontSize: '1rem',
            fontWeight: 500,
            cursor: !image ? 'not-allowed' : 'pointer',
            letterSpacing: '0.1em',
            transition: 'all 0.2s',
          }}
        >
          {converting ? 'Converting...' : `Convert to ${outputFormat}`}
        </button>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}