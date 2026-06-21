import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { salvarCheckIn } from '../services/api';

export default function DetalhesScreen({ route, navigation }) {
  // Recebe o parque selecionado vindo da tela de lista via route.params
  const { parque } = route.params;

  // Estado que controla o loading enquanto o check-in é salvo
  const [salvando, setSalvando] = useState(false);

  // Função principal — pede permissão de localização, captura as coordenadas
  // e envia o check-in para o backend
  async function fazerCheckIn() {
    setSalvando(true);

    // Solicita permissão para acessar a localização do dispositivo
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos da sua localização para fazer o check-in.');
      setSalvando(false);
      return;
    }

    // Obtém as coordenadas atuais do dispositivo via GPS
    const localizacao = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = localizacao.coords;

    // Nome do parque para usar no check-in e na mensagem
    const nomeParque = parque.nome_oficial_equip_urbano || parque.nome_equip_urbano || 'Sem nome';
    const bairroParque = parque.nome_bairro || 'Não informado';

    // Envia os dados para o backend — POST /check-in
    await salvarCheckIn(nomeParque, bairroParque, { latitude, longitude });

    setSalvando(false);

    // Exibe confirmação e oferece opção de ir para o histórico
    Alert.alert(
      'Check-in feito!',
      `Você fez check-in em ${nomeParque}`,
      [
        { text: 'Ver histórico', onPress: () => navigation.navigate('Historico') },
        { text: 'OK' },
      ]
    );
  }

  return (
    <View style={styles.container}>
      {/* Card com as informações do parque vindas do backend/CSV */}
      <View style={styles.card}>
        {/* Nome oficial do parque ou nome popular caso não tenha oficial */}
        <Text style={styles.titulo}>
          {parque.nome_oficial_equip_urbano || parque.nome_equip_urbano || 'Sem nome'}
        </Text>

        <Text style={styles.label}>Bairro</Text>
        <Text style={styles.valor}>{parque.nome_bairro || 'Não informado'}</Text>

        <Text style={styles.label}>Área (m²)</Text>
        <Text style={styles.valor}>{parque.area || 'Não informada'}</Text>

        <Text style={styles.label}>Tipo</Text>
        <Text style={styles.valor}>{parque.tipo_equip_urbano || 'Não informado'}</Text>

        <Text style={styles.label}>Endereço</Text>
        <Text style={styles.valor}>{parque.endereco_equip_urbano || 'Não informado'}</Text>
      </View>

      {/* Botão que dispara o check-in com localização do usuário */}
      <TouchableOpacity
        style={styles.botao}
        onPress={fazerCheckIn}
        disabled={salvando}
      >
        {salvando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.botaoTexto}>📍 Fazer Check-in aqui</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    marginBottom: 24,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: '#888',
    marginTop: 12,
    textTransform: 'uppercase',
  },
  valor: {
    fontSize: 15,
    color: '#333',
    marginTop: 2,
  },
  botao: {
    backgroundColor: '#2e7d32',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});