import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import { Colors, Shadows, BorderRadius, Spacing } from '../constants/colors';
import { MoodCheckin as MoodCheckinType } from '../types';

const MOOD_OPTIONS = [
  { value: 1 as const, emoji: '😢', label: 'Terrible', color: Colors.moodTerrible },
  { value: 2 as const, emoji: '😕', label: 'Bad', color: Colors.moodBad },
  { value: 3 as const, emoji: '😐', label: 'Okay', color: Colors.moodOkay },
  { value: 4 as const, emoji: '🙂', label: 'Good', color: Colors.moodGood },
  { value: 5 as const, emoji: '😊', label: 'Great', color: Colors.moodGreat },
];

const FEELING_OPTIONS = [
  { id: 'happy', label: 'Happy', emoji: '😊' },
  { id: 'calm', label: 'Calm', emoji: '😌' },
  { id: 'grateful', label: 'Grateful', emoji: '🙏' },
  { id: 'energetic', label: 'Energetic', emoji: '⚡' },
  { id: 'hopeful', label: 'Hopeful', emoji: '🌟' },
  { id: 'loved', label: 'Loved', emoji: '💕' },
  { id: 'anxious', label: 'Anxious', emoji: '😰' },
  { id: 'sad', label: 'Sad', emoji: '😢' },
  { id: 'tired', label: 'Tired', emoji: '😴' },
  { id: 'stressed', label: 'Stressed', emoji: '😫' },
  { id: 'angry', label: 'Angry', emoji: '😠' },
  { id: 'lonely', label: 'Lonely', emoji: '🥺' },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (checkin: MoodCheckinType) => void;
  existingCheckin?: MoodCheckinType;
}

export const MoodCheckinModal: React.FC<Props> = ({
  visible,
  onClose,
  onSubmit,
  existingCheckin,
}) => {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState<1 | 2 | 3 | 4 | 5>(existingCheckin?.mood || 3);
  const [feelings, setFeelings] = useState<string[]>(existingCheckin?.feelings || []);
  const [note, setNote] = useState(existingCheckin?.note || '');

  const handleFeelingToggle = (feelingId: string) => {
    setFeelings(prev => 
      prev.includes(feelingId)
        ? prev.filter(f => f !== feelingId)
        : [...prev, feelingId].slice(0, 5) // Max 5 feelings
    );
  };

  const handleSubmit = () => {
    onSubmit({
      mood,
      feelings,
      note: note.trim() || undefined,
      timestamp: new Date().toISOString(),
    });
    // Reset state
    setStep(1);
    setMood(3);
    setFeelings([]);
    setNote('');
  };

  const selectedMoodOption = MOOD_OPTIONS.find(m => m.value === mood);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>How are you feeling?</Text>
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>{step}/3</Text>
          </View>
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Step 1: Mood Selection */}
          {step === 1 && (
            <View style={styles.stepContent}>
              <Text style={styles.subtitle}>Select your overall mood</Text>
              
              <View style={styles.moodRow}>
                {MOOD_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.moodOption,
                      mood === option.value && { 
                        backgroundColor: option.color + '20',
                        borderColor: option.color,
                      },
                    ]}
                    onPress={() => setMood(option.value)}
                  >
                    <Text style={styles.moodEmoji}>{option.emoji}</Text>
                    <Text style={[
                      styles.moodLabel,
                      mood === option.value && { color: option.color },
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.selectedMood}>
                <Text style={[styles.selectedMoodEmoji, { color: selectedMoodOption?.color }]}>
                  {selectedMoodOption?.emoji}
                </Text>
                <Text style={styles.selectedMoodText}>
                  You're feeling {selectedMoodOption?.label.toLowerCase()}
                </Text>
              </View>
            </View>
          )}

          {/* Step 2: Feelings */}
          {step === 2 && (
            <View style={styles.stepContent}>
              <Text style={styles.subtitle}>What else are you feeling?</Text>
              <Text style={styles.hint}>Select up to 5</Text>
              
              <View style={styles.feelingsGrid}>
                {FEELING_OPTIONS.map((feeling) => (
                  <TouchableOpacity
                    key={feeling.id}
                    style={[
                      styles.feelingChip,
                      feelings.includes(feeling.id) && styles.feelingChipSelected,
                    ]}
                    onPress={() => handleFeelingToggle(feeling.id)}
                  >
                    <Text style={styles.feelingEmoji}>{feeling.emoji}</Text>
                    <Text style={[
                      styles.feelingLabel,
                      feelings.includes(feeling.id) && styles.feelingLabelSelected,
                    ]}>
                      {feeling.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Step 3: Note */}
          {step === 3 && (
            <View style={styles.stepContent}>
              <Text style={styles.subtitle}>Anything you want to add?</Text>
              <Text style={styles.hint}>Optional - this is just for you</Text>
              
              <TextInput
                style={styles.noteInput}
                placeholder="How was your day? What's on your mind?"
                placeholderTextColor={Colors.textMuted}
                multiline
                numberOfLines={4}
                value={note}
                onChangeText={setNote}
                textAlignVertical="top"
              />

              <View style={styles.summary}>
                <Text style={styles.summaryTitle}>Your check-in</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryEmoji}>{selectedMoodOption?.emoji}</Text>
                  <Text style={styles.summaryText}>
                    Feeling {selectedMoodOption?.label.toLowerCase()}
                  </Text>
                </View>
                {feelings.length > 0 && (
                  <View style={styles.summaryFeelings}>
                    {feelings.map(f => {
                      const feeling = FEELING_OPTIONS.find(fo => fo.id === f);
                      return (
                        <Text key={f} style={styles.summaryFeeling}>
                          {feeling?.emoji} {feeling?.label}
                        </Text>
                      );
                    })}
                  </View>
                )}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Navigation buttons */}
        <View style={styles.footer}>
          {step > 1 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setStep(s => s - 1)}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => {
              if (step < 3) {
                setStep(s => s + 1);
              } else {
                handleSubmit();
              }
            }}
          >
            <Text style={styles.nextButtonText}>
              {step === 3 ? 'Complete +5 ⭐' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  stepIndicator: {
    width: 36,
    alignItems: 'flex-end',
  },
  stepText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
  },
  stepContent: {
    flex: 1,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  hint: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: Spacing.xl,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  moodOption: {
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 60,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  moodLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  selectedMood: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  selectedMoodEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  selectedMoodText: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  feelingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  feelingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    gap: Spacing.xs,
  },
  feelingChipSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  feelingEmoji: {
    fontSize: 16,
  },
  feelingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  feelingLabelSelected: {
    color: Colors.primaryDark,
  },
  noteInput: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: 16,
    color: Colors.text,
    minHeight: 120,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },
  summary: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  summaryEmoji: {
    fontSize: 28,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  summaryFeelings: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  summaryFeeling: {
    fontSize: 14,
    color: Colors.textSecondary,
    backgroundColor: Colors.backgroundAlt,
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  backButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.border,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  nextButton: {
    flex: 2,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textOnPrimary,
  },
});
