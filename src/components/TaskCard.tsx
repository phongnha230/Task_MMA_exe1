import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Task, TaskPriority, TaskStatus } from '../types/task';
import { colors } from '../theme/colors';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string, title: string) => void;
  onStatusChange: (task: Task, nextStatus: TaskStatus) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const isDone = task.status === 'Done';
  const isInProgress = task.status === 'In Progress';

  const getPriorityConfig = (priority: TaskPriority) => {
    switch (priority) {
      case 'High':
        return {
          color: colors.priorityHigh,
          bg: colors.priorityHighBg,
          border: colors.priorityHighBorder,
          label: 'High',
        };
      case 'Low':
        return {
          color: colors.priorityLow,
          bg: colors.priorityLowBg,
          border: colors.priorityLowBorder,
          label: 'Low',
        };
      default:
        return {
          color: colors.priorityMedium,
          bg: colors.priorityMediumBg,
          border: colors.priorityMediumBorder,
          label: 'Medium',
        };
    }
  };

  const getStatusConfig = (status: TaskStatus) => {
    switch (status) {
      case 'Done':
        return {
          color: colors.statusDone,
          bg: colors.statusDoneBg,
          border: colors.statusDoneBorder,
          label: 'Done',
        };
      case 'In Progress':
        return {
          color: colors.statusInProgress,
          bg: colors.statusInProgressBg,
          border: colors.statusInProgressBorder,
          label: 'In Progress',
        };
      default:
        return {
          color: colors.statusTodo,
          bg: colors.statusTodoBg,
          border: colors.statusTodoBorder,
          label: 'To Do',
        };
    }
  };

  const getNextStatus = (current: TaskStatus): TaskStatus => {
    if (current === 'To Do') return 'In Progress';
    if (current === 'In Progress') return 'Done';
    return 'To Do';
  };

  const priorityCfg = getPriorityConfig(task.priority);
  const statusCfg = getStatusConfig(task.status);

  return (
    <View style={[styles.outerContainer, isDone && styles.outerContainerDone]}>
      <View style={styles.card}>
        {/* Top bar: Status toggle & Title & Actions */}
        <View style={styles.topRow}>
          {/* Circular check trigger */}
          <TouchableOpacity
            style={[
              styles.checkboxCircle,
              isDone && styles.checkboxCircleDone,
              isInProgress && styles.checkboxCircleInProgress,
            ]}
            onPress={() => onStatusChange(task, isDone ? 'To Do' : 'Done')}
            activeOpacity={0.7}
          >
            {isDone ? (
              <Feather name="check" size={13} color={colors.white} />
            ) : isInProgress ? (
              <View style={styles.inProgressDot} />
            ) : null}
          </TouchableOpacity>

          {/* Title and metadata */}
          <View style={styles.titleArea}>
            <Text style={[styles.taskTitle, isDone && styles.taskTitleDone]} numberOfLines={2}>
              {task.title}
            </Text>
          </View>

          {/* Quick action buttons */}
          <View style={styles.actionGroup}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => onEdit(task)}
              activeOpacity={0.6}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather name="edit-3" size={15} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconBtn, styles.deleteBtn]}
              onPress={() => onDelete(task.id, task.title)}
              activeOpacity={0.6}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather name="trash-2" size={15} color={colors.danger} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Description body */}
        {!!task.description && (
          <Text style={[styles.taskDesc, isDone && styles.taskDescDone]} numberOfLines={2}>
            {task.description}
          </Text>
        )}

        {/* Bottom Metadata Pills */}
        <View style={styles.bottomRow}>
          <View style={styles.pillsContainer}>
            {/* Status toggle pill */}
            <TouchableOpacity
              style={[
                styles.pill,
                { backgroundColor: statusCfg.bg, borderColor: statusCfg.border },
              ]}
              onPress={() => onStatusChange(task, getNextStatus(task.status))}
              activeOpacity={0.7}
            >
              <View style={[styles.statusDot, { backgroundColor: statusCfg.color }]} />
              <Text style={[styles.pillText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
            </TouchableOpacity>

            {/* Priority pill */}
            <View
              style={[
                styles.pill,
                { backgroundColor: priorityCfg.bg, borderColor: priorityCfg.border },
              ]}
            >
              <View style={[styles.priorityIndicator, { backgroundColor: priorityCfg.color }]} />
              <Text style={[styles.pillText, { color: priorityCfg.color }]}>
                {priorityCfg.label}
              </Text>
            </View>
          </View>

          {/* Due date indicator */}
          <View style={styles.dateBadge}>
            <Feather
              name="calendar"
              size={12}
              color={task.dueDate ? colors.primary : colors.textMuted}
            />
            <Text
              style={[
                styles.dateText,
                !!task.dueDate && { color: colors.primary, fontWeight: '600' },
              ]}
            >
              {task.dueDate
                ? task.dueDate
                : new Date(task.createdAt).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                  })}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 1.5,
      },
    }),
  },
  outerContainerDone: {
    backgroundColor: '#FAFBFD',
    borderColor: colors.borderSubtle,
    opacity: 0.8,
  },
  card: {
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxCircleInProgress: {
    borderColor: colors.statusInProgress,
    backgroundColor: colors.statusInProgressBg,
  },
  checkboxCircleDone: {
    borderColor: colors.statusDone,
    backgroundColor: colors.statusDone,
  },
  inProgressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.statusInProgress,
  },
  titleArea: {
    flex: 1,
    paddingRight: 8,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 21,
    letterSpacing: -0.2,
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: colors.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    backgroundColor: colors.dangerBg,
  },
  taskDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 8,
    paddingLeft: 34,
  },
  taskDescDone: {
    color: colors.textMuted,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingLeft: 34,
  },
  pillsContainer: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
    borderWidth: 1,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
});
