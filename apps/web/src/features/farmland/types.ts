export type FarmZoneId = "M1" | "M2" | "M3" | "M4";

export type NutrientLevel = "low" | "balanced" | "high";

export interface FarmlandZone {
  id: FarmZoneId;
  moisturePercent: number;
  waterNote: string;
  ph: number;
  organicMatterPercent: number;
  nitrogen: NutrientLevel;
  phosphorus: NutrientLevel;
  potassium: NutrientLevel;
  soilSummary: string;
}
