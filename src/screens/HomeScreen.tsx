import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  StatusBar,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTasks, StatusFilter } from '../hooks/useTasks';
import { CreateTaskInput, Task, TaskStatus, UpdateTaskInput } from '../types/task';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { colors } from '../theme/colors';

export const HomeScreen: React.FC = () => {
  const {
    tasks,
    loading,
    error,
    refreshing,
    statusFilter,
    setStatusFilter,
    stats,
    createTask,
    updateTask,
    deleteTask,
    handleRefresh,
  } = useTasks();

  const [modalVisible, setModalVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const handleOpenCreateModal = () => {
    setTaskToEdit(null);
    setModalVisible(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setTaskToEdit(task);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setTaskToEdit(null);
  };

  const handleSubmitCreate = async (input: CreateTaskInput) => {
    await createTask(input);
  };

  const handleSubmitUpdate = async (id: string, input: UpdateTaskInput) => {
    await updateTask(id, input);
  };

  const handleQuickStatusChange = async (task: Task, nextStatus: TaskStatus) => {
    try {
      await updateTask(task.id, { status: nextStatus });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể cập nhật trạng thái.';
      Alert.alert('Lỗi cập nhật', msg);
    }
  };

  const handleDeleteTask = (id: string, title: string) => {
    Alert.alert(
      'Xóa nhiệm vụ',
      `Bạn có chắc muốn xóa "${title}" không? Hành động này không thể hoàn tác.`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa vĩnh viễn',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(id);
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : 'Không thể xóa công việc.';
              Alert.alert('Lỗi', msg);
            }
          },
        },
      ]
    );
  };

  const filterTabs: { label: string; value: StatusFilter; count: number }[] = [
    { label: 'Tất cả', value: 'All', count: stats.total },
    { label: 'To Do', value: 'To Do', count: stats.todo },
    { label: 'In Progress', value: 'In Progress', count: stats.inProgress },
    { label: 'Done', value: 'Done', count: stats.done },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* TOP HEADER */}
      <View style={styles.header}>
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
            onPress={handleOpenCreateModal}
            activeOpacity={0.8}
          >
            <View style={styles.plusIconWrap}>
              <Feather name="plus" size={14} color={colors.primary} />
            </View>
            <Text style={styles.createButtonText}>Tạo mới</Text>
          </TouchableOpacity>
        </View>

        {/* BENTO STATS CARDS */}
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

        {/* STATUS FILTER PILLS */}
        <View style={styles.filterTrack}>
          {filterTabs.map((tab) => {
            const isActive = statusFilter === tab.value;
            return (
              <TouchableOpacity
                key={tab.value}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
                onPress={() => setStatusFilter(tab.value)}
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

      {/* TASK LIST OR FEEDBACK STATE */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Đang đồng bộ dữ liệu Firestore...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <View style={styles.errorIconWrap}>
            <Feather name="wifi-off" size={28} color={colors.danger} />
          </View>
          <Text style={styles.errorTitle}>Lỗi kết nối Firebase</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteTask}
              onStatusChange={handleQuickStatusChange}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Feather name="inbox" size={36} color={colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>
                {statusFilter === 'All'
                  ? 'Chưa có công việc nào'
                  : `Không có nhiệm vụ "${statusFilter}"`}
              </Text>
              <Text style={styles.emptyDesc}>
                Bắt đầu tổ chức công việc của bạn ngay bây giờ bằng cách thêm nhiệm vụ mới.
              </Text>
              <TouchableOpacity
                style={styles.emptyActionBtn}
                onPress={handleOpenCreateModal}
                activeOpacity={0.8}
              >
                <Feather name="plus" size={15} color={colors.primary} style={{ marginRight: 6 }} />
                <Text style={styles.emptyActionBtnText}>Thêm công việc đầu tiên</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* MODAL CREATE / EDIT */}
      <TaskModal
        visible={modalVisible}
        taskToEdit={taskToEdit}
        onClose={handleCloseModal}
        onSubmitCreate={handleSubmitCreate}
        onSubmitUpdate={handleSubmitUpdate}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
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
    gap: 6,
    marginBottom: 4,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  eyebrowText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.6,
  },
  appSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingLeft: 8,
    paddingRight: 14,
    paddingVertical: 7,
    borderRadius: 100,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.28,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  plusIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  createButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  bentoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  bentoCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  bentoNumber: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  bentoLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 2,
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
        shadowRadius: 3,
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
    borderRadius: 6,
    backgroundColor: colors.border,
  },
  countBadgeActive: {
    backgroundColor: colors.primaryLight,
  },
  countBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  countBadgeTextActive: {
    color: colors.primary,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: colors.textSecondary,
  },
  errorIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.dangerBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  errorText: {
    fontSize: 13,
    color: colors.danger,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
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
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  emptyDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
    maxWidth: 280,
  },
  emptyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyActionBtnText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});
