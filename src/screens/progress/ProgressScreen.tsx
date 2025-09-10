// src/screens/progress/ProgressScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
//   Dimensions,
} from 'react-native';
import { StorageService } from '../../services/storage';
import { Goal } from '../../types';

// const { width } = Dimensions.get('window');

interface Props {
  navigation: any;
}

const ProgressScreen: React.FC<Props> = ({  }) => {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const goalsData = await StorageService.getGoals();
      setGoals(goalsData);
    } catch (error) {
      console.error('Failed to load goals:', error);
    }
  };

  const getCompletionStats = () => {
    const completed = goals.filter(goal => goal.isCompleted).length;
    const total = goals.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  };

  const getWeeklyStats = () => {
    // Mock weekly data - in real app, you'd track daily completions
    return {
      completed: Math.floor(Math.random() * 35) + 15,
      total: 49, // 7 days × 7 goals
      percentage: Math.floor(Math.random() * 30) + 60,
    };
  };

  const getMonthlyStats = () => {
    // Mock monthly data
    return {
      completed: Math.floor(Math.random() * 150) + 80,
      total: 210, // 30 days × 7 goals
      percentage: Math.floor(Math.random() * 25) + 65,
    };
  };

  const getCategoryProgress = () => {
    const categories = ['exercise', 'nutrition', 'sleep', 'mindfulness'];
    return categories.map(category => {
      const categoryGoals = goals.filter(goal => goal.category === category);
      const completed = categoryGoals.filter(goal => goal.isCompleted).length;
      const total = categoryGoals.length;
      const percentage = total > 0 ? (completed / total) * 100 : 0;
      
      return {
        category,
        completed,
        total,
        percentage,
        icon: getCategoryIcon(category),
      };
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'exercise': return '🏃‍♂️';
      case 'nutrition': return '💧';
      case 'sleep': return '😴';
      case 'mindfulness': return '🧘‍♀️';
      default: return '⭐';
    }
  };

  const todayStats = getCompletionStats();
  const weeklyStats = getWeeklyStats();
  const monthlyStats = getMonthlyStats();
  const categoryProgress = getCategoryProgress();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Overview Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.overviewGrid}>
            <StatsCard
              title="Today"
              completed={todayStats.completed}
              total={todayStats.total}
              percentage={todayStats.percentage}
              color="#4A90E2"
            />
            <StatsCard
              title="This Week"
              completed={weeklyStats.completed}
              total={weeklyStats.total}
              percentage={weeklyStats.percentage}
              color="#27AE60"
            />
            <StatsCard
              title="This Month"
              completed={monthlyStats.completed}
              total={monthlyStats.total}
              percentage={monthlyStats.percentage}
              color="#F39C12"
            />
          </View>
        </View>

        {/* Category Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress by Category</Text>
          {categoryProgress.map((category, index) => (
            <CategoryProgressCard key={index} {...category} />
          ))}
        </View>

        {/* Streaks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Streaks 🔥</Text>
          {goals
            .filter(goal => goal.streak > 0)
            .sort((a, b) => b.streak - a.streak)
            .map((goal) => (
              <StreakCard key={goal.id} goal={goal} />
            ))}
        </View>
      </View>
    </ScrollView>
  );
};

// Stats Card Component
interface StatsCardProps {
  title: string;
  completed: number;
  total: number;
  percentage: number;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  completed,
  total,
  percentage,
  color,
}) => (
  <View style={styles.statsCard}>
    <Text style={styles.statsTitle}>{title}</Text>
    <Text style={[styles.statsPercentage, { color }]}>{percentage}%</Text>
    <Text style={styles.statsSubtitle}>
      {completed} of {total} goals
    </Text>
    <View style={styles.progressBar}>
      <View
        style={[
          styles.progressFill,
          { width: `${percentage}%`, backgroundColor: color },
        ]}
      />
    </View>
  </View>
);

// Category Progress Card Component
interface CategoryProgressCardProps {
  category: string;
  completed: number;
  total: number;
  percentage: number;
  icon: string;
}

const CategoryProgressCard: React.FC<CategoryProgressCardProps> = ({
  category,
  completed,
  total,
  percentage,
  icon,
}) => (
  <View style={styles.categoryCard}>
    <View style={styles.categoryHeader}>
      <Text style={styles.categoryIcon}>{icon}</Text>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Text>
        <Text style={styles.categoryStats}>
          {completed} of {total} completed
        </Text>
      </View>
      <Text style={styles.categoryPercentage}>{Math.round(percentage)}%</Text>
    </View>
    <View style={styles.categoryProgressBar}>
      <View
        style={[
          styles.categoryProgressFill,
          { width: `${percentage}%` },
        ]}
      />
    </View>
  </View>
);

// Streak Card Component
interface StreakCardProps {
  goal: Goal;
}

const StreakCard: React.FC<StreakCardProps> = ({ goal }) => (
  <View style={styles.streakCard}>
    <Text style={styles.streakIcon}>{getCategoryIcon(goal.category)}</Text>
    <View style={styles.streakInfo}>
      <Text style={styles.streakTitle}>{goal.title}</Text>
      <Text style={styles.streakCount}>{goal.streak} day streak 🔥</Text>
    </View>
  </View>
);

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'exercise': return '🏃‍♂️';
    case 'nutrition': return '💧';
    case 'sleep': return '😴';
    case 'mindfulness': return '🧘‍♀️';
    default: return '⭐';
  }
};

// ==============================================
// RISK METER SCREEN
// ==============================================

// src/screens/dashboard/RiskMeterScreen.tsx
export interface HealthRiskCategory {
  category: string;
  icon: string;
  risks: {
    name: string;
    level: string;
    percentage: number;
  }[];
}

export const RiskMeterScreen: React.FC<Props> = ({  }) => {
  const [risks, setRisks] = useState<HealthRiskCategory[]>([]);

  useEffect(() => {
    generateHealthRisks();
  }, []);

  const generateHealthRisks = () => {
    // Mock risk data for late 30s moderately healthy user
    const healthRisks = [
      {
        category: 'Cardiovascular',
        icon: '❤️',
        risks: [
          { name: 'Heart Disease', level: 'moderate', percentage: 25 },
          { name: 'Hypertension', level: 'low', percentage: 15 },
          { name: 'Stroke', level: 'low', percentage: 8 },
        ],
      },
      {
        category: 'Metabolic',
        icon: '🩸',
        risks: [
          { name: 'Type 2 Diabetes', level: 'moderate', percentage: 22 },
          { name: 'Metabolic Syndrome', level: 'low', percentage: 18 },
          { name: 'Obesity', level: 'low', percentage: 12 },
        ],
      },
      {
        category: 'Musculoskeletal',
        icon: '🦴',
        risks: [
          { name: 'Osteoarthritis', level: 'moderate', percentage: 28 },
          { name: 'Osteoporosis', level: 'low', percentage: 10 },
          { name: 'Lower Back Pain', level: 'high', percentage: 35 },
        ],
      },
      {
        category: 'Neurological',
        icon: '🧠',
        risks: [
          { name: 'Cognitive Decline', level: 'low', percentage: 5 },
          { name: 'Depression', level: 'moderate', percentage: 20 },
          { name: 'Anxiety', level: 'moderate', percentage: 24 },
        ],
      },
    ];
    
    setRisks(healthRisks);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return '#27AE60';
      case 'moderate': return '#F39C12';
      case 'high': return '#E74C3C';
      default: return '#95A5A6';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Health Risk Assessment</Text>
          <Text style={styles.subtitle}>
            Based on your age, activity level, and health profile
          </Text>
        </View>

        {risks.map((category, index) => (
          <RiskCategoryCard
            key={index}
            category={category}
            getRiskColor={getRiskColor}
          />
        ))}

        <View style={styles.disclaimerCard}>
          <Text style={styles.disclaimerTitle}>⚠️ Important Note</Text>
          <Text style={styles.disclaimerText}>
            This assessment is for informational purposes only and should not
            replace professional medical advice. Consult with your healthcare
            provider for personalized health guidance.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

// Risk Category Card Component
interface RiskCategoryCardProps {
  category: any;
  getRiskColor: (level: string) => string;
}

const RiskCategoryCard: React.FC<RiskCategoryCardProps> = ({
  category,
  getRiskColor,
}) => (
  <View style={styles.categoryCard}>
    <View style={styles.categoryHeader}>
      <Text style={styles.categoryIcon}>{category.icon}</Text>
      <Text style={styles.categoryTitle}>{category.category}</Text>
    </View>
    
    {category.risks.map((risk: any, index: number) => (
      <View key={index} style={styles.riskItem}>
        <View style={styles.riskInfo}>
          <Text style={styles.riskName}>{risk.name}</Text>
          <View style={styles.riskLevel}>
            <View
              style={[
                styles.riskIndicator,
                { backgroundColor: getRiskColor(risk.level) },
              ]}
            />
            <Text style={[styles.riskLevelText, { color: getRiskColor(risk.level) }]}>
              {risk.level.toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={styles.riskPercentage}>{risk.percentage}%</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  overviewGrid: {
    flexDirection: 'column',
    gap: 15,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 5,
  },
  statsPercentage: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statsSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E1E8ED',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  categoryStats: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  categoryPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  categoryProgressBar: {
    height: 6,
    backgroundColor: '#E1E8ED',
    borderRadius: 3,
  },
  categoryProgressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 3,
  },
  streakCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  streakIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  streakInfo: {
    flex: 1,
  },
  streakTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  streakCount: {
    fontSize: 14,
    color: '#F39C12',
    fontWeight: '600',
  },
  riskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F2F6',
  },
  riskInfo: {
    flex: 1,
  },
  riskName: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 4,
  },
  riskLevel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  riskLevelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  riskPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7F8C8D',
  },
  disclaimerCard: {
    backgroundColor: '#FFF3CD',
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#F39C12',
    marginTop: 20,
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
});

export default ProgressScreen;