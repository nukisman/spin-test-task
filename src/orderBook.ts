import { dispatch } from './store.js';
import { AppWindow, Market, OrderBook, State } from './types.js';
import { html } from './util.js';

declare let window: AppWindow;

const updateState = async (market: Market) => {
  dispatch({ type: 'orderBook', payload: { pending: true } });
  try {
    dispatch({
      type: 'orderBook',
      payload: {
        success: (await window.wallet
          .account()
          .viewFunction('app_2.spin_swap.testnet', 'view_market', {
            market_id: market.id,
          })) as OrderBook,
      },
    });
  } catch (e) {
    if (e instanceof Error) {
      dispatch({ type: 'orderBook', payload: { error: e.message } });
    }
  }
};

const updateView = (state: State) => {
  if (state.selectedMarket && state.orderBook && 'success' in state.orderBook) {
    const m = state.selectedMarket;
    const book = state.orderBook.success;

    const format = (value: number) =>
      window.formatNearAmount(String(BigInt(value)), 2).replace(',', '');

    html('order-book').style.display = '';
    html('order-book').innerHTML = `
      <table id="order-book">
        <thead>
          <tr>
            <th>Price (${m.quote.ticker})</th>
            <th>Size (${m.base.ticker})</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${book.ask_orders
            .map((_, i, orders) => {
              const o = orders[orders.length - i - 1];
              return `
              <tr class="ask-order">
                <td>${parseFloat(format(o.price)).toFixed(2)}</td>
                <td>${parseFloat(format(o.quantity)).toFixed(4)}</td>
                <td>${(
                  parseFloat(format(o.price)) * parseFloat(format(o.quantity))
                ).toFixed(2)}
                </td>
              </tr>
            `;
            })
            .join('')}
          
          
          <tr  class="spread">
            <td>${(
              parseFloat(format(book.ask_orders[0].price)) -
              parseFloat(format(book.bid_orders[0].price))
            ).toFixed(2)}</td>
            <td>Spread</td>
            <td>${(
              100 *
              (1 -
                parseFloat(format(book.bid_orders[0].price)) /
                  parseFloat(format(book.ask_orders[0].price)))
            ).toFixed(2)}%</td>
          </tr>
          
          
          ${book.bid_orders
            .map(
              (o) => `
              <tr class="bid-order">
                <td>${parseFloat(format(o.price)).toFixed(2)}</td>
                <td>${parseFloat(format(o.quantity)).toFixed(4)}</td>
                <td>${(
                  parseFloat(format(o.price)) * parseFloat(format(o.quantity))
                ).toFixed(2)}
                </td>
              </tr>
            `
            )
            .join('')}
        </tbody>
      </table>
    `;
  }
};

export const orderBook = {
  updateState,
  updateView,
};
