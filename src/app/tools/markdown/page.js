'use client';

import { useState } from 'react';

const DEFAULT = `# Welcome to Markdown Previewer

## What is Markdown?
Markdown is a lightweight markup language for formatting text.

### Basic Syntax

**Bold text** and *italic text*

> This is a blockquote

\`inline code\`

\`\`\`
// code block
function hello() {
  console.log("Hello, World!");
}
\`\`\`

- Item one
- Item two
- Item three

1. First
2. Second
3. Third

[A link](https://github.com/IMan7736)

---

Start editing on the left to see your changes here!
`;

function parseMarkdown(md) {
  return md
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    // Headings
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold and italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Blockquote
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Inline code
    .replace(/`(.+?)`/g, '<code>$1</code>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr>')
    // Unordered list
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    // Ordered list
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[a-z])(.+)$/gm, '<p>$1</p>');
}

export default function MarkdownPreviewer() {
  const [markdown, setMarkdown] = useState(DEFAULT);
  const [view, setView] = useState('split');

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem',
      position: 'relative',
      zIndex: 1,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
      }}>
        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: 600,
          background: 'linear-gradient(135deg, #ffffff 0%, #a0a8ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '0.05em',
        }}>
          Markdown Previewer
        </h1>

        {/* View toggle */}
        <div style={{
          display: 'flex',
          gap: '6px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '50px',
          padding: '4px',
        }}>
          {['editor', 'split', 'preview'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: '6px 16px',
                borderRadius: '50px',
                border: 'none',
                background: view === v ? 'rgba(100,120,255,0.3)' : 'transparent',
                color: view === v ? '#a0a8ff' : 'rgba(255,255,255,0.4)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s',
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Editor / Preview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: view === 'split' ? '1fr 1fr' : '1fr',
        gap: '16px',
        flex: 1,
        minHeight: '70vh',
      }}>
        {/* Editor */}
        {(view === 'editor' || view === 'split') && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.1em',
            }}>
              EDITOR
            </div>
            <textarea
              value={markdown}
              onChange={e => setMarkdown(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.85)',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                lineHeight: 1.7,
                padding: '1.5rem',
                resize: 'none',
                outline: 'none',
              }}
            />
          </div>
        )}

        {/* Preview */}
        {(view === 'preview' || view === 'split') && (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.1em',
            }}>
              PREVIEW
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }}
              style={{
                flex: 1,
                padding: '1.5rem',
                overflowY: 'auto',
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.7,
              }}
            />
          </div>
        )}
      </div>

      <style>{`
        .preview-content h1 { font-size: 2rem; margin-bottom: 1rem; color: #fff; }
        .preview-content h2 { font-size: 1.5rem; margin-bottom: 0.75rem; color: #fff; }
        .preview-content h3 { font-size: 1.2rem; margin-bottom: 0.5rem; color: #fff; }
        .preview-content p { margin-bottom: 1rem; }
        .preview-content code { background: rgba(100,120,255,0.15); padding: 2px 6px; border-radius: 4px; font-family: monospace; color: #a0a8ff; }
        .preview-content pre { background: rgba(0,0,0,0.4); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; overflow-x: auto; }
        .preview-content pre code { background: none; padding: 0; color: rgba(255,255,255,0.8); }
        .preview-content blockquote { border-left: 3px solid #667eea; padding-left: 1rem; color: rgba(255,255,255,0.5); margin-bottom: 1rem; }
        .preview-content ul, .preview-content ol { padding-left: 1.5rem; margin-bottom: 1rem; }
        .preview-content li { margin-bottom: 0.25rem; }
        .preview-content hr { border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 1.5rem 0; }
        .preview-content a { color: #667eea; text-decoration: none; }
        .preview-content a:hover { text-decoration: underline; }
        .preview-content strong { color: #fff; }
      `}</style>
    </div>
  );
}