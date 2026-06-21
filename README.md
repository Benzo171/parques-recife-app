# Parques Recife App

Aplicativo mobile desenvolvido em **React Native com Expo** que permite explorar os parques e praças do Recife, visualizá-los no mapa e fazer check-ins com a localização do usuário.

## 🚀 Tecnologias

- **React Native** — framework para desenvolvimento mobile multiplataforma
- **Expo SDK 54** — plataforma de desenvolvimento e build
- **Expo Location** — acesso à geolocalização do dispositivo
- **React Native Maps** — exibição de mapas interativos com Google Maps
- **React Navigation** — navegação entre telas com Stack Navigator
- **API Dados Abertos Recife** — fonte dos dados de parques e praças (via backend)
- **Fetch API** — chamadas HTTP para o backend

## 📋 Funcionalidades

- **Lista de parques e praças** — exibe os 483 parques e praças do Recife com nome, bairro e tipo
- **Busca por nome ou bairro** — filtra a lista em tempo real conforme o usuário digita
- **Detalhes do parque** — exibe informações completas (nome, bairro, área, tipo, endereço) e um mini mapa com a localização do parque
- **Mapa de parques próximos** — usa a geolocalização do dispositivo para exibir os parques em até 2km do usuário em um mapa interativo
- **Check-in** — registra a presença do usuário em um parque, salvando sua localização GPS no backend
- **Histórico de check-ins** — exibe todos os check-ins realizados com nome do parque, bairro, coordenadas e data/hora

## 🗂️ Estrutura do projeto

```
parques-recife-app/
├── src/
│   ├── screens/
│   │   ├── ListaScreen.js      # Tela principal com lista e busca
│   │   ├── DetalhesScreen.js   # Detalhes do parque com mini mapa
│   │   ├── MapaScreen.js       # Mapa de parques próximos
│   │   └── HistoricoScreen.js  # Histórico de check-ins
│   ├── navigation/
│   │   └── AppNavigator.js     # Configuração das rotas de navegação
│   └── services/
│       └── api.js              # Funções de comunicação com o backend
├── App.js                      # Componente raiz da aplicação
├── app.json                    # Configuração do Expo
└── package.json
```

## ⚙️ Como executar localmente

### Pré-requisitos

- Node.js v18 ou superior
- Expo CLI instalado (`npm install -g expo-cli`)
- App **Expo Go** instalado no celular (Android ou iOS)
- Backend `parques-recife-api` rodando localmente
- Git

### Instalação

```bash
git clone https://github.com/Benzo171/parques-recife-app
cd parques-recife-app
npm install
```

### Configuração

Abre o arquivo `src/services/api.js` e substitui o IP pelo IP local da sua máquina:

```js
const BACKEND_URL = 'http://SEU_IP_LOCAL:3000';
```

Para descobrir seu IP local rode `ipconfig` no Windows e copie o **Endereço IPv4**.

### Executar

```bash
npx expo start
```

Escaneie o QR code com o app **Expo Go** no celular. O celular e o PC precisam estar na mesma rede Wi-Fi.

## 📱 Telas

| Tela | Descrição |
|---|---|
| Lista | Exibe todos os parques com busca por nome/bairro |
| Detalhes | Informações completas + mini mapa da localização |
| Parques Próximos | Mapa interativo com parques em até 2km |
| Histórico | Check-ins realizados com data e coordenadas |

## 📊 Fonte dos dados

Os dados são fornecidos pelo backend `parques-recife-api`, que processa o CSV oficial do **Portal de Dados Abertos da Cidade do Recife**.
