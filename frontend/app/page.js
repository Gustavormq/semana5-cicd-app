const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:8000';

async function getHealth() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/health/`, { cache: 'no-store' });
    if (!res.ok) {
      return { status: 'error', items: ['Falha na resposta da API'] };
    }
    return await res.json();
  } catch {
    return {
      status: 'waiting',
      items: ['Aguardando conexao com o backend...']
    };
  }
}

export default async function Home() {
  const data = await getHealth();

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1>Desafio CI/CD - PSPD / AILAB Makers</h1>
      <section style={{ marginTop: '1.5rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Status do Backend: <span style={{ color: data.status === 'ok' ? 'green' : 'orange' }}>{data.status}</span></h2>
        <h3>Itens do Desafio:</h3>
        <ul>
          {data.items && data.items.map((item, index) => (
            <li key={index} style={{ margin: '0.5rem 0' }}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}