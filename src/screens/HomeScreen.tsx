import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Alert,
  StatusBar,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { teamService } from '../services/teamService';
import { CreateTaskInput, Task, TaskStatus, UpdateTaskInput } from '../types/task';
import { Team } from '../types/team';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { HomeHeader } from '../components/HomeHeader';
import { EmptyTaskList } from '../components/EmptyTaskList';
import { colors } from '../theme/colors';

export const HomeScreen: React.FC = () => {
  const { userProfile } = useAuth();
  const {
    tasks,
    loading,
    error,
    refreshing,
    statusFilter,
    setStatusFilter,
    scopeFilter,
    setScopeFilter,
    stats,
    createTask,
    updateTask,
    deleteTask,
    handleRefresh,
  } = useTasks(userProfile?.id);

  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  useEffect(() => {
    if (!userProfile) return;
    const unsub = teamService.subscribeUserTeams(
      userProfile.id,
      (teams) => setUserTeams(teams),
      (err) => console.error(err)
    );
    return () => unsub();
  }, [userProfile]);

  const handleOpenCreateModal = useCallback(() => {
    setTaskToEdit(null);
    setModalVisible(true);
  }, []);

  const handleOpenEditModal = useCallback((task: Task) => {
    setTaskToEdit(task);
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setTaskToEdit(null);
  }, []);

  const handleSubmitCreate = useCallback(
    async (input: CreateTaskInput) => {
      await createTask(input);
    },
    [createTask]
  );

  const handleSubmitUpdate = useCallback(
    async (id: string, input: UpdateTaskInput) => {
      await updateTask(id, input);
    },
    [updateTask]
  );

  const handleQuickStatusChange = useCallback(
    async (task: Task, nextStatus: TaskStatus) => {
      try {
        await updateTask(task.id, { status: nextStatus });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Không thể cập nhật trạng thái.';
        Alert.alert('Lỗi cập nhật', msg);
      }
    },
    [updateTask]
  );

  const handleDeleteTask = useCallback(
    (id: string, title: string) => {
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
    },
    [deleteTask]
  );

  const keyExtractor = useCallback((item: Task) => item.id, []);

  const renderTaskItem = useCallback(
    ({ item }: { item: Task }) => (
      <TaskCard
        task={item}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteTask}
        onStatusChange={handleQuickStatusChange}
      />
    ),
    [handleOpenEditModal, handleDeleteTask, handleQuickStatusChange]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* HEADER SECTION TÁCH BIỆT: Gồm Brand, Chuyển Scope, Thống kê Bento, Bộ lọc Status */}
      <HomeHeader
        stats={stats}
        statusFilter={statusFilter}
        onFilterChange={setStatusFilter}
        scopeFilter={scopeFilter}
        onScopeChange={setScopeFilter}
        userDisplayName={userProfile?.name}
        onOpenCreate={handleOpenCreateModal}
      />

      {/* DANH SÁCH NHIỆM VỤ HOẶC TRẠNG THÁI CHỜ */}
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
          keyExtractor={keyExtractor}
          renderItem={renderTaskItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          maxToRenderPerBatch={10}
          windowSize={7}
          removeClippedSubviews={Platform.OS === 'android'}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <EmptyTaskList statusFilter={statusFilter} onOpenCreate={handleOpenCreateModal} />
          }
        />
      )}

      {/* Modal Tạo / Sửa công việc */}
      <TaskModal
        visible={modalVisible}
        taskToEdit={taskToEdit}
        availableTeams={userTeams}
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
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  errorIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.dangerBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  errorText: {
    fontSize: 13,
    color: colors.danger,
    textAlign: 'center',
    lineHeight: 18,
  },
});
