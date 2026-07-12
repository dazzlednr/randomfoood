export function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="progress-wrap" aria-label={`${current} / ${total}`}>
      <div className="progress-label">{current} / {total}</div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${(current / total) * 100}%` }} />
      </div>
    </div>
  );
}
