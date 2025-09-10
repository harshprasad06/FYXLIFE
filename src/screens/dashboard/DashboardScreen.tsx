// src/screens/dashboard/DashboardScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
//   Dimensions,
} from 'react-native';
import { StorageService } from '../../services/storage.ts';
import { User, Goal } from '../../types/index.ts';

// const { width } = Dimensions.get('window');

interface Props {
  navigation: any;
  route: any;
}

const DashboardScreen: React.FC<Props> = ({ navigation, }) => {
  const [user, setUser] = useState<User | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    loadUserData();
    initializeGoals();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await StorageService.getUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const initializeGoals = async () => {
    try {
      let existingGoals = await StorageService.getGoals();
      
      if (existingGoals.length === 0) {
        // Initialize with default goals
        const defaultGoals: Goal[] = [
          {
            id: '1',
            title: '10,000 Steps',
            description: 'Walk 10,000 steps daily',
            target: 10000,
            current: 6500,
            unit: 'steps',
            category: 'exercise',
            isCompleted: false,
            streak: 2,
          },
          {
            id: '2',
            title: 'Drink Water',
            description: 'Drink 8 glasses of water',
            target: 8,
            current: 5,
            unit: 'glasses',
            category: 'nutrition',
            isCompleted: false,
            streak: 1,
          },
          {
            id: '3',
            title: 'Sleep 8 Hours',
            description: 'Get quality sleep',
            target: 8,
            current: 7.5,
            unit: 'hours',
            category: 'sleep',
            isCompleted: false,
            streak: 3,
          },
          {
            id: '4',
            title: 'Meditate',
            description: '10 minutes of mindfulness',
            target: 10,
            current: 10,
            unit: 'minutes',
            category: 'mindfulness',
            isCompleted: true,
            streak: 5,
          },
        ];
        
        await StorageService.saveGoals(defaultGoals);
        setGoals(defaultGoals);
      } else {
        setGoals(existingGoals);
      }
    } catch (error) {
      console.error('Failed to initialize goals:', error);
    }
  };

  const updateGoalProgress = async (goalId: string, increment: number) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const newCurrent = Math.min(goal.current + increment, goal.target);
        const isCompleted = newCurrent >= goal.target;
        return {
          ...goal,
          current: newCurrent,
          isCompleted,
          streak: isCompleted && !goal.isCompleted ? goal.streak + 1 : goal.streak,
        };
      }
      return goal;
    });

    setGoals(updatedGoals);
    await StorageService.saveGoals(updatedGoals);
  };

  const getCompletedGoalsToday = () => {
    return goals.filter(goal => goal.isCompleted).length;
  };

  const getTotalGoals = () => {
    return goals.length;
  };

//   const getCategoryIcon = (category: string) => {
//     switch (category) {
//       case 'exercise': return '🏃‍♂️';
//       case 'nutrition': return '💧';
//       case 'sleep': return '😴';
//       case 'mindfulness': return '🧘‍♀️';
//       default: return '⭐';
//     }
//   };

//   const getProgressColor = (percentage: number) => {
//     if (percentage >= 100) return '#27AE60';
//     if (percentage >= 75) return '#F39C12';
//     if (percentage >= 50) return '#3498DB';
//     return '#E74C3C';
//   };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Good {getTimeOfDayGreeting()}, {user?.name || 'there'}! 👋
          </Text>
          <Text style={styles.date}>{getCurrentDate()}</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{getCompletedGoalsToday()}</Text>
            <Text style={styles.statLabel}>Goals Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{getTotalGoals()}</Text>
            <Text style={styles.statLabel}>Total Goals</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {Math.max(...goals.map(g => g.streak), 0)}
            </Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
        </View>

        {/* Goals Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Goals</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Progress')}>
              <Text style={styles.sectionLink}>View All</Text>
            </TouchableOpacity>
          </View>

          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onUpdateProgress={updateGoalProgress}
            />
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Progress')}
            >
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionText}>View Progress</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('RiskMeter')}
            >
              <Text style={styles.actionIcon}>⚠️</Text>
              <Text style={styles.actionText}>Risk Assessment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

// Goal Card Component
interface GoalCardProps {
  goal: Goal;
  onUpdateProgress: (goalId: string, increment: number) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onUpdateProgress }) => {
    const getCategoryIcon = (category: string) => {
      switch (category) {
        case 'exercise': return '🏃‍♂️';
        case 'nutrition': return '💧';
        case 'sleep': return '😴';
        case 'mindfulness': return '🧘‍♀️';
        default: return '⭐';
      }
    };
  
    const getProgressColor = (percentage: number) => {
      if (percentage >= 100) return '#27AE60';
      if (percentage >= 75) return '#F39C12';
      if (percentage >= 50) return '#3498DB';
      return '#E74C3C';
    };
  const progressPercentage = Math.min((goal.current / goal.target) * 100, 100);
  const progressColor = getProgressColor(progressPercentage);


  return (
    <View style={styles.goalCard}>
      <View style={styles.goalHeader}>
        <View style={styles.goalInfo}>
          <Text style={styles.goalIcon}>{getCategoryIcon(goal.category)}</Text>
          <View style={styles.goalDetails}>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            <Text style={styles.goalDescription}>{goal.description}</Text>
          </View>
        </View>
        {goal.streak > 0 && (
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>{goal.streak}🔥</Text>
          </View>
        )}
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${progressPercentage}%`, backgroundColor: progressColor },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {goal.current} / {goal.target} {goal.unit}
        </Text>
      </View>

      {!goal.isCompleted && (
        <TouchableOpacity
          style={[styles.updateButton, { backgroundColor: progressColor }]}
          onPress={() => onUpdateProgress(goal.id, goal.target * 0.1)}
        >
          <Text style={styles.updateButtonText}>Update Progress</Text>
        </TouchableOpacity>
      )}

      {goal.isCompleted && (
        <View style={styles.completedBadge}>
          <Text style={styles.completedText}>✅ Completed!</Text>
        </View>
      )}
    </View>
  );
};

// Helper functions
const getTimeOfDayGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

const getCurrentDate = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// const getProgressColor = (percentage: number) => {
//   if (percentage >= 100) return '#27AE60';
//   if (percentage >= 75) return '#F39C12';
//   if (percentage >= 50) return '#3498DB';
//   return '#E74C3C';
// };

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
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  sectionLink: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  goalInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  goalIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  goalDetails: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  goalDescription: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  streakBadge: {
    backgroundColor: '#FFE5B4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#D68910',
  },
  progressContainer: {
    marginBottom: 15,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E1E8ED',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'right',
  },
  updateButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  completedBadge: {
    alignItems: 'center',
  },
  completedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 25,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
  },
});

export default DashboardScreen;