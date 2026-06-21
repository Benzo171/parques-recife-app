import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { getHistorico } from '../services/api';

export default function HistoricoScreen() {
  // Estado que armazena a lista de check-ins retornada pelo backend
  const [checkins, setCheckins] = useState([]);

  // Estado que controla o indicador de carregamento
  const [loading, setLoading] = useState(true);

  // useEffect executa assim que o componente é montado (tela abre)
  // Faz a chamada GET /check-in/historico no nosso backend
  useEffect(() => {
    async function carregar() {
      // Chama a função do api.js que faz o GET no backend
      const resultado = await getHistorico();

      // resultado.dados é o array de check-ins retornado pelo backend
      // Se vier undefined, usa array vazio pra não quebrar o app
      setCheckins(resultado.dados || []);
      setLoading(false);
    }
    carregar();
  }, []); // array vazio = executa só uma vez, quando a tela abre

  // Enquanto os dados estão carregando, exibe um spinner
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={styles.loadingText}>Carregando histórico...</Text>
      </View>
    );
  }

  // Se não houver check-ins cadastrados ainda, exibe mensagem amigável
  if (checkins.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.vazio}>Nenhum check-in realizado ainda.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Histórico de Check-ins</Text>

      {/* Mostra o total de check-ins realizados */}
      <Text style={styles.subtitulo}>{checkins.length} check-in(s) realizado(s)</Text>

      {/* FlatList renderiza cada check-in como um card */}
      {/* keyExtractor usa o _id do MongoDB como chave única */}
      <FlatList
        data={checkins}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Nome do parque onde o check-in foi feito */}
            <Text style={styles.nomeParque}>{item.parque}</Text>

            {/* Bairro do parque */}
            <Text style={styles.bairro}>{item.bairro}</Text>

            {/* Coordenadas geográficas capturadas pelo expo-location */}
            {/* toFixed(4) limita a 4 casas decimais para ficar legível */}
            <Text style={styles.coords}>
              📍 Lat: {item.localizacao.latitude.toFixed(4)} | Lon: {item.localizacao.longitude.toFixed(4)}
            </Text>

            {/* Data e hora do check-in formatada para o padrão brasileiro */}
            {/* criadoEm é preenchido automaticamente pelo MongoDB */}
            <Text style={styles.data}>
              {new Date(item.criadoEm).toLocaleString('pt-BR')}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  // Estilo centralizado usado nas telas de loading e lista vazia
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  vazio: {
    fontSize: 16,
    color: '#888',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 4,
    marginTop: 8,
  },
  subtitulo: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  // Card de cada check-in na lista
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    elevation: 2, // sombra no Android
  },
  nomeParque: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  bairro: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  coords: {
    fontSize: 12,
    color: '#2e7d32',
    marginTop: 8,
  },
  data: {
    fontSize: 11,
    color: '#bbb',
    marginTop: 4,
  },
});