import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Shadows } from '../constants/colors';
import { useApp } from '../context/AppContext';

export const SettingsScreen: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(settings.name);

  const handleNameSave = () => {
    if (nameInput.trim()) {
      updateSettings({ name: nameInput.trim() });
    }
    setEditingName(false);
  };

  const handleWaterGoalChange = (delta: number) => {
    const newGoal = Math.max(1, Math.min(16, settings.waterGoal + delta));
    updateSettings({ waterGoal: newGoal });
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will reset all your tracking data and settings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            // Force reload - in production you'd want a better state reset
            Alert.alert('Done', 'All data cleared. Please restart the app.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Settings</Text>

        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Name</Text>
              {editingName ? (
                <View style={styles.editRow}>
                  <TextInput
                    style={styles.input}
                    value={nameInput}
                    onChangeText={setNameInput}
                    autoFocus
                    onBlur={handleNameSave}
                    onSubmitEditing={handleNameSave}
                    returnKeyType="done"
                  />
                </View>
              ) : (
                <TouchableOpacity onPress={() => setEditingName(true)}>
                  <Text style={styles.value}>{settings.name} ✏️</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Tracking Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tracking</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Daily water goal</Text>
              <View style={styles.stepper}>
                <TouchableOpacity
                  style={styles.stepperButton}
                  onPress={() => handleWaterGoalChange(-1)}
                >
                  <Text style={styles.stepperText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.stepperValue}>{settings.waterGoal} 💧</Text>
                <TouchableOpacity
                  style={styles.stepperButton}
                  onPress={() => handleWaterGoalChange(1)}
                >
                  <Text style={styles.stepperText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.label}>Pill reminder time</Text>
              <Text style={styles.value}>{settings.pillReminderTime}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.label}>Notifications</Text>
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={(value) => updateSettings({ notificationsEnabled: value })}
                trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                thumbColor={settings.notificationsEnabled ? Colors.primary : Colors.textMuted}
              />
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Version</Text>
              <Text style={styles.value}>1.0.0</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>Made with</Text>
              <Text style={styles.value}>🐾 by Pippy</Text>
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.iron }]}>Danger Zone</Text>
          <TouchableOpacity style={styles.dangerCard} onPress={handleClearData}>
            <Text style={styles.dangerText}>Clear All Data</Text>
            <Text style={styles.dangerSubtext}>This cannot be undone</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Pippy is here to help you build healthy habits. 🌸{'\n'}
            Remember: this is just a reminder app, not medical advice.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 4,
    ...Shadows.medium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  label: {
    fontSize: 16,
    color: Colors.text,
  },
  value: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    fontSize: 16,
    color: Colors.text,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 100,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepperButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperText: {
    fontSize: 20,
    color: Colors.primary,
    fontWeight: '600',
  },
  stepperValue: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
    minWidth: 50,
    textAlign: 'center',
  },
  dangerCard: {
    backgroundColor: Colors.ironLight,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  dangerText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.iron,
  },
  dangerSubtext: {
    fontSize: 12,
    color: Colors.iron,
    marginTop: 4,
    opacity: 0.7,
  },
  footer: {
    marginTop: 20,
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
