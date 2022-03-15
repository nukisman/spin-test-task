import { signIn, signOut } from './auth.js';
import { balance } from './balance.js';
import { markets } from './markets.js';
import { orderBook } from './orderBook.js';
import { addStateListener, dispatch, getState } from './store.js';
import { AppWindow, State } from './types.js';
import { display, html } from './util.js';

declare let window: AppWindow;

const initView = (state: State): void => {
  html('sign-in').onclick = signIn;
  html('sign-out').onclick = signOut;

  const inputAddress = html('wallet-address');
  inputAddress.oninput = (e: Event) => {
    // @ts-ignore
    console.log(e.target.value);
    // @ts-ignore
    dispatch({ type: 'address', payload: e.target.value });
  };
};

const updateView = (state: State): void => {
  display('signed-in', state.signed === 'in');
  display('signed-out', state.signed === 'out');
  display('signed-pending', state.signed === 'pending');

  const postfix = '.testnet';
  (html('sign-in') as HTMLButtonElement).disabled = !(
    state.address.length > postfix.length && state.address.endsWith(postfix)
  );

  balance.updateView(state);
  markets.updateView(state);
  orderBook.updateView(state);
};

export const runView = () => {
  initView(getState());
  updateView(getState());
  addStateListener(updateView);
};
