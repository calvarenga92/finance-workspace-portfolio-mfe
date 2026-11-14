export type StatusOption<T extends string> = { value: T; count: number };

type StatusFilterProps<T extends string> = {
  options: StatusOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

/** Controle segmentado de status, com a contagem de cada opção. */
export function StatusFilter<T extends string>({ options, value, onChange }: StatusFilterProps<T>) {
  return (
    <div className="pf-seg" role="radiogroup" aria-label="Status">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          className={option.value === value ? 'is-on' : undefined}
          onClick={() => onChange(option.value)}
        >
          {option.value}
          <em>{option.count}</em>
        </button>
      ))}
    </div>
  );
}
