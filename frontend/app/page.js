'use client';

import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

const DATA_SOURCE = process.env.NEXT_PUBLIC_DATA_SOURCE || 'firestore';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export default function Home() {
  const [data, setData] = useState({
    status: 'loading',
    items: [],
    source: DATA_SOURCE,
    message: 'Carregando dados...'
  });
  const [writeResult, setWriteResult] = useState(null);

  useEffect(() => {
    async function loadData() {
      if (DATA_SOURCE === 'firestore') {
        try {
          const colRef = collection(db, 'items');
          const snapshot = await getDocs(colRef);
          if (snapshot.empty) {
            setData({
              status: 'ok',
              items: [],
              source: 'firestore',
              message: 'Coleção "items" está vazia no Firestore.'
            });
          } else {
            const fetchedItems = snapshot.docs.map(d => {
              const itemData = d.data();
              return itemData.texto || itemData.titulo || itemData.name || d.id;
            });
            setData({
              status: 'ok',
              items: fetchedItems,
              source: 'firestore',
              message: null
            });
          }
        } catch (err) {
          setData({
            status: 'unavailable',
            items: [],
            source: 'firestore',
            message: `Erro ao consultar Firestore: ${err.message || err.code}`
          });
        }
      } else {
        try {
          const res = await fetch(`${BACKEND_URL}/api/health/`, { cache: 'no-store' });
          if (!res.ok) throw new Error('Falha na resposta da API');
          const json = await res.json();
          setData({
            status: json.status || 'ok',
            items: json.items || [],
            source: 'api',
            message: null
          });
        } catch {
          setData({
            status: 'unavailable',
            items: [],
            source: 'api',
            message: 'Dados indisponíveis no momento (backend local não conectado).'
          });
        }
      }
    }

    loadData();
  }, []);

  async function handleTestWrite() {
    setWriteResult('Enviando tentativa de gravação...');
    try {
      await setDoc(doc(collection(db, 'items')), {
        texto: 'Item não autorizado via teste de segurança',
        data: new Date().toISOString()
      });
      setWriteResult('Sucesso: escrita aceita (inseguro)');
    } catch (err) {
      setWriteResult(`Bloqueado com sucesso: ${err.code || err.message}`);
    }
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: 640, margin: '0 auto', color: '#0f172a' }}>
      <h1 style={{ color: '#0f172a' }}>Desafio CI/CD - PSPD / AILAB Makers</h1>
      <p style={{ color: '#475569' }}>Semana 6 · Do Container à Nuvem (GCP & Firebase)</p>

      <section style={{ marginTop: '1.5rem', padding: '1.5rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#ffffff', color: '#1e293b' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: '#1e293b', fontSize: '1.25rem', margin: 0 }}>
            Status:{' '}
            <span style={{ color: data.status === 'ok' ? '#16a34a' : data.status === 'unavailable' ? '#d97706' : '#2563eb' }}>
              {data.status === 'ok' ? 'Online (ok)' : data.status === 'unavailable' ? 'Dados Indisponíveis' : 'Carregando...'}
            </span>
          </h2>
          <span style={{ fontSize: '0.85rem', background: '#e0e7ff', color: '#3730a3', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 'bold' }}>
            Fonte: {data.source.toUpperCase()}
          </span>
        </div>

        {data.message && (
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fef3c7', borderRadius: '6px', color: '#92400e', fontSize: '0.95rem' }}>
            {data.message}
          </div>
        )}

        <h3 style={{ marginTop: '1.5rem', color: '#1e293b' }}>Itens do Desafio:</h3>
        {data.items && data.items.length > 0 ? (
          <ul style={{ color: '#334155' }}>
            {data.items.map((item, index) => (
              <li key={index} style={{ margin: '0.5rem 0', fontWeight: '500' }}>{item}</li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#64748b', fontStyle: 'italic' }}>
            {data.status === 'loading' ? 'Buscando itens...' : 'Nenhum item encontrado.'}
          </p>
        )}

        <hr style={{ margin: '1.5rem 0', borderColor: '#e2e8f0' }} />

        <div>
          <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Teste de Segurança (Firestore Rules):</h4>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 0 }}>
            Testa a regra de escrita negada (write: if false).
          </p>
          <button
            onClick={handleTestWrite}
            style={{ padding: '0.5rem 1rem', background: '#0284c7', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Testar Gravação (Escrita)
          </button>
          {writeResult && (
            <p style={{ marginTop: '0.75rem', fontWeight: 'bold', color: writeResult.includes('Bloqueado') ? '#16a34a' : '#dc2626' }}>
              {writeResult}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}