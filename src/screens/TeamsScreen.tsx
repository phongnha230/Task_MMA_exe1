import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export const TeamsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Feather name="users" size={32} color={colors.primary} />
        </View>

        <View style={styles.badgePill}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>PHASE 2 PREVIEW</Text>
        </View>

        <Text style={styles.title}>Team Collaboration</Text>
        <Text style={styles.description}>
          Không gian làm việc nhóm, chia sẻ dự án và quản lý quyền hạn thành viên sẽ có mặt trong{' '}
          <Text style={styles.highlight}>Practical Exam 2</Text>.
        </Text>

        {/* Feature roadmap cards */}
        <View style={styles.specBox}>
          <Text style={styles.specHeading}>Cấu trúc dữ liệu đã sẵn sàng:</Text>

          <View style={styles.featureItem}>
            <View style={styles.featureIconWrap}>
              <Feather name="folder" size={14} color={colors.primary} />
            </View>
            <View style={styles.featureTextWrap}>
              <Text style={styles.featureTitle}>teamId</Text>
              <Text style={styles.featureDesc}>Khóa ngoại liên kết nhóm sở hữu công việc</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIconWrap}>
              <Feather name="user-check" size={14} color={colors.primary} />
            </View>
            <View style={styles.featureTextWrap}>
              <Text style={styles.featureTitle}>assigneeId</Text>
              <Text style={styles.featureDesc}>Giao việc và thông báo cho từng cá nhân</Text>
            </View>
          </View>
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
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 100,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    maxWidth: 320,
  },
  highlight: {
    color: colors.primary,
    fontWeight: '700',
  },
  specBox: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
    maxWidth: 330,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  specHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  featureIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: colors.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTextWrap: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  featureDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
});
