import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import WelcomeScreen from './src/screens/onboarding/WelcomeScreen';
import UserInfoScreen from './src/screens/onboarding/UserInfoScreen';
import ConfirmationScreen from './src/screens/onboarding/ConfirmationScreen';
import DashboardScreen from './src/screens/dashboard/DashboardScreen';
import ProgressScreen, { RiskMeterScreen } from './src/screens/progress/ProgressScreen';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: { backgroundColor: '#4A90E2' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserInfo"
          component={UserInfoScreen}
          options={{ title: 'Tell us about yourself' }}
        />
        <Stack.Screen
          name="Confirmation"
          component={ConfirmationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: 'Your Wellness Journey' }}
        />
        <Stack.Screen
          name="Progress"
          component={ProgressScreen}
          options={{ title: 'Your Progress' }}
        />
        <Stack.Screen
          name="RiskMeter"
          component={RiskMeterScreen}
          options={{ title: 'Health Risk Assessment' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}