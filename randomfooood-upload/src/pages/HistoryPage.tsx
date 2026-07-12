import { RotateCcw, Shuffle, SlidersHorizontal } from "lucide-react";
import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MenuCard } from "../components/MenuCard";
import { RecommendationDebug } from "../components/RecommendationDebug";
import { getHistory, saveHistory } from "../utils/storage";
import { randomRecommendations, recommendMenus } from "../utils/recommendation";

export function HistoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const history = useMemo(() => getHistory(), [id]);
  const item = history.find((entry) => entry.id === id) ?? history[0];
  const debug = item ? recommendMenus(item.answers, "debug").debug : [];

  if (!item) {
    return (
      <main className="page narrow">
        <p className="empty-text">추천 기록을 찾을 수 없어요.</p>
        <Link className="primary link-button" to="/">홈으로</Link>
      </main>
    );
  }

  const reroll = () => {
    const { results } = recommendMenus(item.answers);
    const saved = saveHistory(item.answers, results);
    if (saved) navigate(`/history/${saved.id}`);
  };

  const random = () => {
    const results = randomRecommendations();
    const saved = saveHistory(item.answers, results);
    if (saved) navigate(`/history/${saved.id}`);
  };

  return (
    <main className="page">
      <section className="result-heading">
        <p className="eyebrow">지금 선택한 조건에 잘 맞는 메뉴예요.</p>
        <h1>오늘의 추천 메뉴</h1>
      </section>
      <div className="result-grid">
        {item.results.map((result, index) => <MenuCard key={`${item.id}-${result.menu.id}`} item={result} rank={index + 1} />)}
      </div>
      <div className="result-actions">
        <Link className="secondary link-button icon-text" to="/questions"><SlidersHorizontal size={18} />다시 선택하기</Link>
        <button className="primary icon-text" type="button" onClick={reroll}><RotateCcw size={18} />같은 조건으로 다시 추천</button>
        <button className="ghost icon-text" type="button" onClick={random}><Shuffle size={18} />완전 랜덤 추천</button>
      </div>
      <RecommendationDebug items={debug} />
    </main>
  );
}
