import { createMemo, createSignal, For, onCleanup } from 'solid-js';
import { render } from 'solid-js/web';
import { computeQuote, createStream } from '../stream.js';

function App() {
  const [snap, setSnap] = createSignal({ price: 0.0000412, people: 12, trades: [] });
  const [amount, setAmount] = createSignal('25');
  onCleanup(createStream(setSnap));
  const quote = createMemo(() => computeQuote(amount(), snap().price));
  return (
    <main>
      <header><h1>Rain Frog</h1><output id="price">{snap().price.toFixed(7)}</output> <output id="people">{snap().people}/25</output></header>
      <section>
        <label>Amount <input id="amount" value={amount()} onInput={e => setAmount(e.currentTarget.value)} /></label>
        <dl><dt>You receive</dt><dd>{quote().out}</dd><dt>Fee</dt><dd>{quote().fee}</dd><dt>Impact</dt><dd>{quote().impact}</dd></dl>
      </section>
      <table><tbody><For each={snap().trades}>{t => (<tr><td>{t.t}</td><td>{t.side}</td><td>{t.amt}</td><td>{t.tokens}</td><td>{t.wallet}</td></tr>)}</For></tbody></table>
    </main>
  );
}

render(() => <App />, document.getElementById('app'));
