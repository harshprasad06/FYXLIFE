// src/services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Goal } from '../types';

export class StorageService {
  static async saveUser(user: User): Promise<void> {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  }

  static async getUser(): Promise<User | null> {
    const userData = await AsyncStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  static async saveGoals(goals: Goal[]): Promise<void> {
    await AsyncStorage.setItem('goals', JSON.stringify(goals));
  }

  static async getGoals(): Promise<Goal[]> {
    const goalsData = await AsyncStorage.getItem('goals');
    return goalsData ? JSON.parse(goalsData) : [];
  }

  static async updateGoalProgress(goalId: string, newCurrent: number): Promise<void> {
    const goals = await this.getGoals();
    const updatedGoals = goals.map(goal =>
      goal.id === goalId
        ? { ...goal, current: newCurrent, isCompleted: newCurrent >= goal.target }
        : goal
    );
    await this.saveGoals(updatedGoals);
  }
}