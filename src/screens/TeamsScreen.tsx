import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

export const TeamsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>👥</Text>
        </View>
        <Text style={styles.title}>Teams & Collaboration</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>COMING SOON</Text>
        </View>
        <Text style={styles.description}>
          Chức năng phân công công việc theo Đội nhóm (Teams) và Thành viên (Assignees) sẽ được
          triển khai trong <Text style={styles.highlight}>Practical Exam 2</Text>.
        </Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Dự kiến trường dữ liệu liên kết:</Text>
          <Text style={styles.infoItem}>
            • <Text style={styles.code}>teamId</Text>: Định danh nhóm phụ trách
          </Text>
          <Text style={styles.infoItem}>
            • <Text style={styles.code}>assigneeId</Text>: Định danh thành viên thực hiện
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  badgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    maxWidth: 320,
  },
  highlight: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
    maxWidth: 320,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  infoItem: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  code: {
    fontFamily: 'monospace',
    color: colors.primary,
    fontWeight: '600',
  },
});
