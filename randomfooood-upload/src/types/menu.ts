export type MainCategory =
  | "korean"
  | "japanese"
  | "chinese"
  | "western"
  | "snack"
  | "fastFood"
  | "asian"
  | "healthy"
  | "meat"
  | "cafe";

export type MealForm = "rice" | "noodle" | "bread" | "meat" | "soup" | "lightMeal" | "snackMeal";
export type TasteTag = "spicy" | "mild" | "salty" | "sweet" | "sour" | "savory" | "rich" | "strong" | "clean";
export type TextureTag = "crispy" | "soft" | "chewy" | "moist" | "crunchy";
export type PreparationTag = "fried" | "grilled" | "boiled" | "steamed" | "raw" | "stirFried" | "baked";

export type Menu = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  mainCategory: MainCategory;
  subCategory: string;
  mealForms: MealForm[];
  priceMin: number;
  priceMax: number;
  fullness: number;
  healthiness: number;
  servingSpeed: number;
  digestibility: number;
  popularity: number;
  uniqueness: number;
  soloFriendly: number;
  groupFriendly: number;
  deliveryFriendly: number;
  spiceLevel: number;
  oiliness: number;
  flourLevel: number;
  meatLevel: number;
  vegetableLevel: number;
  dairyLevel: number;
  soupLevel: number;
  tasteTags: TasteTag[];
  textureTags: TextureTag[];
  preparationTags: PreparationTag[];
  keywords: string[];
};
