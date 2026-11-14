import type { Asset, AssetCategory } from '../data/portfolio';

const percentFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const integerPercentFormatter = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });

/** 12.4 → "12,4%"; com sinal: "+12,4%" / "−3,1%" (sinal de menos tipográfico). */
export function formatPercent(value: number, options: { sign?: boolean; integer?: boolean } = {}) {
  const formatter = options.integer ? integerPercentFormatter : percentFormatter;
  const body = `${formatter.format(Math.abs(value))}%`;
  if (value < 0) return `−${body}`;
  if (options.sign && value > 0) return `+${body}`;
  return body;
}

export function pnlTone(value: number) {
  if (value > 0) return 'positive';
  if (value < 0) return 'negative';
  return 'neutral';
}

export function totalAllocation(assets: Asset[]) {
  return assets.reduce((acc, asset) => acc + asset.allocation, 0);
}

export function averagePnl(assets: Asset[]) {
  return assets.length > 0 ? assets.reduce((acc, asset) => acc + asset.pnl, 0) / assets.length : 0;
}

/** Rentabilidade ponderada pela alocação de cada ativo. */
export function weightedPnl(assets: Asset[]) {
  const total = totalAllocation(assets);
  return total > 0 ? assets.reduce((acc, asset) => acc + asset.allocation * asset.pnl, 0) / total : 0;
}

/** Alocação somada por classe, da maior para a menor. */
export function allocationByCategory(assets: Asset[]) {
  const totals = new Map<AssetCategory, number>();
  for (const asset of assets) {
    totals.set(asset.category, (totals.get(asset.category) ?? 0) + asset.allocation);
  }
  return [...totals.entries()]
    .map(([category, allocation]) => ({ category, allocation }))
    .sort((a, b) => b.allocation - a.allocation);
}

export function bestAndWorst(assets: Asset[]) {
  const sorted = [...assets].sort((a, b) => b.pnl - a.pnl);
  return { best: sorted[0], worst: sorted[sorted.length - 1] };
}
