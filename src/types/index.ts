// src/types/index.ts
export interface User {
  id: string;
  name: string;
  age: number;
  phone: string;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  height?: number;
  weight?: number;
  createdAt: Date;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  category: 'exercise' | 'nutrition' | 'sleep' | 'mindfulness';
  isCompleted: boolean;
  streak: number;
}

export interface HealthRisk {
  id: string;
  name: string;
  category: 'cardio' | 'neuro' | 'respiratory' | 'digestive' | 'musculoskeletal';
  riskLevel: 'low' | 'moderate' | 'high';
  percentage: number;
  description: string;
}