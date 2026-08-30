import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

let isSoundEnabled = true;
let isHapticsEnabled = true;

export const setSensorySettings = (sound: boolean, haptics: boolean) => {
  isSoundEnabled = sound;
  isHapticsEnabled = haptics;
};

export const triggerHaptic = async (
  type: 'selection' | 'light' | 'medium' | 'heavy' | 'success' | 'warning' = 'light'
) => {
  if (!isHapticsEnabled || Platform.OS === 'web') return;
  try {
    switch (type) {
      case 'selection':
        await Haptics.selectionAsync();
        break;
      case 'light':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'success':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
    }
  } catch (e) {
    // Haptics not supported or ignored on simulator
  }
};

// Web Audio API & Native Tone Chime generator
export const playChimeSound = async (type: 'complete' | 'step' | 'challenge' = 'complete') => {
  if (!isSoundEnabled) return;

  if (Platform.OS === 'web') {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'step') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'complete') {
        // Melodic 3-chord chime (C5 -> E5 -> G5)
        const notes = [523.25, 659.25, 783.99];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
          gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.35);
          osc.start(ctx.currentTime + idx * 0.08);
          osc.stop(ctx.currentTime + idx * 0.08 + 0.35);
        });
      } else if (type === 'challenge') {
        // Grand fanfare (C5 -> E5 -> G5 -> C6)
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
          gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.5);
          osc.start(ctx.currentTime + idx * 0.1);
          osc.stop(ctx.currentTime + idx * 0.1 + 0.5);
        });
      }
    } catch (e) {
      console.log('Audio playback error', e);
    }
  } else {
    // Native audio playback using Audio from expo-av or synthesized sound
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });
      // Short system bell or chime
      const soundObject = new Audio.Sound();
      // Use standard remote bell URI or fallback gracefully
      await soundObject.loadAsync(
        { uri: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3' },
        { shouldPlay: true, volume: 0.8 }
      );
    } catch (e) {
      // Audio playback fails gracefully if offline or sound is silent
    }
  }
};
