import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { StatusFilter } from '../hooks/useTasks';
import { TaskStats } from '../types/task';

interface HomeHeaderProps {
  stats: TaskStats;
  statusFilter: StatusFilter;
  onFilterChange: (filter: StatusFilter) => void;
  onOpenCreate: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  stats,
  statusFilter,
  onFilterChange,
  onOpenCreate,
}) => {
  const filterTabs: { label: string; value: StatusFilter; count: number }[] = [
    { label: 'Tất cả', value: 'All', count: stats.total },
    { label: 'To Do', value: 'To Do', count: stats.todo },
    { label: 'In Progress', value: 'In Progress', count: stats.inProgress },
    { label: 'Done', value: 'Done', count: stats.done },
  ];

  return (
    <View style={styles.header}>
      {/* Header Top: Title & Create button */}
      <View style={styles.headerTop}>
        <View>
          <View style={styles.eyebrowContainer}>
            <View style={styles.livePulseDot} />
            <Text style={styles.eyebrowText}>FIRESTORE CLOUD</Text>
          </View>
          <Text style={styles.appTitle}>Task Manager</Text>
          <Text style={styles.appSubtitle}>Đồng bộ thời gian thực • Public CRUD</Text>
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={onOpenCreate}
          activeOpacity={0.8}
        >
          <View style={styles.plusIconWrap}>
            <Feather name="plus" size={14} color={colors.primary} />
          </View>
          <Text style={styles.createButtonText}>Tạo mới</Text>
        </TouchableOpacity>
      </View>

      {/* Bento Stats Cards */}
      <View style={styles.bentoRow}>
        <View style={styles.bentoCard}>
          <Text style={styles.bentoNumber}>{stats.total}</Text>
          <Text style={styles.bentoLabel}>Tổng số</Text>
        </View>

        <View style={styles.bentoCard}>
          <Text style={[styles.bentoNumber, { color: colors.statusTodo }]}>{stats.todo}</Text>
          <Text style={styles.bentoLabel}>To Do</Text>
        </View>

        <View style={styles.bentoCard}>
          <Text style={[styles.bentoNumber, { color: colors.statusInProgress }]}>
            {stats.inProgress}
          </Text>
          <Text style={styles.bentoLabel}>Đang làm</Text>
        </View>

        <View style={styles.bentoCard}>
          <Text style={[styles.bentoNumber, { color: colors.statusDone }]}>{stats.done}</Text>
          <Text style={styles.bentoLabel}>Hoàn thành</Text>
        </View>
      </View>

      {/* Status Filter Pills */}
      <View style={styles.filterTrack}>
        {filterTabs.map((tab) => {
          const isActive = statusFilter === tab.value;
          return (
            <TouchableOpacity
              key={tab.value}
              style={[styles.filterPill, isActive && styles.filterPillActive]}
              onPress={() => onFilterChange(tab.value)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                {tab.label}
              </Text>
              <View style={[styles.countBadge, isActive && styles.countBadgeActive]}>
                <Text style={[styles.countBadgeText, isActive && styles.countBadgeTextActive]}>
                  {tab.count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: colors.background,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  eyebrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  livePulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.statusDone,
  },
  eyebrowText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  plusIconWrap: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  bentoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  bentoCard: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  bentoNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  bentoLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  filterTrack: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 12,
    padding: 3,
    gap: 4,
  },
  filterPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 9,
    gap: 5,
  },
  filterPillActive: {
    backgroundColor: colors.surface,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterPillTextActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  countBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  countBadgeActive: {
    backgroundColor: colors.surfaceSubtle,
  },
  countBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
  },
  countBadgeTextActive: {
    color: colors.primary,
  },
});
