import { Shuffle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MenuSearch } from "../components/MenuSearch";
import { RecentRecommendations } from "../components/RecentRecommendations";
import type { RecommendationHistory } from "../types/recommendation";
import { defaultAnswers, randomRecommendations } from "../utils/recommendation";
import { clearHistory, getHistory, saveHistory } from "../utils/storage";

export function HomePage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<RecommendationHistory[]>([]);

  useEffect(() => setHistory(getHistory()), []);

  const randomPick = () => {
    const results = randomRecommendations();
    const saved = saveHistory(defaultAnswers, results);
    if (saved) navigate(`/history/${saved.id}`);
  };

  return (
    <main className="page">
      <section className="home-hero">
        <div>
          <p className="eyebrow">지금 기분과 상황에 맞는 메뉴를 골라드려요.</p>
          <h1>오늘 뭐 먹지?</h1>
          <p>몇 가지 질문에 답하면 지금 딱 맞는 메뉴를 추천해드려요.</p>
        </div>
        <div className="hero-actions">
          <button className="primary icon-text" type="button" onClick={() => navigate("/questions")}>
            <Sparkles size={20} />메뉴 추천받기
          </button>
          <button className="secondary icon-text" type="button" onClick={randomPick}>
            <Shuffle size={20} />아무거나 추천해줘
          </button>
        </div>
      </section>
      <MenuSearch />
      <RecentRecommendations
        history={history}
        onClear={() => {
          clearHistory();
          setHistory([]);
        }}
      />
    </main>
  );
}
