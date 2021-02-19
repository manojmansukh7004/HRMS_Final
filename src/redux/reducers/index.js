import { combineReducers } from 'redux';
import themeReducer from './themeReducer';
import userReducer from './userReducer';
import policyConfig from './policyConfig';
import legendActions from './legendActions';
import messageData from './messageDataReducer';

export default combineReducers({
  theme: themeReducer,
  user: userReducer,
  policy: policyConfig,
  legendActions,
  messageData,
});
