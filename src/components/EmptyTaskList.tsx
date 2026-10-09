import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { StatusFilter } from '../hooks/useTasks';

interface EmptyTaskListProps {
  statusFilter: StatusFilter;
  onOpenCreate: () => void;
}

const EmptyTaskListComponent: React.FC<EmptyTaskListProps> = ({ statusFilter, onOpenCreate }) => {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Feather name="inbox" size={36} color={colors.primary} />
      </View>
      <Text style={styles.emptyTitle}>
        {statusFilter === 'All' ? 'Chưa có công việc nào' : `Không có nhiệm vụ "${statusFilter}"`}
      </Text>
      <Text style={styles.emptyDesc}>
        Bắt đầu tổ chức công việc của bạn ngay bây giờ bằng cách thêm nhiệm vụ mới.
      </Text>
      <TouchableOpacity
        style={styles.emptyActionBtn}
        onPress={onOpenCreate}
        activeOpacity={0.8}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Thêm công việc đầu tiên"
      >
        <Feather name="plus" size={15} color={colors.primary} style={{ marginRight: 6 }} />
        <Text style={styles.emptyActionBtnText}>Thêm công việc đầu tiên</Text>
      </TouchableOpacity>
    </View>
  );
};

export const EmptyTaskList = React.memo(EmptyTaskListComponent);

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 56,
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  emptyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  emptyActionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
});
