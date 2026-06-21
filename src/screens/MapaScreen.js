import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { getParques } from '../services/api';

export default function MapaScreen() {
  // Estado da localização atual do usuário
  const [localizacao, setLocalizacao] = useState(null);

  // Estado com todos os parques vindos do backend
  const [parques, setParques] = useState([]);

  // Estado com apenas os parques próximos ao usuário
  const [proximos, setProximos] = useState([]);

  // Estado de loading
  const [loading, setLoading] = useState(true);

  // Raio de busca em km
  const RAIO_KM = 2;

  // Calcula a distância entre dois pontos geográficos usando a fórmula de Haversine
  function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; // raio da Terra em km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  useEffect(() => {
    async function carregar() {
      // Solicita permissão de localização
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos da sua localização para mostrar o mapa.');
        setLoading(false);
        return;
      }

      // Obtém a posição atual do usuário
      const pos = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = pos.coords;
      setLocalizacao({ latitude, longitude });

      // Busca todos os parques do backend
      const dados = await getParques();

      // Filtra apenas parques que têm latitude e longitude válidas
      const comCoordenadas = dados.filter(
        p => p.latitude && p.longitude && p.latitude !== '' && p.longitude !== ''
      );

      // Filtra os parques dentro do raio definido
      const perto = comCoordenadas.filter(p => {
        const dist = calcularDistancia(
          latitude,
          longitude,
          parseFloat(p.latitude),
          parseFloat(p.longitude)
        );
        return dist <= RAIO_KM;
      });

      setParques(comCoordenadas);
      setProximos(perto);
      setLoading(false);
    }

    carregar();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={styles.loadingText}>Carregando mapa...</Text>
      </View>
    );
  }

  if (!localizacao) {
    return (
      <View style={styles.center}>
        <Text style={styles.erro}>Não foi possível obter sua localização.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Informação sobre parques próximos */}
      <View style={styles.info}>
        <Text style={styles.infoTexto}>
          📍 {proximos.length} parque(s) em até {RAIO_KM}km de você
        </Text>
      </View>

      {/* Mapa com marcadores */}
      <MapView
        style={styles.mapa}
        initialRegion={{
          latitude: localizacao.latitude,
          longitude: localizacao.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Marcador da posição do usuário */}
        <Marker
          coordinate={localizacao}
          title="Você está aqui"
          pinColor="blue"
        />

        {/* Círculo mostrando o raio de busca */}
        <Circle
          center={localizacao}
          radius={RAIO_KM * 1000}
          strokeColor="#2e7d32"
          fillColor="rgba(46, 125, 50, 0.1)"
        />

        {/* Marcadores dos parques próximos */}
        {proximos.map((p, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: parseFloat(p.latitude),
              longitude: parseFloat(p.longitude),
            }}
            title={p.nome_oficial_equip_urbano || p.nome_equip_urbano}
            description={p.nome_bairro}
            pinColor="green"
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  erro: {
    fontSize: 16,
    color: '#888',
  },
  info: {
    backgroundColor: '#2e7d32',
    padding: 10,
    alignItems: 'center',
  },
  infoTexto: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mapa: {
    flex: 1,
  },
});