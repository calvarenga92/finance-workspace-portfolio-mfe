import './styles.css';
import { useMemo, useState } from 'react';
import { portfolioAssets, type Asset, type AssetStatus } from './data/portfolio';
import { SummaryCard } from './components/SummaryCard';

const statusOptions = ['Todos', 'Ativo', 'Observação', 'Rebalanceando'] as const;
type StatusFilter = (typeof statusOptions)[number];

const statusChipClass: Record<AssetStatus, string> = {
  Ativo: 'status-chip--active',
  Observação: 'status-chip--watchlist',
  Rebalanceando: 'status-chip--rebalancing',
};

const percentFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function formatPercent(value: number) {
  return `${percentFormatter.format(value)}%`;
}

function getPnlClass(value: number) {
  if (value > 0) return 'positive';
  if (value < 0) return 'negative';
  return 'neutral';
}

function matchesStatus(asset: Asset, filter: StatusFilter) {
  return filter === 'Todos' || asset.status === filter;
}

export default function PortfolioApp() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('Todos');

  const filteredAssets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return portfolioAssets.filter((asset) => {
      const matchesQuery =
        asset.name.toLowerCase().includes(normalizedQuery) ||
        asset.symbol.toLowerCase().includes(normalizedQuery);

      return matchesQuery && matchesStatus(asset, status);
    });
  }, [query, status]);

  const totalAllocation = filteredAssets.reduce((acc, asset) => acc + asset.allocation, 0);
  const averagePnl =
    filteredAssets.length > 0
      ? filteredAssets.reduce((acc, asset) => acc + asset.pnl, 0) / filteredAssets.length
      : 0;

  return (
    <div className="portfolio-page">
      <header className="portfolio-page__hero">
        <div>
          <p className="eyebrow">Portfólio - Micro-Frontend</p>
          <h2>Visão consolidada da carteira</h2>
          <p className="hero-copy">
            Módulo responsável pela visualização da carteira do cliente, com foco em alocação, rentabilidade e acompanhamento de ativos.
          </p>
        </div>
        <div className="hero-badge">MFE: portfolio_mfe</div>
      </header>

      <section className="summary-grid">
        <SummaryCard label="Ativos monitorados" helper="Quantidade exibida após filtros">
          {filteredAssets.length}
        </SummaryCard>
        <SummaryCard label="Alocação total" helper="Posições consideradas na visualização">
          {formatPercent(totalAllocation)}
        </SummaryCard>
        <SummaryCard label="Rentabilidade média" helper="Indicador consolidado da carteira">
          <span className={getPnlClass(averagePnl)}>{formatPercent(averagePnl)}</span>
        </SummaryCard>
      </section>

      <section className="filters-card">
        <div className="filters-row">
          <label>
            Buscar ativo
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ex.: ITSA4 ou Bitcoin"
            />
          </label>

          <label>
            Status
            <select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)}>
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="table-card">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Ativo</th>
              <th>Categoria</th>
              <th>Alocação</th>
              <th>Rentabilidade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset) => (
                <tr key={asset.id}>
                  <td>{asset.symbol}</td>
                  <td>{asset.name}</td>
                  <td>{asset.category}</td>
                  <td>{formatPercent(asset.allocation)}</td>
                  <td className={getPnlClass(asset.pnl)}>{formatPercent(asset.pnl)}</td>
                  <td>
                    <span className={`status-chip ${statusChipClass[asset.status]}`}>
                      {asset.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="empty-state">
                  Nenhum ativo encontrado para os filtros selecionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
