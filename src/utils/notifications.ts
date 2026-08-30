import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Habit } from '@/types/habit';

// Configure notification presentation
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationScheduleConfig {
  morningEnabled: boolean;
  morningTime: string; // "08:00"
  afternoonEnabled: boolean;
  afternoonTime: string; // "14:00"
  eveningEnabled: boolean;
  eveningTime: string; // "20:30"
}

export const DEFAULT_NOTIFICATION_CONFIG: NotificationScheduleConfig = {
  morningEnabled: true,
  morningTime: '08:00',
  afternoonEnabled: true,
  afternoonTime: '14:00',
  eveningEnabled: true,
  eveningTime: '20:30',
};

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  } catch (e) {
    console.log('Error requesting notification permissions:', e);
    return false;
  }
}

export async function scheduleDailyReminders(config: NotificationScheduleConfig) {
  if (Platform.OS === 'web') return;

  try {
    // 1. Morning Intention
    if (config.morningEnabled) {
      const [hour, minute] = config.morningTime.split(':').map(Number);
      await Notifications.scheduleNotificationAsync({
        identifier: 'global-morning-reminder',
        content: {
          title: '🌅 Morning Intention Check-in',
          body: 'What habits are you prioritizing today? Tap to set your daily intention.',
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: isNaN(hour) ? 8 : hour,
          minute: isNaN(minute) ? 0 : minute,
        },
      });
    } else {
      await Notifications.cancelScheduledNotificationAsync('global-morning-reminder').catch(() => {});
    }

    // 2. Afternoon Momentum Check
    if (config.afternoonEnabled) {
      const [hour, minute] = config.afternoonTime.split(':').map(Number);
      await Notifications.scheduleNotificationAsync({
        identifier: 'global-afternoon-reminder',
        content: {
          title: '⚡ Mid-Day Momentum Check',
          body: 'Halfway through the day! Check in on your hydration and workout progress.',
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: isNaN(hour) ? 14 : hour,
          minute: isNaN(minute) ? 0 : minute,
        },
      });
    } else {
      await Notifications.cancelScheduledNotificationAsync('global-afternoon-reminder').catch(() => {});
    }

    // 3. Evening Streak Keeper
    if (config.eveningEnabled) {
      const [hour, minute] = config.eveningTime.split(':').map(Number);
      await Notifications.scheduleNotificationAsync({
        identifier: 'global-evening-reminder',
        content: {
          title: '🔥 Protect Your Streaks!',
          body: "Don't go to bed without closing your habit loops. Take 2 mins to log tonight.",
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: isNaN(hour) ? 20 : hour,
          minute: isNaN(minute) ? 30 : minute,
        },
      });
    } else {
      await Notifications.cancelScheduledNotificationAsync('global-evening-reminder').catch(() => {});
    }
  } catch (e) {
    console.log('Error scheduling notifications:', e);
  }
}

export async function scheduleHabitReminder(habit: Habit) {
  if (Platform.OS === 'web' || !habit.reminderTime) return;

  try {
    const [hour, minute] = habit.reminderTime.split(':').map(Number);
    if (isNaN(hour) || isNaN(minute)) return;

    await Notifications.scheduleNotificationAsync({
      identifier: `habit-reminder-${habit.id}`,
      content: {
        title: `⏰ Time for "${habit.title}"`,
        body: habit.description || `Stay consistent with your ${habit.category} routine!`,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  } catch (e) {
    console.log('Error scheduling habit reminder:', e);
  }
}

export async function cancelHabitReminder(habitId: string) {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.cancelScheduledNotificationAsync(`habit-reminder-${habitId}`).catch(() => {});
  } catch (e) {
    console.log('Error cancelling habit reminder:', e);
  }
}

export async function sendInstantTestNotification(title: string, body: string) {
  if (Platform.OS === 'web') {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        new Notification(title, { body });
      }
    }
    return;
  }

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: null, // trigger immediately
    });
  } catch (e) {
    console.log('Failed to send test notification', e);
  }
}
