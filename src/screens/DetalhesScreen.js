import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { salvarCheckIn } from '../services/api';

export default function DetalhesScreen({ route, navigation }) {
  // Recebe o parque selecionado vindo da tela de lista
  const { parque } = route.params;

  // Estado de loading do check-in
  const [salvando, setSalvando] = useState(false);

  // Verifica se o parque tem coordenadas válidas para exibir o mapa
  const temCoordenadas =
    parque.latitude && parque.longitude &&
    parque.latitude !== '' && parque.longitude !== '';

  // Coordenadas do parque convertidas para número
  const coordenadas = temCoordenadas
    ? {
        latitude: parseFloat(parque.latitude),
        longitude: parseFloat(parque.longitude),
      }
    : null;

  // Nome do parque para exibição
  const nomeParque = parque.nome_oficial_equip_urbano || parque.nome_equip_urbano || 'Sem nome';
  const bairroParque = parque.nome_bairro || 'Não informado';

  // Função que obtém a localização do usuário e salva o check-in no backend
  async function fazerCheckIn() {
    setSalvando(true);

    // Solicita permissão de localização
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos da sua localização para fazer o check-in.');
      setSalvando(false);
      return;
    }

    // Captura as coordenadas atuais do dispositivo via GPS
    const loc = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = loc.coords;

    // Envia o check-in para o backend — POST /check-in
    await salvarCheckIn(nomeParque, bairroParque, { latitude, longitude });

    setSalvando(false);
    Alert.alert(
      'Check-in feito! ✅',
      `Você fez check-in em ${nomeParque}`,
      [
        { text: 'Ver histórico', onPress: () => navigation.navigate('Historico') },
        { text: 'OK' },
      ]
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Card com as informações do parque */}
      <View style={styles.card}>
        <Text style={styles.titulo}>{nomeParque}</Text>

        <Text style={styles.label}>Bairro</Text>
        <Text style={styles.valor}>{bairroParque}</Text>

        <Text style={styles.label}>Área (m²)</Text>
        <Text style={styles.valor}>{parque.area || 'Não informada'}</Text>

        <Text style={styles.label}>Tipo</Text>
        <Text style={styles.valor}>{parque.tipo_equip_urbano || 'Não informado'}</Text>

        <Text style={styles.label}>Endereço</Text>
        <Text style={styles.valor}>{parque.endereco_equip_urbano || 'Não informado'}</Text>
      </View>

      {/* Mini mapa mostrando a localização do parque */}
      {temCoordenadas && (
        <View style={styles.mapaContainer}>
          <Text style={styles.mapaLabel}>📍 Localização do parque</Text>
          <MapView
            style={styles.mapa}
            initialRegion={{
              latitude: coordenadas.latitude,
              longitude: coordenadas.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            <Marker
              coordinate={coordenadas}
              title={nomeParque}
              description={bairroParque}
              pinColor="green"
            />
          </MapView>
        </View>
      )}


    </ScrollView>
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
    marginBottom: 16,
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
  mapaContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    marginBottom: 16,
  },
  mapaLabel: {
    padding: 12,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  mapa: {
    height: 200,
    width: '100%',
  },
  botao: {
    backgroundColor: '#2e7d32',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 32,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});