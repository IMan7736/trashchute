'use client';

import { useState } from 'react';

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [input, setValue] = useState('');

  function addTodo() {
    if (input.trim() === '') return;
    setTodos([...todos, { text: input, done: false, warping: false }]);
    setValue('');
  }

  function toggleTodo(index) {
    setTodos(todos.map((todo, i) =>
      i === index ? { ...todo, done: !todo.done } : todo
    ));
  }

  function deleteTodo(index) {
    setTodos(prev => prev.map((todo, i) =>
      i === index ? { ...todo, warping: true } : todo
    ));
    setTimeout(() => {
      setTodos(prev => prev.filter((_, i) => i !== index));
    }, 500);
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '24px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '520px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: 600,
          marginBottom: '1.5rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #ffffff 0%, #a0a8ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '0.05em',
        }}>
          ✦ To-Do
        </h1>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
          <input
            value={input}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a task..."
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.06)',
              color: '#fff',
              fontSize: '1rem',
              outline: 'none',
            }}
          />
          <button
            onClick={addTodo}
            style={{
              padding: '12px 20px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: '#fff',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Add
          </button>
        </div>

        <ul style={{
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          minHeight: '200px',
        }}>
          {todos.map((todo, index) => (
            <li
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                animation: todo.warping ? 'warp 0.5s ease-in forwards' : 'none',
              }}
            >
              <span
                onClick={() => toggleTodo(index)}
                style={{
                  color: todo.done ? 'rgba(255,255,255,0.3)' : '#fff',
                  textDecoration: todo.done ? 'line-through' : 'none',
                  cursor: 'pointer',
                  flex: 1,
                  fontSize: '1rem',
                }}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(index)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,100,100,0.6)',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  padding: '4px 8px',
                }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        @keyframes warp {
          0% { transform: scaleX(1) scaleY(1); opacity: 1; max-height: 100px; }
          30% { transform: scaleX(1.08) scaleY(0.85); opacity: 1; }
          60% { transform: scaleX(0.3) scaleY(1.4); opacity: 0.6; }
          100% { transform: scaleX(0) scaleY(0); opacity: 0; max-height: 0; padding: 0; margin: 0; }
        }
        input::placeholder { color: rgba(255,255,255,0.3); }
        input:focus { border-color: rgba(255,255,255,0.25) !important; }
        button:hover { opacity: 0.85; }
      `}</style>
    </div>
  );
}