import type { PropsWithChildren } from 'react';

type SummaryCardProps = PropsWithChildren<{
  label: string;
  helper: string;
}>;

export function SummaryCard({ label, helper, children }: SummaryCardProps) {
  return (
    <section className="pf-kpi">
      <span className="pf-kpi__label">{label}</span>
      <strong className="pf-kpi__value">{children}</strong>
      <small className="pf-kpi__helper">{helper}</small>
    </section>
  );
}
