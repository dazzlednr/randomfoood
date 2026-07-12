import type { ScoredMenu } from "../types/recommendation";

export function pickDiverseTop(scoredMenus: ScoredMenu[]) {
  const candidates = scoredMenus.slice(0, Math.max(15, Math.min(25, scoredMenus.length)));
  const selected: ScoredMenu[] = [];

  for (const candidate of candidates) {
    if (selected.length === 0) {
      selected.push(candidate);
      continue;
    }

    const bestRemainingRaw = candidates.find((item) => !selected.some((picked) => picked.menu.id === item.menu.id));
    if (!bestRemainingRaw) break;
    const adjusted = candidates
      .filter((item) => !selected.some((picked) => picked.menu.id === item.menu.id))
      .map((item) => {
        let diversityAdjustment = 0;
        for (const picked of selected) {
          if (picked.menu.subCategory === item.menu.subCategory) diversityAdjustment -= 5;
          if (picked.menu.mainCategory === item.menu.mainCategory) diversityAdjustment -= 2;
        }
        return {
          ...item,
          score: Math.max(0, item.score + diversityAdjustment),
          breakdown: { ...item.breakdown, diversityAdjustment, finalTotal: Math.max(0, item.score + diversityAdjustment) },
        };
      })
      .sort((a, b) => b.score - a.score);

    const bestAdjusted = adjusted[0];
    if (!bestAdjusted) break;

    const rawGap = bestRemainingRaw.score - bestAdjusted.score;
    selected.push(rawGap >= 4 ? bestRemainingRaw : bestAdjusted);
    if (selected.length === 3) break;
  }

  const [first, ...rest] = selected.slice(0, 3);
  return first ? [first, ...rest.sort((a, b) => b.score - a.score)] : [];
}
