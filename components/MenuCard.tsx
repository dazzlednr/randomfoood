import type { ScoredMenu } from "../types/recommendation";
import { formatPrice } from "../utils/price";
import { RecommendationReason } from "./RecommendationReason";

export function MenuCard({ item, rank }: { item: ScoredMenu; rank: number }) {
  return (
    <article className={`menu-card ${rank === 1 ? "featured" : ""}`}>
      <div className="rank-badge">{rank}위</div>
      <div className="menu-topline">
        <div className="menu-emoji">{item.menu.emoji}</div>
        <div>
          <h2>{item.menu.name}</h2>
          <p>{item.menu.description}</p>
        </div>
      </div>
      <div className="menu-meta">
        <span>예상 가격 {formatPrice(item.menu.priceMin, item.menu.priceMax)}</span>
        <strong>추천도 {item.displayPercent}%</strong>
      </div>
      <div className="tag-row">
        {item.matchedTags.map((tag) => <span key={tag}>{tag}</span>)}
      </div>
      <RecommendationReason text={item.reasonText} reasons={item.reasons} />
    </article>
  );
}
