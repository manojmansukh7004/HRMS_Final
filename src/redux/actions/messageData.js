import { SET_MESSAGE_DATA } from './actionTypes';

export const setMessageData = messages => ({
  type: SET_MESSAGE_DATA,
  messages,
});
