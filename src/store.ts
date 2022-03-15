import { reduceState } from './state.js';
import {
  Action,
  ErrorKey,
  State,
  StateListener,
  StateListenerId,
} from './types';

const initialState: State = {
  address: '',
  signed: 'pending',
  balance: undefined,
  markets: undefined,
  selectedMarket: undefined,
  orderBook: undefined,
  errors: {},
};

const store = {
  state: initialState,
  listeners: {} as Record<string, StateListener>,
  nextListenerId: 0,
};

export function addStateListener(listener: StateListener): StateListenerId {
  const id = String(store.nextListenerId++);
  store.listeners[id] = listener;
  return id;
}

export function removeStateListener(id: StateListenerId): void {
  delete store.listeners[id];
}

export const getState = () => store.state;

export const dispatch = (action: Action) => {
  // console.log('dispatch', action.type, action.payload);
  /** Reduce state */
  store.state = reduceState(store.state, action);
  /** Fire new state */
  for (const id in store.listeners) {
    store.listeners[id](store.state);
  }
};

export const dispatchError = (key: ErrorKey, message: string) =>
  dispatch({ type: 'error', payload: { key, message } });
