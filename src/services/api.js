// URL do nosso backend local
const BACKEND_URL = 'http://192.168.0.10:3000';

// Busca os parques do nosso backend, que faz o proxy do CSV do Dados Recife
export async function getParques() {
  try {
    const response = await fetch(`${BACKEND_URL}/check-in/parques`);
    const json = await response.json();
    console.log('Primeiro parque:', JSON.stringify(json.dados[0]));
    return json.dados || [];
  } catch (error) {
    console.error('Erro ao buscar parques:', error);
    return [];
  }
}

// Salva um check-in no nosso backend (POST /check-in)
export async function salvarCheckIn(parque, bairro, localizacao) {
  try {
    const response = await fetch(`${BACKEND_URL}/check-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parque, bairro, localizacao }),
    });
    return await response.json();
  } catch (error) {
    console.error('Erro ao salvar check-in:', error);
  }
}

// Busca o histórico de check-ins do nosso backend (GET /check-in/historico)
export async function getHistorico() {
  try {
    const response = await fetch(`${BACKEND_URL}/check-in/historico`);
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    return { dados: [] };
  }
}