import { SET_LEGEND_ACTIONS, } from '../actions/actionTypes';

const defaultColors = {
  legendActions: [],
};

export default function reducer(state = defaultColors, action) {
  switch (action.type) {
    case SET_LEGEND_ACTIONS:
      return { ...state, legendActions: action.actions, };
    default:
      return state;
  }
}
