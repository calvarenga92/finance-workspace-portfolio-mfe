import type { Asset } from '../data/portfolio';
import { riskLimits } from '../data/riskRules';
import { allocationByCategory, formatPercent } from './metrics';

export type RiskLevel = 'alert' | 'attention' | 'ok';

export type RiskCheck = {
  id: string;
  title: string;
  /** Valor medido (em % quando há limite). */
  value: number;
  /** Limite de referência, quando a regra tem um. */
  limit?: number;
  level: RiskLevel;
  detail: string;
};

export const riskLevelLabel: Record<RiskLevel, string> = {
  alert: 'Acima do limite',
  attention: 'Atenção',
  ok: 'Dentro do limite',
};

function levelFor(value: number, limit: number): RiskLevel {
  if (value > limit) return 'alert';
  if (value >= limit * riskLimits.attentionRatio) return 'attention';
  return 'ok';
}

export function riskChecks(assets: Asset[]): RiskCheck[] {
  const largest = [...assets].sort((a, b) => b.allocation - a.allocation)[0];
  const largestCategory = allocationByCategory(assets)[0];
  const crypto = allocationByCategory(assets).find((slice) => slice.category === 'Cripto')?.allocation ?? 0;
  const negatives = assets.filter((asset) => asset.pnl < 0);
  const notActive = assets.filter((asset) => asset.status !== 'Ativo');

  return [
    {
      id: 'position',
      title: 'Concentração por ativo',
      value: largest.allocation,
      limit: riskLimits.maxPositionPct,
      level: levelFor(largest.allocation, riskLimits.maxPositionPct),
      detail: `Maior posição: ${largest.symbol} com ${formatPercent(largest.allocation, { integer: true })} da carteira.`,
    },
    {
      id: 'category',
      title: 'Concentração por classe',
      value: largestCategory.allocation,
      limit: riskLimits.maxCategoryPct,
      level: levelFor(largestCategory.allocation, riskLimits.maxCategoryPct),
      detail: `Maior classe: ${largestCategory.category} com ${formatPercent(largestCategory.allocation, { integer: true })}.`,
    },
    {
      id: 'crypto',
      title: 'Exposição a cripto',
      value: crypto,
      limit: riskLimits.maxCryptoPct,
      level: levelFor(crypto, riskLimits.maxCryptoPct),
      detail: `${formatPercent(crypto, { integer: true })} da carteira em cripto.`,
    },
    {
      id: 'negative',
      title: 'Rentabilidade negativa',
      value: negatives.length,
      level: negatives.length > 0 ? 'attention' : 'ok',
      detail:
        negatives.length > 0
          ? negatives.map((asset) => `${asset.symbol} ${formatPercent(asset.pnl, { sign: true })}`).join(' · ')
          : 'Nenhum ativo no negativo.',
    },
    {
      id: 'status',
      title: 'Fora do status Ativo',
      value: notActive.length,
      level: notActive.length > 0 ? 'attention' : 'ok',
      detail:
        notActive.length > 0
          ? notActive.map((asset) => `${asset.symbol} (${asset.status.toLowerCase()})`).join(' · ')
          : 'Todos os ativos com status Ativo.',
    },
  ];
}

/** Sinalizações de cada ativo, para o mapa de risco. */
export function assetFlags(asset: Asset, assets: Asset[]) {
  const flags: { label: string; level: RiskLevel }[] = [];
  const categoryTotal = assets
    .filter((other) => other.category === asset.category)
    .reduce((acc, other) => acc + other.allocation, 0);

  if (asset.allocation > riskLimits.maxPositionPct) {
    flags.push({ label: 'Posição acima do limite', level: 'alert' });
  }
  if (categoryTotal > riskLimits.maxCategoryPct) {
    flags.push({ label: `Classe ${asset.category} acima do limite`, level: 'alert' });
  }
  if (asset.pnl < 0) {
    flags.push({ label: 'Rentabilidade negativa', level: 'attention' });
  }
  if (asset.status !== 'Ativo') {
    flags.push({ label: asset.status, level: 'attention' });
  }
  return flags;
}
