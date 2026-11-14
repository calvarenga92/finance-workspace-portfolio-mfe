import './styles.css';
import { categoryColor, portfolioAssets } from './data/portfolio';
import { riskLimits } from './data/riskRules';
import { assetFlags, riskChecks, riskLevelLabel, type RiskCheck } from './lib/risk';
import { formatPercent, pnlTone } from './lib/metrics';

const checks = riskChecks(portfolioAssets);
const alerts = checks.filter((check) => check.level === 'alert').length;
const attention = checks.filter((check) => check.level === 'attention').length;
const ok = checks.length - alerts - attention;
const scaleMax = Math.max(...portfolioAssets.map((asset) => asset.allocation), riskLimits.maxPositionPct) * 1.25;

function LimitGauge({ check }: { check: RiskCheck }) {
  if (check.limit === undefined) {
    return <p className="pf-risk-count">{check.value}</p>;
  }
  const max = Math.max(check.value, check.limit) * 1.25;
  return (
    <div className="pf-gauge">
      <div className="pf-gauge__track" aria-hidden="true">
        <i className={`pf-gauge__fill pf-gauge__fill--${check.level}`} style={{ width: `${(check.value / max) * 100}%` }} />
        <span className="pf-gauge__limit" style={{ left: `${(check.limit / max) * 100}%` }} />
      </div>
      <p className="pf-gauge__legend">
        <b>{formatPercent(check.value, { integer: true })}</b>
        <span>limite de referência {formatPercent(check.limit, { integer: true })}</span>
      </p>
    </div>
  );
}

export default function RiskMonitor() {
  return (
    <div className="pf">
      <section className="pf-risk-summary">
        <div className="pf-risk-summary__main">
          <p className="pf-eyebrow">Monitor de risco · carteira completa</p>
          <p className="pf-risk-summary__title">
            <span className="pf-big pf-big--alert">{alerts}</span>
            <span>
              {alerts === 1 ? 'regra acima do limite' : 'regras acima do limite'}
              <small>
                {attention} em atenção · {ok} dentro do limite · {checks.length} regras avaliadas
              </small>
            </span>
          </p>
        </div>
        <ul className="pf-risk-summary__limits" aria-label="Limites de referência">
          <li>
            <span>Por ativo</span>
            <b>{formatPercent(riskLimits.maxPositionPct, { integer: true })}</b>
          </li>
          <li>
            <span>Por classe</span>
            <b>{formatPercent(riskLimits.maxCategoryPct, { integer: true })}</b>
          </li>
          <li>
            <span>Em cripto</span>
            <b>{formatPercent(riskLimits.maxCryptoPct, { integer: true })}</b>
          </li>
          <li className="pf-risk-summary__note">Limites de referência deste projeto, para demonstração.</li>
        </ul>
      </section>

      <section className="pf-risk-grid" aria-label="Regras de risco">
        {checks.map((check) => (
          <article key={check.id} className={`pf-risk-card pf-risk-card--${check.level}`}>
            <header>
              <h3>{check.title}</h3>
              <span className={`pf-level pf-level--${check.level}`}>{riskLevelLabel[check.level]}</span>
            </header>
            <LimitGauge check={check} />
            <p className="pf-risk-card__detail">{check.detail}</p>
          </article>
        ))}
      </section>

      <section className="pf-table pf-risk-map">
        <h3 className="pf-section-title">Mapa de risco por ativo</h3>
        <table>
          <thead>
            <tr>
              <th scope="col">Ativo</th>
              <th scope="col">Posição × limite por ativo</th>
              <th scope="col" className="pf-right">
                Rentabilidade
              </th>
              <th scope="col">Sinalizações</th>
            </tr>
          </thead>
          <tbody>
            {portfolioAssets.map((asset) => {
              const color = categoryColor[asset.category];
              const flags = assetFlags(asset, portfolioAssets);
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
                        <small>
                          {asset.name} · {asset.category}
                        </small>
                      </span>
                    </span>
                  </td>
                  <td className="pf-cell-alloc">
                    <span className="pf-alloc-bar pf-alloc-bar--limit" aria-hidden="true">
                      <i
                        style={{
                          width: `${(asset.allocation / scaleMax) * 100}%`,
                          background: asset.allocation > riskLimits.maxPositionPct ? '#ce2c31' : color,
                        }}
                      />
                      <span style={{ left: `${(riskLimits.maxPositionPct / scaleMax) * 100}%` }} />
                    </span>
                    <b>{formatPercent(asset.allocation, { integer: true })}</b>
                  </td>
                  <td className={`pf-right pf-pnl pf-${tone}`}>{formatPercent(asset.pnl, { sign: true })}</td>
                  <td className="pf-cell-flags">
                    {flags.length > 0 ? (
                      flags.map((flag) => (
                        <span key={flag.label} className={`pf-level pf-level--${flag.level}`}>
                          {flag.label}
                        </span>
                      ))
                    ) : (
                      <span className="pf-level pf-level--ok">Sem sinalização</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
