import React from 'react';
import ReactDOM from 'react-dom/client';
import PortfolioApp from './PortfolioApp';
import './standalone.css';

// Página avulsa do MFE (sem o shell). O estilo daqui não é exposto ao shell.
document.body.classList.add('pf-standalone');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PortfolioApp />
  </React.StrictMode>,
);
