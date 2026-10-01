import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export const ProfileScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.avatarCircle}>
          <Feather name="user" size={32} color={colors.primary} />
        </View>

        <View style={styles.badgePill}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>PHASE 2 PREVIEW</Text>
        </View>

        <Text style={styles.title}>Tài Khoản & Hồ Sơ</Text>
        <Text style={styles.description}>
          Hệ thống xác thực người dùng (Firebase Authentication) và phân quyền sẽ được tích hợp
          trong <Text style={styles.highlight}>Practical Exam 2</Text>.
        </Text>

        <View style={styles.specBox}>
          <Text style={styles.specHeading}>Đặc tả hiện tại (Exam 1):</Text>

          <View style={styles.rowItem}>
            <View style={styles.iconSquare}>
              <Feather name="unlock" size={14} color={colors.primary} />
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.itemTitle}>Quyền truy cập</Text>
              <Text style={styles.itemDesc}>Chế độ công khai (No Authentication required)</Text>
            </View>
          </View>

          <View style={styles.rowItem}>
            <View style={styles.iconSquare}>
              <Feather name="database" size={14} color={colors.primary} />
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.itemTitle}>Cơ sở dữ liệu</Text>
              <Text style={styles.itemDesc}>Cloud Firestore (Collection: tasks)</Text>
            </View>
          </View>

          <View style={styles.rowItem}>
            <View style={styles.iconSquare}>
              <Feather name="refresh-cw" size={14} color={colors.primary} />
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.itemTitle}>Đồng bộ hóa</Text>
              <Text style={styles.itemDesc}>Real-time Listener với onSnapshot</Text>
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
  avatarCircle: {
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
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  iconSquare: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: colors.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrap: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  itemDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
});
