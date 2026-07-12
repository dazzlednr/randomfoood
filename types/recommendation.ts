import type { MealForm, Menu, TasteTag, TextureTag } from "./menu";

export type Hunger = "light" | "normal" | "hungry" | "veryHungry";
export type Budget = "under6000" | "6000to9000" | "9000to13000" | "13000to20000" | "over20000" | "any";
export type Priority =
  | "fast"
  | "filling"
  | "healthy"
  | "easyToDigest"
  | "safeChoice"
  | "soloFriendly"
  | "groupFriendly"
  | "unique"
  | "deliveryFriendly"
  | "any";
export type Avoid = "fried" | "spicy" | "flour" | "soup" | "raw" | "meat" | "dairy" | "vegetableHeavy" | "none";

export type Answers = {
  hunger: Hunger;
  mealForm: MealForm | "any";
  tastes: Array<TasteTag | "any">;
  textures: Array<TextureTag | "any">;
  budget: Budget;
  priorities: Priority[];
  avoids: Avoid[];
};

export type ScoreReason = {
  label: string;
  score: number;
  text: string;
};

export type ScoreBreakdown = {
  hunger: number;
  mealForm: number;
  taste: number;
  texture: number;
  budget: number;
  priority: number;
  avoidPenalty: number;
  base: number;
  random: number;
  diversityAdjustment: number;
  rawTotal: number;
  finalTotal: number;
};

export type ScoredMenu = {
  menu: Menu;
  score: number;
  displayPercent: number;
  breakdown: ScoreBreakdown;
  reasons: ScoreReason[];
  reasonText: string;
  matchedTags: string[];
};

export type RecommendationHistory = {
  id: string;
  createdAt: string;
  answers: Answers;
  results: ScoredMenu[];
};
