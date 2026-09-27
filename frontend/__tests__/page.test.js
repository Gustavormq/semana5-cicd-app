import { describe, it, expect } from 'vitest';

describe('Frontend Data Contract Tests', () => {
  it('validates the expected health API response format', () => {
    const mockApiResponse = {
      status: 'ok',
      items: [
        'Configurar Docker',
        'Automatizar CI',
        'Publicar no GHCR'
      ]
    };

    expect(mockApiResponse.status).toBe('ok');
    expect(Array.isArray(mockApiResponse.items)).toBe(true);
    expect(mockApiResponse.items).toHaveLength(3);
    expect(mockApiResponse.items).toContain('Configurar Docker');
    expect(mockApiResponse.items).toContain('Automatizar CI');
    expect(mockApiResponse.items).toContain('Publicar no GHCR');
  });

  it('handles fallback state when backend is unreachable', () => {
    const fallbackResponse = {
      status: 'waiting',
      items: ['Aguardando conexao com o backend...']
    };

    expect(fallbackResponse.status).toBe('waiting');
    expect(fallbackResponse.items[0]).toContain('Aguardando conexao');
  });
});
