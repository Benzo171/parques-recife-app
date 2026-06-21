import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ListaScreen from '../screens/ListaScreen';
import DetalhesScreen from '../screens/DetalhesScreen';
import HistoricoScreen from '../screens/HistoricoScreen';
import MapaScreen from '../screens/MapaScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Lista"
        screenOptions={{
          headerStyle: { backgroundColor: '#2e7d32' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="Lista"
          component={ListaScreen}
          options={{ title: 'Parques do Recife' }}
        />
        <Stack.Screen
          name="Detalhes"
          component={DetalhesScreen}
          options={{ title: 'Detalhes do Parque' }}
        />
        <Stack.Screen
          name="Historico"
          component={HistoricoScreen}
          options={{ title: 'Meus Check-ins' }}
        />
        <Stack.Screen
          name="Mapa"
          component={MapaScreen}
          options={{ title: 'Parques Próximos' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}