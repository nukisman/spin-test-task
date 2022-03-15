import { dispatch, getState } from './store.js';
import { AppWindow } from './types';

declare let window: AppWindow;

export const signIn = async () => {
  dispatch({ type: 'sign', payload: 'pending' });
  await window.wallet
    .requestSignIn(getState().address, 'Spin Test Task')
    .catch(console.error);
};

export const signOut = () => {
  window.wallet.signOut();
  dispatch({ type: 'sign', payload: 'out' });
};
