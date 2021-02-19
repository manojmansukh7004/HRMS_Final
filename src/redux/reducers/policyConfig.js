import { SET_POLICY_CONFIG, } from '../actions/actionTypes';

const defaultColors = {
  policyConfig: [],
};

export default function reducer(state = defaultColors, action) {
  switch (action.type) {
    case SET_POLICY_CONFIG:
      return { ...state, policyConfig: action.policy, };
    default:
      return state;
  }
}
