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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa công việc "${title}" không? Hành động này không thể hoàn tác.`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
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

  const filterTabs: StatusFilter[] = ['All', 'To Do', 'In Progress', 'Done'];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* HEADER SECTION */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.appTitle}>Task Manager</Text>
            <Text style={styles.appSubtitle}>Quản lý công việc hiệu quả • Firebase Firestore</Text>
          </View>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleOpenCreateModal}
            activeOpacity={0.8}
          >
            <Text style={styles.createButtonIcon}>＋</Text>
            <Text style={styles.createButtonText}>Tạo mới</Text>
          </TouchableOpacity>
        </View>

        {/* METRICS / STATS OVERVIEW */}
        <View style={styles.statsCard}>
          <View style={styles.statCol}>
            <Text style={styles.statCount}>{stats.total}</Text>
            <Text style={styles.statLabel}>Tổng số</Text>
          </View>
          <View style={styles.statSeparator} />
          <View style={styles.statCol}>
            <Text style={[styles.statCount, { color: colors.statusTodo }]}>{stats.todo}</Text>
            <Text style={styles.statLabel}>To Do</Text>
          </View>
          <View style={styles.statSeparator} />
          <View style={styles.statCol}>
            <Text style={[styles.statCount, { color: colors.statusInProgress }]}>
              {stats.inProgress}
            </Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statSeparator} />
          <View style={styles.statCol}>
            <Text style={[styles.statCount, { color: colors.statusDone }]}>{stats.done}</Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>
        </View>

        {/* STATUS FILTER PILLS */}
        <View style={styles.filterBar}>
          {filterTabs.map((tab) => {
            const isActive = statusFilter === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
                onPress={() => setStatusFilter(tab)}
              >
                <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                  {tab === 'All' ? 'Tất cả' : tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* TASK LIST SECTION */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Đang đồng bộ Firestore (Real-time)...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
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
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>📋</Text>
              <Text style={styles.emptyTitle}>
                {statusFilter === 'All'
                  ? 'Chưa có công việc nào'
                  : `Không có công việc thuộc "${statusFilter}"`}
              </Text>
              <Text style={styles.emptyDesc}>
                {'Nhấn vào nút "Tạo mới" ở góc trên để thêm công việc đầu tiên của bạn.'}
              </Text>
              <TouchableOpacity style={styles.emptyActionBtn} onPress={handleOpenCreateModal}>
                <Text style={styles.emptyActionBtnText}>＋ Thêm công việc ngay</Text>
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: colors.background,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
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
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  createButtonIcon: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  createButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 14,
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statCount: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  statSeparator: {
    width: 1,
    height: '60%',
    backgroundColor: colors.border,
  },
  filterBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  filterPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterPillTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
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
    fontSize: 14,
    color: colors.textSecondary,
  },
  errorIcon: {
    fontSize: 32,
    marginBottom: 8,
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
  emptyEmoji: {
    fontSize: 44,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  emptyActionBtn: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyActionBtnText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '700',
  },
});
