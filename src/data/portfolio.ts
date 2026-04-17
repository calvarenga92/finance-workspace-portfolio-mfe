export type AssetStatus = 'Ativo' | 'Observação' | 'Rebalanceando';

export type Asset = {
  id: string;
  symbol: string;
  name: string;
  category: 'Equity' | 'ETF' | 'FII' | 'Crypto';
  allocation: number;
  pnl: number;
  status: AssetStatus;
};

export const portfolioAssets: Asset[] = [
  { id: '1', symbol: 'ITSA4', name: 'Itaúsa', category: 'Equity', allocation: 18, pnl: 12.4, status: 'Ativo' },
  { id: '2', symbol: 'BOVA11', name: 'Ibovespa ETF', category: 'ETF', allocation: 22, pnl: 8.7, status: 'Ativo' },
  { id: '3', symbol: 'KNRI11', name: 'Kinea Renda Imobiliária', category: 'FII', allocation: 16, pnl: 6.3, status: 'Observação' },
  { id: '4', symbol: 'BTC', name: 'Bitcoin', category: 'Crypto', allocation: 10, pnl: 21.5, status: 'Rebalanceando' },
  { id: '5', symbol: 'PETR4', name: 'Petrobras', category: 'Equity', allocation: 14, pnl: -3.1, status: 'Ativo' },
  { id: '6', symbol: 'SMAL11', name: 'Small Caps ETF', category: 'ETF', allocation: 20, pnl: 5.2, status: 'Observação' },
];
