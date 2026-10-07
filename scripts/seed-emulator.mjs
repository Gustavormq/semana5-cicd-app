// Script para popular os dados semente no emulador do Firestore
const FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';
const PROJECT_ID = process.env.GCLOUD_PROJECT || 'projetoogus';

const items = [
  'Configurar Docker',
  'Automatizar CI',
  'Publicar no GHCR'
];

async function seed() {
  console.log(`Populando dados semente no projeto ${PROJECT_ID} via emulador (${FIRESTORE_EMULATOR_HOST})...`);
  
  for (let i = 0; i < items.length; i++) {
    const itemText = items[i];
    const url = `http://${FIRESTORE_EMULATOR_HOST}/v1/projects/${PROJECT_ID}/databases/(default)/documents/items?documentId=item-${i + 1}`;
    
    const body = {
      fields: {
        texto: { stringValue: itemText },
        ordem: { integerValue: (i + 1).toString() }
      }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer owner' // Privilégio administrativo para ignorar regras de escrita durante o seed
      },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      console.log(`[OK] Inserido: "${itemText}"`);
    } else {
      const errText = await res.text();
      console.error(`[FALHA] Falha ao inserir "${itemText}":`, errText);
    }
  }

  console.log('Seed concluído com sucesso!');
}

seed().catch(err => {
  console.error('Erro ao executar seed:', err);
  process.exit(1);
});
