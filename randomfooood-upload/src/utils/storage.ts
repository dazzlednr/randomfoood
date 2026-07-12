import type { Answers, RecommendationHistory, ScoredMenu } from "../types/recommendation";

const KEY = "today-menu-recommendation-history";

function parseHistory(value: string | null): RecommendationHistory[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getHistory() {
  return parseHistory(localStorage.getItem(KEY));
}

export function saveHistory(answers: Answers, results: ScoredMenu[]) {
  try {
    const next: RecommendationHistory = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      answers,
      results,
    };
    localStorage.setItem(KEY, JSON.stringify([next, ...getHistory()].slice(0, 5)));
    return next;
  } catch {
    return null;
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // localStorage can be unavailable in private browsing contexts.
  }
}
