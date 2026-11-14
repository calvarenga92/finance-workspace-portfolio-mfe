import './styles.css';
import { useMemo, useState } from 'react';
import { portfolioAssets, type Asset } from './data/portfolio';
import { AllocationChart } from './components/AllocationChart';
import { AssetTable } from './components/AssetTable';
import { StatusFilter } from './components/StatusFilter';
import { SummaryCard } from './components/SummaryCard';
import {
  allocationByCategory,
  averagePnl,
  bestAndWorst,
  formatPercent,
  pnlTone,
  totalAllocation,
  weightedPnl,
} from './lib/metrics';

const statusOptions = ['Todos', 'Ativo', 'Observação', 'Rebalanceando'] as const;
type StatusFilterValue = (typeof statusOptions)[number];

function matchesStatus(asset: Asset, filter: StatusFilterValue) {
  return filter === 'Todos' || asset.status === filter;
}

function countByStatus(status: StatusFilterValue) {
  return portfolioAssets.filter((asset) => matchesStatus(asset, status)).length;
}

// Indicadores da carteira completa: não mudam com os filtros.
const portfolioWeightedPnl = weightedPnl(portfolioAssets);
const portfolioAveragePnl = averagePnl(portfolioAssets);
const portfolioSlices = allocationByCategory(portfolioAssets);
const portfolioTotal = totalAllocation(portfolioAssets);
const { best, worst } = bestAndWorst(portfolioAssets);
const maxAllocation = Math.max(...portfolioAssets.map((asset) => asset.allocation));
const statusFilterOptions = statusOptions.map((value) => ({ value, count: countByStatus(value) }));

export default function PortfolioApp() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilterValue>('Todos');

  const filteredAssets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return portfolioAssets.filter((asset) => {
      const matchesQuery =
        asset.name.toLowerCase().includes(normalizedQuery) ||
        asset.symbol.toLowerCase().includes(normalizedQuery);

      return matchesQuery && matchesStatus(asset, status);
    });
  }, [query, status]);

  const filteredAverage = averagePnl(filteredAssets);
  const inAttention = filteredAssets.filter((asset) => asset.status !== 'Ativo');
  const watching = inAttention.filter((asset) => asset.status === 'Observação').length;
  const rebalancing = inAttention.length - watching;
  const hasFilters = query.trim() !== '' || status !== 'Todos';

  const clearFilters = () => {
    setQuery('');
    setStatus('Todos');
  };

  return (
    <div className="pf">
      <section className="pf-hero">
        <div className="pf-hero__main">
          <p className="pf-eyebrow">Rentabilidade ponderada · carteira completa</p>
          <p className="pf-big">{formatPercent(portfolioWeightedPnl, { sign: true })}</p>
          <p className="pf-hero__sub">
            Média simples por ativo: {formatPercent(portfolioAveragePnl, { sign: true })} · {portfolioAssets.length}{' '}
            ativos em {portfolioSlices.length} classes
          </p>
          <div className="pf-hero__pills">
            <span>
              Melhor{' '}
              <b>
                {best.symbol} {formatPercent(best.pnl, { sign: true })}
              </b>
            </span>
            <span>
              Pior{' '}
              <b className={worst.pnl < 0 ? 'pf-negative-light' : undefined}>
                {worst.symbol} {formatPercent(worst.pnl, { sign: true })}
              </b>
            </span>
          </div>
        </div>
        <AllocationChart slices={portfolioSlices} total={portfolioTotal} />
      </section>

      <section className="pf-kpis" aria-label="Indicadores da visualização">
        <SummaryCard label="Ativos monitorados" helper="Quantidade exibida após filtros">
          {filteredAssets.length}
        </SummaryCard>
        <SummaryCard label="Alocação total" helper="Posições consideradas na visualização">
          {formatPercent(totalAllocation(filteredAssets), { integer: true })}
        </SummaryCard>
        <SummaryCard label="Rentabilidade média" helper="Média simples por ativo">
          {filteredAssets.length > 0 ? (
            <span className={`pf-${pnlTone(filteredAverage)}`}>{formatPercent(filteredAverage, { sign: true })}</span>
          ) : (
            '—'
          )}
        </SummaryCard>
        <SummaryCard label="Em atenção" helper={`${watching} em observação · ${rebalancing} rebalanceando`}>
          {inAttention.length}
        </SummaryCard>
      </section>

      <section className="pf-filters">
        <label className="pf-search">
          <span className="pf-sr-only">Buscar ativo</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por código ou nome — ex.: ITSA4, Bitcoin"
          />
        </label>
        <StatusFilter options={statusFilterOptions} value={status} onChange={setStatus} />
      </section>

      <AssetTable
        assets={filteredAssets}
        maxAllocation={maxAllocation}
        emptyMessage={
          <div className="pf-empty__box">
            <b>Nenhum ativo encontrado para os filtros selecionados</b>
            <small>Tente outro código ou limpe os filtros.</small>
            {hasFilters && (
              <button type="button" className="pf-button pf-button--ghost" onClick={clearFilters}>
                Limpar filtros
              </button>
            )}
          </div>
        }
      />
    </div>
  );
}
