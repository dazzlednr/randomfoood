import { SelectOption } from "./SelectOption";

export type Option<T extends string> = { label: string; value: T };

export function QuestionCard<T extends string>({
  title,
  helper,
  options,
  selected,
  multiple,
  onSelect,
}: {
  title: string;
  helper?: string;
  options: Option<T>[];
  selected: T[];
  multiple?: boolean;
  onSelect: (value: T) => void;
}) {
  return (
    <section className="question-card">
      <div>
        <h2>{title}</h2>
        {helper && <p>{helper}</p>}
      </div>
      <div className={multiple ? "options-grid compact" : "options-grid"}>
        {options.map((option) => (
          <SelectOption
            key={option.value}
            label={option.label}
            selected={selected.includes(option.value)}
            onClick={() => onSelect(option.value)}
          />
        ))}
      </div>
    </section>
  );
}
