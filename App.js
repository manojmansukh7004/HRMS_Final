/* eslint-disable react/jsx-indent */
import React, { Component } from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AppContainer from './src/navigation';
import colors from './src/config/Colors';
import { persister, store } from './src/redux/store/index';


const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.accentBlue,
    accent: colors.accentOrange1,
  },
};

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persister} loading={null}>
          <PaperProvider theme={theme}>
            <AppContainer />
          </PaperProvider>
        </PersistGate>
      </Provider>
    );
  }
}
