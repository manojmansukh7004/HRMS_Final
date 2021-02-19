import { SET_POLICY_CONFIG } from './actionTypes';

export const setPolicyConfig = policy => ({
  type: SET_POLICY_CONFIG,
  policy,
});
