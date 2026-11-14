/**
 * Limites de referência do Monitor de Risco.
 * São parâmetros de demonstração deste projeto, não regra de nenhuma instituição.
 */
export const riskLimits = {
  /** Maior fatia aceitável em um único ativo, em % da carteira. */
  maxPositionPct: 20,
  /** Maior fatia aceitável em uma única classe, em % da carteira. */
  maxCategoryPct: 40,
  /** Exposição máxima em cripto, em % da carteira. */
  maxCryptoPct: 10,
  /** A partir de quanto do limite o indicador passa a "atenção" (0,9 = 90%). */
  attentionRatio: 0.9,
};
