import { dispatch, getState } from './store.js';
import { AppWindow, State } from './types';
import { display, html } from './util.js';

declare let window: AppWindow;

export const signIn = async () => {
  dispatch({ type: 'sign', payload: 'pending' });
  await window.wallet
    .requestSignIn(getState().address, 'Spin Test Task')
    .catch(console.error);
};

const signOut = () => {
  window.wallet.signOut();
  dispatch({ type: 'sign', payload: 'out' });
};

const initView = (state: State): void => {
  html('sign-in').onclick = signIn;
  html('sign-out').onclick = signOut;

  const inputAddress = html('wallet-address');
  inputAddress.oninput = (e: Event) => {
    // @ts-ignore
    dispatch({ type: 'address', payload: e.target.value });
  };
};

const updateView = (state: State) => {
  display('signed-in', state.signed === 'in');
  display('signed-out', state.signed === 'out');
  display('signed-pending', state.signed === 'pending');

  const postfix = '.testnet';
  (html('sign-in') as HTMLButtonElement).disabled = !(
    state.address.length > postfix.length && state.address.endsWith(postfix)
  );
};

export const auth = {
  initView,
  updateView,
};
