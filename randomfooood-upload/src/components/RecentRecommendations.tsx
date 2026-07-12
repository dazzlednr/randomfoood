import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { RecommendationHistory } from "../types/recommendation";

export function RecentRecommendations({ history, onClear }: { history: RecommendationHistory[]; onClear: () => void }) {
  return (
    <section className="recent-section">
      <div className="section-title">
        <h2>최근 추천 기록</h2>
        {history.length > 0 && <button className="ghost icon-text" type="button" onClick={onClear}><Trash2 size={16} />전체 삭제</button>}
      </div>
      {history.length === 0 ? (
        <p className="empty-text">아직 추천받은 메뉴가 없어요.</p>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <Link key={item.id} to={`/history/${item.id}`} className="history-item">
              <span>{new Date(item.createdAt).toLocaleString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
              <strong>{item.results.map((result) => result.menu.name).join(" · ")}</strong>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
