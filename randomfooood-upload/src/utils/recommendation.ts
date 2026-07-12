import { menus } from "../data/menus";
import type { MealForm, Menu, TasteTag, TextureTag } from "../types/menu";
import type { Answers, Avoid, Priority, ScoredMenu, ScoreReason } from "../types/recommendation";
import { SCORE_WEIGHTS } from "./constants";
import { pickDiverseTop } from "./diversity";
import { priceScore } from "./price";
import { createReasonText, matchedTagsFor } from "./recommendationReason";

const hungerTargets: Record<Answers["hunger"], number> = {
  light: 2,
  normal: 3,
  hungry: 4,
  veryHungry: 5,
};

const relatedForms: Record<MealForm, MealForm[]> = {
  rice: ["soup", "meat", "lightMeal"],
  noodle: ["soup", "snackMeal"],
  bread: ["snackMeal", "lightMeal"],
  meat: ["rice", "soup"],
  soup: ["rice", "noodle"],
  lightMeal: ["bread", "rice", "snackMeal"],
  snackMeal: ["bread", "noodle", "lightMeal"],
};

const priorityToStat: Record<Exclude<Priority, "any">, keyof Menu> = {
  fast: "servingSpeed",
  filling: "fullness",
  healthy: "healthiness",
  easyToDigest: "digestibility",
  safeChoice: "popularity",
  soloFriendly: "soloFriendly",
  groupFriendly: "groupFriendly",
  unique: "uniqueness",
  deliveryFriendly: "deliveryFriendly",
};

export const defaultAnswers: Answers = {
  hunger: "normal",
  mealForm: "any",
  tastes: ["any"],
  textures: ["any"],
  budget: "any",
  priorities: ["any"],
  avoids: ["none"],
};

function scoreHunger(menu: Menu, answers: Answers): ScoreReason {
  const diff = Math.abs(menu.fullness - hungerTargets[answers.hunger]);
  const score = diff === 0 ? 18 : diff === 1 ? 13 : diff === 2 ? 7 : 2;
  return { label: "포만감", score, text: `원하는 배고픔 정도와 포만감이 잘 맞아요.` };
}

function scoreMealForm(menu: Menu, answers: Answers): ScoreReason {
  if (answers.mealForm === "any") return { label: "음식 형태", score: 10, text: "음식 형태를 넓게 보아도 무난하게 어울려요." };
  if (menu.mealForms.includes(answers.mealForm)) return { label: "음식 형태", score: 18, text: `지금 당기는 식사 형태와 직접 맞는 메뉴예요.` };
  const partial = relatedForms[answers.mealForm].some((form) => menu.mealForms.includes(form));
  return { label: "음식 형태", score: partial ? 7 : 0, text: partial ? "선택한 음식 형태와 어느 정도 가까운 메뉴예요." : "" };
}

function scoreTaste(menu: Menu, answers: Answers): ScoreReason {
  const selected = answers.tastes.filter((taste): taste is TasteTag => taste !== "any");
  if (selected.length === 0) return { label: "맛", score: 8, text: "맛 조건을 넓게 두어도 잘 어울려요." };
  const matches = selected.filter((tag) => menu.tasteTags.includes(tag)).length;
  let score = matches === selected.length ? 16 : matches >= Math.ceil(selected.length / 2) ? 12 : matches > 0 ? 7 : 0;
  if (selected.includes("spicy")) score += menu.spiceLevel >= 4 ? 3 : menu.spiceLevel === 3 ? 1 : -2;
  if (selected.some((tag) => tag === "mild" || tag === "clean")) score += menu.oiliness <= 2 && menu.spiceLevel <= 2 ? 2 : 0;
  if (selected.includes("rich")) score += menu.oiliness >= 4 || menu.dairyLevel >= 4 ? 2 : 0;
  score = Math.max(0, Math.min(SCORE_WEIGHTS.taste, score));
  return { label: "맛", score, text: matches > 0 ? "선택한 맛 취향과 겹치는 태그가 있어요." : "" };
}

function scoreTexture(menu: Menu, answers: Answers): ScoreReason {
  const selected = answers.textures.filter((texture): texture is TextureTag => texture !== "any");
  if (selected.length === 0) return { label: "식감", score: 4, text: "식감 조건을 넓게 보아도 부담 없어요." };
  const matches = selected.filter((tag) => menu.textureTags.includes(tag)).length;
  const score = matches === selected.length ? 8 : matches > 0 ? 5 : 0;
  return { label: "식감", score, text: matches > 0 ? "원하는 식감과 잘 맞는 요소가 있어요." : "" };
}

