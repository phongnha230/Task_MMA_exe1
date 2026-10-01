import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Task, TaskPriority, TaskStatus } from '../types/task';
import { colors } from '../theme/colors';
import { styles } from './TaskCard.styles';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string, title: string) => void;
  onStatusChange: (task: Task, nextStatus: TaskStatus) => void;
}

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

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const isDone = task.status === 'Done';
  const isInProgress = task.status === 'In Progress';

  const priorityCfg = getPriorityConfig(task.priority);
  const statusCfg = getStatusConfig(task.status);

  return (
    <View style={[styles.outerContainer, isDone && styles.outerContainerDone]}>
      <View style={styles.card}>
        {/* Top bar: Status toggle & Title & Actions */}
        <View style={styles.topRow}>
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

          <View style={styles.titleArea}>
            <Text style={[styles.taskTitle, isDone && styles.taskTitleDone]} numberOfLines={2}>
              {task.title}
            </Text>
          </View>

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
