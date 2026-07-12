import type { ScoredMenu } from "../types/recommendation";
import { DEBUG_ENABLED } from "../utils/env";

export function RecommendationDebug({ items }: { items: ScoredMenu[] }) {
  if (!DEBUG_ENABLED) return null;
  return (
    <details className="debug-panel">
      <summary>추천 점수 디버그</summary>
      <div className="debug-table-wrap">
        <table>
          <thead>
            <tr>
              <th>메뉴</th><th>원점수</th><th>배고픔</th><th>형태</th><th>맛</th><th>식감</th><th>예산</th><th>기준</th><th>감점</th><th>다양성</th><th>최종</th>
            </tr>
          </thead>
          <tbody>
            {items.slice(0, 30).map((item) => (
              <tr key={item.menu.id}>
                <td>{item.menu.name}</td>
                <td>{item.breakdown.rawTotal.toFixed(1)}</td>
                <td>{item.breakdown.hunger.toFixed(1)}</td>
                <td>{item.breakdown.mealForm.toFixed(1)}</td>
                <td>{item.breakdown.taste.toFixed(1)}</td>
                <td>{item.breakdown.texture.toFixed(1)}</td>
                <td>{item.breakdown.budget.toFixed(1)}</td>
                <td>{item.breakdown.priority.toFixed(1)}</td>
                <td>{item.breakdown.avoidPenalty.toFixed(1)}</td>
                <td>{item.breakdown.diversityAdjustment.toFixed(1)}</td>
                <td>{item.breakdown.finalTotal.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
