// Built twice: as React 19 and, via alias, as Preact (preact/compat). Same source, fair comparison.
import { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { computeQuote, createStream } from '../stream.js';

function Row({ t }) {
  return (
    <tr>
      <td>{t.t}</td><td>{t.side}</td><td>{t.amt}</td><td>{t.tokens}</td><td>{t.wallet}</td>
    </tr>
  );
}

function App() {
  const [snap, setSnap] = useState({ price: 0.0000412, people: 12, trades: [] });
  const [amount, setAmount] = useState('25');
  useEffect(() => createStream(setSnap), []);
  const quote = useMemo(() => computeQuote(amount, snap.price), [amount, snap.price]);
  return (
    <main>
      <header><h1>Rain Frog</h1><output id="price">{snap.price.toFixed(7)}</output> <output id="people">{snap.people}/25</output></header>
      <section>
        <label>Amount <input id="amount" value={amount} onChange={e => setAmount(e.target.value)} /></label>
        <dl><dt>You receive</dt><dd>{quote.out}</dd><dt>Fee</dt><dd>{quote.fee}</dd><dt>Impact</dt><dd>{quote.impact}</dd></dl>
      </section>
      <table><tbody>{snap.trades.map(t => <Row key={t.id} t={t} />)}</tbody></table>
    </main>
  );
}

createRoot(document.getElementById('app')).render(<App />);
