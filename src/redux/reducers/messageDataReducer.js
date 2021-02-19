import { SET_MESSAGE_DATA, } from '../actions/actionTypes';

const defaultState = {
  messages: [],
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case SET_MESSAGE_DATA:
      return { ...state, messages: action.messages, };
    default:
      return state;
  }
}
