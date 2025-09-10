// src/screens/onboarding/ConfirmationScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { User as IUser } from '../../types/index.ts';

interface Props {
  navigation: any;
  route: {
    params: {
      user: IUser;
    };
  };
}

const ConfirmationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { user } = route.params;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContinue = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Dashboard' }],
    });
  };

  return (
    <LinearGradient
      colors={['#27AE60', '#2ECC71', '#58D68D']}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.celebrationContainer}>
          <Text style={styles.celebrationEmoji}>🎉</Text>
          <Text style={styles.title}>
            Hi {user.name}, your profile is ready!
          </Text>
          <Text style={styles.subtitle}>
            Welcome to your wellness journey
          </Text>
        </View>

        <View style={styles.profileSummary}>
          <ProfileItem icon="👤" label="Name" value={user.name} />
          <ProfileItem icon="🎂" label="Age" value={`${user.age} years`} />
          <ProfileItem 
            icon="⚡" 
            label="Activity Level" 
            value={user.activityLevel.replace('_', ' ')} 
          />
          <ProfileItem icon="📱" label="Phone" value={user.phone} />
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Start Your Journey</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const ProfileItem: React.FC<{ icon: string; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => (
  <View style={styles.profileItem}>
    <Text style={styles.profileIcon}>{icon}</Text>
    <View style={styles.profileDetails}>
      <Text style={styles.profileLabel}>{label}</Text>
      <Text style={styles.profileValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 30,
    width: '100%',
  },
  celebrationContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  celebrationEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#E8F8F5',
    textAlign: 'center',
    opacity: 0.9,
  },
  profileSummary: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 40,
    width: '100%',
    // backdropFilter: 'blur(10px)',
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 30,
  },
  profileDetails: {
    flex: 1,
  },
  profileLabel: {
    fontSize: 14,
    color: '#E8F8F5',
    opacity: 0.8,
  },
  profileValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  continueButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27AE60',
  },
});

export default ConfirmationScreen;

// ==============================================
// PACKAGE.JSON DEPENDENCIES
// ==============================================

/*
Add these dependencies to your package.json:

{
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.72.6",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/native-stack": "^6.9.17",
    "react-native-screens": "^3.27.0",
    "react-native-safe-area-context": "^4.7.4",
    "@react-native-async-storage/async-storage": "^1.19.5",
    "react-native-vector-icons": "^10.0.2",
    "react-native-reanimated": "^3.5.4",
    "react-native-linear-gradient": "^2.8.3"
  }
}
*/

// ==============================================
// TYPES DEFINITION FILE
// ==============================================

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
