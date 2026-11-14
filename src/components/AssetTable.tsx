import type { CSSProperties, ReactNode } from 'react';
import { categoryColor, type Asset, type AssetStatus } from '../data/portfolio';
import { formatPercent, pnlTone } from '../lib/metrics';

const statusClass: Record<AssetStatus, string> = {
  Ativo: 'pf-status--active',
  Observação: 'pf-status--watch',
  Rebalanceando: 'pf-status--rebalancing',
};

type AssetTableProps = {
  assets: Asset[];
  /** Maior alocação da carteira: serve de 100% para as barras. */
  maxAllocation: number;
  emptyMessage: ReactNode;
};

export function AssetTable({ assets, maxAllocation, emptyMessage }: AssetTableProps) {
  return (
    <section className="pf-table">
      <table>
        <thead>
          <tr>
            <th scope="col">Ativo</th>
            <th scope="col">Classe</th>
            <th scope="col">Alocação</th>
            <th scope="col" className="pf-right">
              Rentabilidade
            </th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {assets.length > 0 ? (
            assets.map((asset) => {
              const color = categoryColor[asset.category];
              const tone = pnlTone(asset.pnl);
              return (
                <tr key={asset.id}>
                  <td className="pf-cell-asset">
                    <span className="pf-asset">
                      <span className="pf-avatar" style={{ background: `${color}1f`, color }} aria-hidden="true">
                        {asset.symbol.slice(0, 2)}
                      </span>
                      <span>
                        <b>{asset.symbol}</b>
                        <small>{asset.name}</small>
                      </span>
                    </span>
                  </td>
                  <td className="pf-cell-category">
                    <span className="pf-category" style={{ '--c': color } as CSSProperties}>
                      {asset.category}
                    </span>
                  </td>
                  <td className="pf-cell-alloc">
                    <span className="pf-alloc-bar" aria-hidden="true">
                      <i style={{ width: `${(asset.allocation / maxAllocation) * 100}%`, background: color }} />
                    </span>
                    <b>{formatPercent(asset.allocation, { integer: true })}</b>
                  </td>
                  <td className={`pf-right pf-pnl pf-${tone}`}>
                    <span aria-hidden="true">{tone === 'positive' ? '▲' : tone === 'negative' ? '▼' : '•'}</span>{' '}
                    {formatPercent(asset.pnl, { sign: true })}
                  </td>
                  <td className="pf-cell-status">
                    <span className={`pf-status ${statusClass[asset.status]}`}>{asset.status}</span>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="pf-empty">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
