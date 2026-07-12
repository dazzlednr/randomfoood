import { Check } from "lucide-react";

export function SelectOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button className={`option-button ${selected ? "selected" : ""}`} type="button" onClick={onClick}>
      <span>{label}</span>
      {selected && <Check size={18} />}
    </button>
  );
}
