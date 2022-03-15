import { dispatch } from './store.js';
import { AppWindow, State } from './types';
import { html } from './util.js';

declare let window: AppWindow;

export const updateState = async () => {
  dispatch({ type: 'balance', payload: { pending: true } });
  try {
    dispatch({
      type: 'balance',
      payload: { success: await window.wallet.account().getAccountBalance() },
    });
  } catch (e) {
    if (e instanceof Error) {
      dispatch({
        type: 'balance',
        payload: { error: `Near API error: ${e.message}` },
      });
    }
  }
};

export const updateView = (state: State) => {
  html('balance').innerText =
    state.balance === undefined
      ? '?'
      : 'success' in state.balance
      ? state.balance.success.available
      : 'error' in state.balance
      ? state.balance.error
      : 'Pending...';
  if (state.balance) {
    html('balance').className = 'error' in state.balance ? 'error' : '';
  }
};

export const balance = {
  updateState,
  updateView,
};
