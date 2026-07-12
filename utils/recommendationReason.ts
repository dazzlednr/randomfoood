import type { Answers, ScoredMenu, ScoreReason } from "../types/recommendation";

const priorityLabels: Record<string, string> = {
  fast: "빠른 식사",
  filling: "든든함",
  healthy: "건강함",
  easyToDigest: "속 편함",
  safeChoice: "실패 적음",
  soloFriendly: "혼밥",
  groupFriendly: "함께 먹기",
  unique: "색다름",
  deliveryFriendly: "배달",
};

export function createReasonText(reasons: ScoreReason[]) {
  const useful = reasons.filter((reason) => reason.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);
  if (useful.length === 0) return "선택한 조건과 전반적으로 무난하게 맞는 메뉴예요.";
  const first = useful[0].text;
  const rest = useful.slice(1).map((reason) => reason.text).join(" ");
  return rest ? `${first} ${rest}` : first;
}

export function matchedTagsFor(scored: Pick<ScoredMenu, "breakdown" | "menu">, answers: Answers) {
  const tags: string[] = [];
  if (scored.breakdown.hunger >= 13) tags.push("든든함");
  if (scored.breakdown.mealForm >= 14) tags.push("형태 적합");
  if (scored.breakdown.budget >= 10) tags.push("예산 적합");
  if (scored.breakdown.taste >= 7) tags.push("맛 취향");
  if (scored.breakdown.texture >= 4) tags.push("식감 취향");
  answers.priorities.filter((p) => p !== "any").slice(0, 2).forEach((p) => tags.push(priorityLabels[p]));
  if (scored.menu.soloFriendly >= 4 && !tags.includes("혼밥")) tags.push("혼밥 추천");
  if (scored.menu.deliveryFriendly >= 4 && !tags.includes("배달")) tags.push("배달 좋음");
  return [...new Set(tags)].slice(0, 3);
}
