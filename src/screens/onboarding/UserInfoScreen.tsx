// src/screens/onboarding/UserInfoScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { StorageService } from '../../services/storage.ts';
import { User } from '../../types/index.ts';

interface Props {
  navigation: any;
}

const UserInfoScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    gender: '',
    activityLevel: '',
    height: '',
    weight: '',
  });

  const activityLevels = [
    { key: 'sedentary', label: 'Sedentary (little/no exercise)' },
    { key: 'light', label: 'Light (1-3 days/week)' },
    { key: 'moderate', label: 'Moderate (3-5 days/week)' },
    { key: 'active', label: 'Active (6-7 days/week)' },
    { key: 'very_active', label: 'Very Active (2x/day)' },
  ];

  const genders = [
    { key: 'male', label: 'Male' },
    { key: 'female', label: 'Female' },
    { key: 'other', label: 'Other' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { name, age, phone, gender, activityLevel } = formData;
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    if (!age || parseInt(age) < 1 || parseInt(age) > 120) {
      Alert.alert('Error', 'Please enter a valid age');
      return false;
    }
    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return false;
    }
    if (!gender) {
      Alert.alert('Error', 'Please select your gender');
      return false;
    }
    if (!activityLevel) {
      Alert.alert('Error', 'Please select your activity level');
      return false;
    }
    return true;
  };

  const handleContinue = async () => {
    if (!validateForm()) return;

    const user: User = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      age: parseInt(formData.age),
      phone: formData.phone.trim(),
      gender: formData.gender as any,
      activityLevel: formData.activityLevel as any,
      height: formData.height ? parseInt(formData.height) : undefined,
      weight: formData.weight ? parseInt(formData.weight) : undefined,
      createdAt: new Date(),
    };

    try {
      await StorageService.saveUser(user);
      navigation.navigate('Confirmation', { user });
    } catch (error) {
      Alert.alert('Error', 'Failed to save user data');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Tell us about yourself</Text>
        <Text style={styles.subtitle}>
          Help us personalize your wellness journey
        </Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Age *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="25"
                value={formData.age}
                onChangeText={(value) => handleInputChange('age', value)}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Phone *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="+1234567890"
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender *</Text>
            <View style={styles.optionsContainer}>
              {genders.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.optionButton,
                    formData.gender === option.key && styles.selectedOption,
                  ]}
                  onPress={() => handleInputChange('gender', option.key)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      formData.gender === option.key && styles.selectedOptionText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Activity Level *</Text>
            {activityLevels.map((level) => (
              <TouchableOpacity
                key={level.key}
                style={[
                  styles.activityOption,
                  formData.activityLevel === level.key && styles.selectedActivity,
                ]}
                onPress={() => handleInputChange('activityLevel', level.key)}
              >
                <Text
                  style={[
                    styles.activityText,
                    formData.activityLevel === level.key && styles.selectedActivityText,
                  ]}
                >
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Height (cm)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="170"
                value={formData.height}
                onChangeText={(value) => handleInputChange('height', value)}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="70"
                value={formData.weight}
                onChangeText={(value) => handleInputChange('weight', value)}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 30,
  },
  form: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E1E8ED',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1E8ED',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  optionText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  selectedOptionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  activityOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1E8ED',
    backgroundColor: '#FFFFFF',
  },
  selectedActivity: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  activityText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  selectedActivityText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#4A90E2',
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
    color: '#FFFFFF',
  },
});

export default UserInfoScreen;