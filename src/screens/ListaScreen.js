import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { getParques } from '../services/api';

export default function ListaScreen({ navigation }) {
  // Lista completa de parques vinda do backend
  const [parques, setParques] = useState([]);

  // Lista filtrada pela busca
  const [filtrados, setFiltrados] = useState([]);

  // Texto digitado na busca
  const [busca, setBusca] = useState('');

  // Loading enquanto carrega os dados
  const [loading, setLoading] = useState(true);

  // Busca os parques assim que a tela carrega
  useEffect(() => {
    async function carregar() {
      const dados = await getParques();
      setParques(dados);
      setFiltrados(dados);
      setLoading(false);
    }
    carregar();
  }, []);

  // Filtra os parques conforme o usuário digita na busca
  function handleBusca(texto) {
    setBusca(texto);
    const lower = texto.toLowerCase();
    // Filtra por nome ou bairro
    const resultado = parques.filter(p => {
      const nome = (p.nome_oficial_equip_urbano || p.nome_equip_urbano || '').toLowerCase();
      const bairro = (p.nome_bairro || '').toLowerCase();
      return nome.includes(lower) || bairro.includes(lower);
    });
    setFiltrados(resultado);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={styles.loadingText}>Buscando parques...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Parques e Praças</Text>
      <Text style={styles.subtitulo}>{filtrados.length} locais encontrados</Text>

      {/* Botão para abrir o mapa de parques próximos */}
      <TouchableOpacity
        style={styles.botaoMapa}
        onPress={() => navigation.navigate('Mapa')}
      >
        <Text style={styles.botaoMapaTexto}>🗺️ Ver parques próximos a mim</Text>
      </TouchableOpacity>

      {/* Campo de busca por nome ou bairro */}
      <TextInput
        style={styles.input}
        placeholder="🔍 Buscar por nome ou bairro..."
        value={busca}
        onChangeText={handleBusca}
        placeholderTextColor="#aaa"
      />

      {/* Lista de parques filtrados */}
      <FlatList
        data={filtrados}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Detalhes', { parque: item })}
          >
            <Text style={styles.nomeParque}>
              {item.nome_oficial_equip_urbano || item.nome_equip_urbano || 'Sem nome'}
            </Text>
            <Text style={styles.bairro}>{item.nome_bairro || 'Bairro não informado'}</Text>
            <Text style={styles.tipo}>{item.tipo_equip_urbano || ''}</Text>
          </TouchableOpacity>
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
    marginBottom: 12,
  },
  botaoMapa: {
    backgroundColor: '#2e7d32',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  botaoMapaTexto: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 12,
    elevation: 1,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    elevation: 2,
  },
  nomeParque: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  bairro: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  tipo: {
    fontSize: 11,
    color: '#2e7d32',
    marginTop: 4,
  },
});