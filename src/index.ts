import * as nearApi from 'near-api-js';
import { balance } from './balance.js';
import { config } from './config.js';
import { markets } from './markets.js';
import { dispatch } from './store.js';
import { AppWindow } from './types';
import { runView } from './view.js';

declare let window: AppWindow & { nearApi: typeof nearApi };

window.onload = async () => {
  const nearApi = window.nearApi;
  const { connect, keyStores, WalletConnection, utils } = nearApi;

  const near = await connect(config(keyStores));
  const wallet = new WalletConnection(near, null);

  window.near = near;
  window.wallet = wallet;
  window.parseNearAmount = utils.format.parseNearAmount;
  window.formatNearAmount = utils.format.formatNearAmount;

  runView();

  if (wallet.isSignedIn()) {
    await balance.updateState();
    await markets.updateState();
  }

  dispatch({ type: 'sign', payload: wallet.isSignedIn() ? 'in' : 'out' });
};
