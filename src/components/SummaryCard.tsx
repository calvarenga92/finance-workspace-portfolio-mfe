import type { PropsWithChildren } from 'react';

type SummaryCardProps = PropsWithChildren<{
  label: string;
  helper: string;
}>;

export function SummaryCard({ label, helper, children }: SummaryCardProps) {
  return (
    <section className="summary-card">
      <span className="summary-card__label">{label}</span>
      <strong className="summary-card__value">{children}</strong>
      <small className="summary-card__helper">{helper}</small>
    </section>
  );
}
