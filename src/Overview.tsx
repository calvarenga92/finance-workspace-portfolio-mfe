import './styles.css';
import { portfolioAssets } from './data/portfolio';
import { AllocationChart } from './components/AllocationChart';
import { riskChecks } from './lib/risk';
import {
  allocationByCategory,
  averagePnl,
  bestAndWorst,
  formatPercent,
  totalAllocation,
  weightedPnl,
} from './lib/metrics';

export type OverviewModule = 'portfolio' | 'risk' | 'catalog';

type OverviewProps = {
  /** O shell decide como navegar; o módulo só avisa para onde. */
  onOpenModule?: (module: OverviewModule) => void;
};

const weighted = weightedPnl(portfolioAssets);
const average = averagePnl(portfolioAssets);
const slices = allocationByCategory(portfolioAssets);
const total = totalAllocation(portfolioAssets);
const { best, worst } = bestAndWorst(portfolioAssets);
const largest = [...portfolioAssets].sort((a, b) => b.allocation - a.allocation)[0];
const checks = riskChecks(portfolioAssets);
const alerts = checks.filter((check) => check.level === 'alert').length;
const attention = checks.filter((check) => check.level === 'attention').length;

export default function Overview({ onOpenModule }: OverviewProps) {
  const open = (module: OverviewModule) => () => onOpenModule?.(module);

  return (
    <div className="pf">
      <section className="pf-modules" aria-label="Módulos do portal">
        <button type="button" className="pf-module pf-module--dark" onClick={open('portfolio')}>
          <span className="pf-eyebrow">Carteira do Cliente</span>
          <span className="pf-module__value pf-module__value--lime">{formatPercent(weighted, { sign: true })}</span>
          <span className="pf-module__sub">
            Rentabilidade ponderada · {portfolioAssets.length} ativos em {slices.length} classes
          </span>
          <span className="pf-module__cta">Abrir carteira →</span>
        </button>

        <button type="button" className="pf-module" onClick={open('risk')}>
          <span className="pf-eyebrow pf-eyebrow--muted">Monitor de Risco</span>
          <span className="pf-module__value">
            {alerts}
            <small>{alerts === 1 ? ' alerta' : ' alertas'}</small>
          </span>
          <span className="pf-module__sub">
            {attention} em atenção · {checks.length} regras avaliadas
          </span>
          <span className="pf-module__cta">Ver riscos →</span>
        </button>

        <button type="button" className="pf-module pf-module--muted" onClick={open('catalog')}>
          <span className="pf-eyebrow pf-eyebrow--muted">Catálogo de Produtos</span>
          <span className="pf-module__value pf-module__value--soft">Em breve</span>
          <span className="pf-module__sub">Módulo ainda não publicado.</span>
          <span className="pf-module__cta">Saber mais →</span>
        </button>
      </section>

      <section className="pf-overview">
        <div className="pf-overview__alloc">
          <h3 className="pf-section-title">Alocação por classe</h3>
          <AllocationChart slices={slices} total={total} />
        </div>

        <div className="pf-overview__highlights">
          <h3 className="pf-section-title">Destaques da carteira</h3>
          <ul className="pf-highlights">
            <li>
              <span>Melhor rentabilidade</span>
              <b className="pf-positive">
                {best.symbol} {formatPercent(best.pnl, { sign: true })}
              </b>
            </li>
            <li>
              <span>Pior rentabilidade</span>
              <b className={worst.pnl < 0 ? 'pf-negative' : undefined}>
                {worst.symbol} {formatPercent(worst.pnl, { sign: true })}
              </b>
            </li>
            <li>
              <span>Maior posição</span>
              <b>
                {largest.symbol} {formatPercent(largest.allocation, { integer: true })}
              </b>
            </li>
            <li>
              <span>Média simples por ativo</span>
              <b>{formatPercent(average, { sign: true })}</b>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
