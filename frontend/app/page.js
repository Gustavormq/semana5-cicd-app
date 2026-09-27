async function getHealth() {
  const res = await fetch('http://localhost:8000/api/health/', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Falha ao buscar /api/health/');
  }
  return res.json();
}

export default async function Home() {
  const data = await getHealth();

  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Status: {data.status}</h1>
      <ul>
        {data.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </main>
  );
}
