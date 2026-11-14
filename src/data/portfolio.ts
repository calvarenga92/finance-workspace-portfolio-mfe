export type AssetStatus = 'Ativo' | 'Observação' | 'Rebalanceando';

export type AssetCategory = 'Ações' | 'ETF' | 'FII' | 'Cripto';

export type Asset = {
  id: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  allocation: number;
  pnl: number;
  status: AssetStatus;
};

export const portfolioAssets: Asset[] = [
  { id: '1', symbol: 'ITSA4', name: 'Itaúsa', category: 'Ações', allocation: 18, pnl: 12.4, status: 'Ativo' },
  { id: '2', symbol: 'BOVA11', name: 'Ibovespa ETF', category: 'ETF', allocation: 22, pnl: 8.7, status: 'Ativo' },
  { id: '3', symbol: 'KNRI11', name: 'Kinea Renda Imobiliária', category: 'FII', allocation: 16, pnl: 6.3, status: 'Observação' },
  { id: '4', symbol: 'BTC', name: 'Bitcoin', category: 'Cripto', allocation: 10, pnl: 21.5, status: 'Rebalanceando' },
  { id: '5', symbol: 'PETR4', name: 'Petrobras', category: 'Ações', allocation: 14, pnl: -3.1, status: 'Ativo' },
  { id: '6', symbol: 'SMAL11', name: 'Small Caps ETF', category: 'ETF', allocation: 20, pnl: 5.2, status: 'Observação' },
];

export const categoryColor: Record<AssetCategory, string> = {
  ETF: '#5b5bd6',
  Ações: '#12a594',
  FII: '#ffb224',
  Cripto: '#f76b15',
};
