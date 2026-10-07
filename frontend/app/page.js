'use client';

import { useState, useEffect } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export default function Home() {
  const [data, setData] = useState({
    status: 'loading',
    items: [],
    message: 'Carregando dados...'
  });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/health/`, { cache: 'no-store' });
        if (!res.ok) {
          throw new Error('Resposta de erro do servidor');
        }
        const json = await res.json();
        setData({
          status: json.status || 'ok',
          items: json.items || [],
          message: null
        });
      } catch {
        setData({
          status: 'unavailable',
          items: [],
          message: 'Dados indisponíveis no momento (backend não configurado na nuvem).'
        });
      }
    }

    loadData();
  }, []);

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: 640, margin: '0 auto' }}>
      <h1>Desafio CI/CD - PSPD / AILAB Makers</h1>
      <p style={{ color: '#666' }}>Semana 6 · Do Container à Nuvem (GCP & Firebase)</p>

      <section style={{ marginTop: '1.5rem', padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fafafa' }}>
        <h2>
          Status do Backend:{' '}
          <span style={{ color: data.status === 'ok' ? 'green' : data.status === 'unavailable' ? '#d97706' : '#2563eb' }}>
            {data.status === 'ok' ? 'Online (ok)' : data.status === 'unavailable' ? 'Dados Indisponíveis' : 'Carregando...'}
          </span>
        </h2>

        {data.message && (
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fef3c7', borderRadius: '6px', color: '#92400e', fontSize: '0.95rem' }}>
            {data.message}
          </div>
        )}

        <h3 style={{ marginTop: '1.5rem' }}>Itens do Desafio:</h3>
        {data.items && data.items.length > 0 ? (
          <ul>
            {data.items.map((item, index) => (
              <li key={index} style={{ margin: '0.5rem 0' }}>{item}</li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#888', fontStyle: 'italic' }}>
            {data.status === 'loading' ? 'Buscando itens...' : 'Nenhum item disponível offline.'}
          </p>
        )}
      </section>
    </main>
  );
}