import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider } from '@/context/AuthContext';
import { HabitProvider } from '@/context/HabitContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <HabitProvider>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#4F46E5',
            tabBarInactiveTintColor: '#94A3B8',
            tabBarStyle: {
              backgroundColor: '#FFFFFF',
              borderTopColor: '#F1F5F9',
              height: 62,
              paddingBottom: 8,
              paddingTop: 6,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
            },
          }}>
          {/* Screen 1: Habits */}
          <Tabs.Screen
            name="index"
            options={{
              title: 'Habits',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="checkbox" size={size ?? 22} color={color} />
              ),
            }}
          />

          {/* Screen 2: Challenges */}
          <Tabs.Screen
            name="challenges"
            options={{
              title: 'Challenges',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="trophy" size={size ?? 22} color={color} />
              ),
            }}
          />

          {/* Screen 3: Accountability Log */}
          <Tabs.Screen
            name="journal"
            options={{
              title: 'Log',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="journal" size={size ?? 22} color={color} />
              ),
            }}
          />

          {/* Screen 4: Analytics */}
          <Tabs.Screen
            name="explore"
            options={{
              title: 'Insights',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="stats-chart" size={size ?? 22} color={color} />
              ),
            }}
          />

          {/* Screen 5: Settings & Retention */}
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Settings',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="settings-sharp" size={size ?? 22} color={color} />
              ),
            }}
          />
        </Tabs>
      </HabitProvider>
    </AuthProvider>
  );
}
