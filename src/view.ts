import { auth } from './auth.js';
import { balance } from './balance.js';
import { markets } from './markets.js';
import { orderBook } from './orderBook.js';
import { addStateListener, getState } from './store.js';
import { AppWindow, State } from './types.js';

declare let window: AppWindow;

const initView = (state: State): void => {
  auth.initView(state);
};

const updateView = (state: State): void => {
  auth.updateView(state);
  balance.updateView(state);
  markets.updateView(state);
  orderBook.updateView(state);
};

export const runView = () => {
  initView(getState());
  updateView(getState());
  addStateListener(updateView);
};
