import { orderBook } from './orderBook.js';
import { dispatch, getState } from './store.js';
import { AppWindow, Market, State } from './types.js';
import { html } from './util.js';

declare let window: AppWindow;

const updateState = async () => {
  dispatch({ type: 'markets', payload: { pending: true } });
  try {
    dispatch({
      type: 'markets',
      payload: {
        success: (await window.wallet
          .account()
          .viewFunction('app_2.spin_swap.testnet', 'markets')) as Market[],
      },
    });

    const markets = getState().markets;
    if (markets && 'success' in markets && markets.success.length > 0) {
      const selected = markets.success[0];
      dispatch({ type: 'selectedMarket', payload: selected });
      await orderBook.updateState(selected);
    }
  } catch (e) {
    if (e instanceof Error) {
      dispatch({ type: 'markets', payload: { error: e.message } });
    }
  }
};

const updateView = (state: State) => {
  if (state.markets && 'success' in state.markets) {
    const markets = state.markets.success;
    html('select-market').innerHTML = `
      <select id="select-markets">
        ${state.markets.success
          .map(
            (m, i) =>
              `<option ${
                m.id === state.selectedMarket?.id ||
                (state.selectedMarket === undefined && i === 0)
                  ? 'selected'
                  : ''
              } value="${m.id}">${m.base.ticker} / ${m.quote.ticker}</option>`
          )
          .join('')}
      </select>
      `;
    html('select-market').style.display = '';

    html('select-market').onchange = (e: Event) => {
      // @ts-ignore
      const options = e.target.options;
      const market = markets[options.selectedIndex];
      if (market) {
        dispatch({ type: 'selectedMarket', payload: market });
        orderBook.updateState(market);
      }
    };
    html('wallet-account').innerText = window.wallet.account().accountId;
  }
};

export const markets = {
  updateState,
  updateView,
};
