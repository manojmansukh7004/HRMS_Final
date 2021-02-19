import { store } from '../redux/store/index';

export default {
  accentBlue: store.getState().theme.primaryColor,
  accentOrange1: store.getState().theme.secondaryColor,
  accentOrange2: store.getState().theme.secondaryColor,
  organgeBackground: store.getState().theme.secondaryColor,
  blackText: '#333333',
  bgColor:'#F9F9F9',
};