function scoreBudget(menu: Menu, answers: Answers): ScoreReason {
  const score = priceScore(answers.budget, menu.priceMin, menu.priceMax);
  return { label: "예산", score, text: score >= 10 ? "선택한 예산 범위와 가격대가 잘 맞아요." : "" };
}

function scorePriority(menu: Menu, answers: Answers): ScoreReason {
  const priorities = answers.priorities.filter((priority): priority is Exclude<Priority, "any"> => priority !== "any");
  if (priorities.length === 0) return { label: "중요 기준", score: 10, text: "중요 기준을 넓게 두어도 기본 적합도가 좋아요." };
  const total = priorities.reduce((sum, priority) => {
    const value = menu[priorityToStat[priority]];
    return sum + (typeof value === "number" ? (value / 5) * 12 : 0);
  }, 0);
  const score = Math.min(SCORE_WEIGHTS.priority, total);
  return { label: "중요 기준", score, text: score >= 12 ? "중요하게 고른 기준에서 높은 점수를 받았어요." : "" };
}

function avoidPenalty(menu: Menu, avoids: Avoid[]) {
  const selected = avoids.filter((avoid) => avoid !== "none");
  let penalty = 0;
  for (const avoid of selected) {
    if (avoid === "fried" && menu.preparationTags.includes("fried")) penalty -= 8;
    if (avoid === "spicy") penalty -= (menu.spiceLevel - 1) * 2.5;
    if (avoid === "flour") penalty -= (menu.flourLevel - 1) * 2;
    if (avoid === "soup") penalty -= (menu.soupLevel - 1) * 2;
    if (avoid === "raw" && menu.preparationTags.includes("raw")) penalty -= 25;
    if (avoid === "meat") penalty -= (menu.meatLevel - 1) * 2.3;
    if (avoid === "dairy") penalty -= (menu.dairyLevel - 1) * 2.2;
    if (avoid === "vegetableHeavy") penalty -= (menu.vegetableLevel - 1) * 1.8;
  }
  return Math.max(SCORE_WEIGHTS.avoidPenalty, penalty);
}

function deterministicNoise(menuId: string, salt: string) {
  let hash = 0;
  const input = `${menuId}-${salt}-${Date.now()}`;
  for (let i = 0; i < input.length; i += 1) hash = (hash * 31 + input.charCodeAt(i)) % 9973;
  return (hash / 9973) * 4.5;
}

function displayPercent(score: number) {
  return Math.round(Math.max(70, Math.min(98, 70 + score * 0.28)));
}

export function scoreMenu(menu: Menu, answers: Answers, salt = "default"): ScoredMenu {
  const reasons = [
    scoreHunger(menu, answers),
    scoreMealForm(menu, answers),
    scoreTaste(menu, answers),
    scoreTexture(menu, answers),
    scoreBudget(menu, answers),
    scorePriority(menu, answers),
  ];
  const base = (menu.popularity / 5) * SCORE_WEIGHTS.base;
  const avoid = avoidPenalty(menu, answers.avoids);
  const random = deterministicNoise(menu.id, salt);
  const rawTotal = reasons.reduce((sum, reason) => sum + reason.score, 0) + base + avoid;
  const finalTotal = Math.max(0, Math.min(100, rawTotal + random));
  const scored: ScoredMenu = {
    menu,
    score: finalTotal,
    displayPercent: displayPercent(finalTotal),
    breakdown: {
      hunger: reasons[0].score,
      mealForm: reasons[1].score,
      taste: reasons[2].score,
      texture: reasons[3].score,
      budget: reasons[4].score,
      priority: reasons[5].score,
      avoidPenalty: avoid,
      base,
      random,
      diversityAdjustment: 0,
      rawTotal,
      finalTotal,
    },
    reasons,
    reasonText: "",
    matchedTags: [],
  };
  scored.reasonText = createReasonText(reasons);
  scored.matchedTags = matchedTagsFor(scored, answers);
  return scored;
}

export function recommendMenus(answers: Answers, salt: string = crypto.randomUUID()) {
  const scored = menus.map((menu) => scoreMenu(menu, answers, salt)).sort((a, b) => b.score - a.score);
  const picked = pickDiverseTop(scored).map((item) => ({
    ...item,
    displayPercent: displayPercent(item.breakdown.finalTotal),
    matchedTags: matchedTagsFor(item, answers),
  }));
  return { results: picked, debug: scored };
}

export function randomRecommendations() {
  const shuffled = [...menus].sort(() => Math.random() - 0.5);
  const diverse = shuffled.filter((menu, index, arr) => arr.findIndex((other) => other.subCategory === menu.subCategory) === index).slice(0, 3);
  const answers = defaultAnswers;
  return diverse.map((menu) => scoreMenu(menu, answers, "random"));
}
