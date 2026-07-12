import type { Budget } from "../types/recommendation";

export const budgetRanges: Record<Exclude<Budget, "any">, [number, number]> = {
  under6000: [0, 6000],
  "6000to9000": [6000, 9000],
  "9000to13000": [9000, 13000],
  "13000to20000": [13000, 20000],
  over20000: [20000, 50000],
};

export function formatPrice(min: number, max: number) {
  return `${min.toLocaleString("ko-KR")}~${max.toLocaleString("ko-KR")}원`;
}

export function priceScore(budget: Budget, priceMin: number, priceMax: number) {
  if (budget === "any") return 9;
  const [min, max] = budgetRanges[budget];
  const avg = (priceMin + priceMax) / 2;
  const overlap = Math.max(0, Math.min(max, priceMax) - Math.max(min, priceMin));
  if (avg >= min && avg <= max) return 15;
  if (overlap > 0) return 10;
  if (avg > max && avg - max <= 3000) return 5;
  if (avg < min && min - avg <= 3000) return 8;
  return avg > max ? -2 : 5;
}
