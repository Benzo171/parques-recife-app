import { AppRegistry } from 'react-native';
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';

// Componente raiz do app
function App() {
  return <AppNavigator />;
}

// Registra o componente principal — necessário para o Expo Go carregar o app
AppRegistry.registerComponent('main', () => App);

export default App;