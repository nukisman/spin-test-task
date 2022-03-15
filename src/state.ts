import { Action, State } from './types';

export const reduceState = (state: State, action: Action): State => {
  switch (action.type) {
    case 'address':
      return { ...state, address: action.payload };
    case 'sign':
      return { ...state, signed: action.payload };
    case 'balance':
      return { ...state, balance: action.payload };
    case 'markets':
      return { ...state, markets: action.payload };
    case 'selectedMarket':
      return { ...state, selectedMarket: action.payload };
    case 'orderBook':
      return { ...state, orderBook: action.payload };
  }
  return state;
};
