import { Near, WalletConnection } from 'near-api-js';
import { AccountBalance } from 'near-api-js/lib/account';

export type AppWindow = Window & {
  near: Near;
  wallet: WalletConnection;
  formatNearAmount(balance: string, fracDigits?: number): string;
  parseNearAmount(amt?: string): string | null;
};

export type Signed = 'in' | 'pending' | 'out';
export type ErrorKey = 'signIn';
export type PromiseState<T> =
  | undefined
  | { success: T }
  | { error: string }
  | { pending: true };

export type Action =
  | { type: 'error'; payload: { key: ErrorKey; message: string } }
  | { type: 'address'; payload: string }
  | { type: 'sign'; payload: Signed }
  | { type: 'balance'; payload: PromiseState<AccountBalance> }
  | { type: 'markets'; payload: PromiseState<Market[]> }
  | { type: 'selectedMarket'; payload: Market }
  | { type: 'orderBook'; payload: PromiseState<OrderBook> };

export type State = {
  address: string;
  signed: Signed;
  balance: PromiseState<AccountBalance>;
  markets: PromiseState<Market[]>;
  selectedMarket: Market | undefined;
  orderBook: PromiseState<OrderBook>;
  errors: Partial<Record<ErrorKey, string>>;
};

export type StateListener = (state: State) => void;
export type StateListenerId = string;

type Asset = {
  ticker: string;
  decimal: number;
  address: string;
};

export type Market = {
  id: number;
  base: Asset;
  quote: Asset;
  fee: number;
};

export type OrderBookItem = {
  price: number;
  quantity: number;
};
export type OrderBook = {
  ask_orders: OrderBookItem[];
  bid_orders: OrderBookItem[];
};
