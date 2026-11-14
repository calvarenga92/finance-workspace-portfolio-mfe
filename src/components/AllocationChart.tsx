import { categoryColor, type AssetCategory } from '../data/portfolio';
import { formatPercent } from '../lib/metrics';

type Slice = { category: AssetCategory; allocation: number };

type AllocationChartProps = {
  slices: Slice[];
  total: number;
};

const SIZE = 168;
const STROKE = 22;
const GAP = 3;

/** Rosca de alocação por classe (desktop) + barra empilhada (mobile). */
export function AllocationChart({ slices, total }: AllocationChartProps) {
  const radius = (SIZE - STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  const description = slices
    .map((slice) => `${slice.category} ${formatPercent(slice.allocation, { integer: true })}`)
    .join(', ');

  return (
    <section className="pf-alloc" aria-label={`Alocação por classe: ${description}`}>
      <div className="pf-donut" aria-hidden="true">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <circle cx={SIZE / 2} cy={SIZE / 2} r={radius} fill="none" stroke="#f1efe9" strokeWidth={STROKE} />
          {slices.map((slice) => {
            const length = (circumference * slice.allocation) / 100;
            const dash = Math.max(length - GAP, 0);
            const circle = (
              <circle
                key={slice.category}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={radius}
                fill="none"
                stroke={categoryColor[slice.category]}
                strokeWidth={STROKE}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
              />
            );
            offset += length;
            return circle;
          })}
        </svg>
        <div className="pf-donut__center">
          <b>{formatPercent(total, { integer: true })}</b>
          <small>alocado</small>
        </div>
      </div>

      <div className="pf-stack" aria-hidden="true">
        {slices.map((slice) => (
          <i
            key={slice.category}
            style={{ width: `${slice.allocation}%`, background: categoryColor[slice.category] }}
          />
        ))}
      </div>

      <ul className="pf-legend">
        {slices.map((slice) => (
          <li key={slice.category}>
            <i style={{ background: categoryColor[slice.category] }} aria-hidden="true" />
            <span>{slice.category}</span>
            <b>{formatPercent(slice.allocation, { integer: true })}</b>
          </li>
        ))}
      </ul>
    </section>
  );
}
