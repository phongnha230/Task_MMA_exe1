import React, { useState, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { BottomTabNavigator } from './BottomTabNavigator';
import { TeamDetailScreen } from '../screens/teams/TeamDetailScreen';
import { ChatScreen } from '../screens/chat/ChatScreen';
import { colors } from '../theme/colors';
import { Team } from '../types/team';

export type RootStackParamList = {
  MainTabs: undefined;
  TeamDetail: { team: Team };
  Chat: { teamId: string; teamName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { user, loading } = useAuth();
  const [authScreen, setAuthScreen] = useState<'login' | 'signup'>('login');

  const handleNavigateToLogin = useCallback(() => setAuthScreen('login'), []);
  const handleNavigateToSignUp = useCallback(() => setAuthScreen('signup'), []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    if (authScreen === 'signup') {
      return <SignUpScreen onNavigateToLogin={handleNavigateToLogin} />;
    }
    return <LoginScreen onNavigateToSignUp={handleNavigateToSignUp} />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen
        name="TeamDetail"
        component={TeamDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
