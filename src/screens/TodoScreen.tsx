import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTodos } from '../hooks/useTodos';
import { FilterStatus, Priority, Todo } from '../types/todo';
import { colors } from '../theme/colors';

export const TodoScreen: React.FC = () => {
  const { todos, loading, error, filter, setFilter, stats, addTodo, toggleTodo, deleteTodo } =
    useTodos();

  const [inputTitle, setInputTitle] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium');
  const [submitting, setSubmitting] = useState(false);

  const handleAddTodo = async () => {
    if (!inputTitle.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập nội dung công việc!');
      return;
    }

    try {
      setSubmitting(true);
      await addTodo(inputTitle, selectedPriority);
      setInputTitle('');
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Không thể thêm công việc.');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (id: string, title: string) => {
    Alert.alert('Xác nhận xóa', `Bạn có chắc chắn muốn xóa "${title}"?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => deleteTodo(id),
      },
    ]);
  };

  const getPriorityStyle = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return { bg: colors.badgeHigh, text: colors.priorityHigh, label: 'Cao' };
      case 'low':
        return { bg: colors.badgeLow, text: colors.priorityLow, label: 'Thấp' };
      default:
        return { bg: colors.badgeMedium, text: colors.priorityMedium, label: 'TB' };
    }
  };

  const renderTodoItem = ({ item }: { item: Todo }) => {
    const priorityInfo = getPriorityStyle(item.priority);

    return (
      <View style={styles.todoItemCard}>
        {/* Nút check hoàn thành */}
        <TouchableOpacity
          style={[styles.checkbox, item.isCompleted && styles.checkboxCompleted]}
          onPress={() => toggleTodo(item.id, item.isCompleted)}
        >
          {item.isCompleted && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>

        {/* Nội dung Todo */}
        <View style={styles.todoContent}>
          <Text style={[styles.todoTitle, item.isCompleted && styles.todoTitleCompleted]}>
            {item.title}
          </Text>
          <View style={styles.tagRow}>
            <View style={[styles.priorityBadge, { backgroundColor: priorityInfo.bg }]}>
              <Text style={[styles.priorityBadgeText, { color: priorityInfo.text }]}>
                Ưu tiên: {priorityInfo.label}
              </Text>
            </View>
            <Text style={styles.timeText}>
              {new Date(item.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>

        {/* Nút xóa */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => confirmDelete(item.id, item.title)}
        >
          <Text style={styles.deleteText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* HEADER & STATS */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Quản Lý Công Việc</Text>
          <Text style={styles.headerSubtitle}>Kiến trúc Mobile sạch với Firebase</Text>

          {/* Thanh thống kê */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Tổng số</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: colors.warning }]}>{stats.active}</Text>
              <Text style={styles.statLabel}>Đang làm</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: colors.success }]}>{stats.completed}</Text>
              <Text style={styles.statLabel}>Đã xong</Text>
            </View>
          </View>
        </View>

        {/* INPUT FORM */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Cần làm gì tiếp theo?..."
            placeholderTextColor={colors.textSecondary}
            value={inputTitle}
            onChangeText={setInputTitle}
            returnKeyType="done"
            onSubmitEditing={handleAddTodo}
          />

          <View style={styles.inputRow}>
            {/* Chọn độ ưu tiên */}
            <View style={styles.prioritySelector}>
              {(['low', 'medium', 'high'] as Priority[]).map((p) => {
                const isSelected = selectedPriority === p;
                const pInfo = getPriorityStyle(p);
                return (
                  <TouchableOpacity
                    key={p}
                    style={[styles.priorityOption, isSelected && { backgroundColor: pInfo.text }]}
                    onPress={() => setSelectedPriority(p)}
                  >
                    <Text
                      style={[
                        styles.priorityOptionText,
                        isSelected && { color: '#FFF', fontWeight: 'bold' },
                      ]}
                    >
                      {pInfo.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Nút thêm */}
            <TouchableOpacity
              style={[styles.addButton, submitting && { opacity: 0.6 }]}
              onPress={handleAddTodo}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.addButtonText}>+ Thêm</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* FILTER TABS */}
        <View style={styles.filterContainer}>
          {(['all', 'active', 'completed'] as FilterStatus[]).map((tab) => {
            const isTabActive = filter === tab;
            const labelMap = {
              all: 'Tất cả',
              active: 'Đang làm',
              completed: 'Đã xong',
            };
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.filterTab, isTabActive && styles.filterTabActive]}
                onPress={() => setFilter(tab)}
              >
                <Text style={[styles.filterTabText, isTabActive && styles.filterTabTextActive]}>
                  {labelMap[tab]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* LIST HOẶC LOADING */}
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Đang đồng bộ với Firebase...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        ) : (
          <FlatList
            data={todos}
            keyExtractor={(item) => item.id}
            renderItem={renderTodoItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>📋</Text>
                <Text style={styles.emptyText}>Chưa có công việc nào!</Text>
                <Text style={styles.emptySubText}>Hãy thêm công việc đầu tiên ở ô bên trên.</Text>
              </View>
            }
          />
        )}
      </KeyboardAvoidingView>
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
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingVertical: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: colors.border,
  },
  inputContainer: {
    marginHorizontal: 20,
    padding: 14,
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputRow: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prioritySelector: {
    flexDirection: 'row',
    gap: 6,
  },
  priorityOption: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  priorityOptionText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  filterContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    padding: 3,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 8,
  },
  filterTabActive: {
    backgroundColor: colors.card,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterTabText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  todoItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkmark: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  todoContent: {
    flex: 1,
  },
  todoTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  todoTitleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 6,
  },
  deleteText: {
    fontSize: 16,
    color: colors.danger,
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: colors.textSecondary,
    fontSize: 14,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  emptySubText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
