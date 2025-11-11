export interface CategoryRawData {
  coefficient: number;
  exponent: number;
  data: [number, number][];
}

export interface SalesData {
  [key: string]: CategoryRawData;
}

export type CalculationMethod = 'interpolation' | 'extrapolation' | 'power_law';

export interface CalculationResult {
  monthlySales: number;
  dailySales: number;
  monthlyRevenue: number;
  dailyRevenue: number;
  annualRevenue: number;
  methodologyText: string;
}