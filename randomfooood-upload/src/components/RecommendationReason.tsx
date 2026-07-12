import type { ScoreReason } from "../types/recommendation";

export function RecommendationReason({ text, reasons }: { text: string; reasons: ScoreReason[] }) {
  return (
    <div className="reason-box">
      <p>{text}</p>
      <div className="reason-chips">
        {reasons
          .filter((reason) => reason.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
          .map((reason) => (
            <span key={reason.label}>{reason.label} {Math.round(reason.score)}점</span>
          ))}
      </div>
    </div>
  );
}
