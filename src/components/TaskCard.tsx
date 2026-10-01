import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Task, TaskPriority, TaskStatus } from '../types/task';
import { colors } from '../theme/colors';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string, title: string) => void;
  onStatusChange: (task: Task, nextStatus: TaskStatus) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'High':
        return { bg: colors.priorityHighBg, text: colors.priorityHigh, label: 'High Priority' };
      case 'Low':
        return { bg: colors.priorityLowBg, text: colors.priorityLow, label: 'Low Priority' };
      default:
        return {
          bg: colors.priorityMediumBg,
          text: colors.priorityMedium,
          label: 'Medium Priority',
        };
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'Done':
        return { bg: colors.statusDoneBg, text: colors.statusDone, label: 'Done' };
      case 'In Progress':
        return {
          bg: colors.statusInProgressBg,
          text: colors.statusInProgress,
          label: 'In Progress',
        };
      default:
        return { bg: colors.statusTodoBg, text: colors.statusTodo, label: 'To Do' };
    }
  };

  const getNextStatus = (current: TaskStatus): TaskStatus => {
    if (current === 'To Do') return 'In Progress';
    if (current === 'In Progress') return 'Done';
    return 'To Do';
  };

  const priorityStyle = getPriorityBadge(task.priority);
  const statusStyle = getStatusBadge(task.status);
  const isDone = task.status === 'Done';

  return (
    <View style={[styles.card, isDone && styles.cardDone]}>
      <View style={styles.headerRow}>
        {/* Status quick toggle */}
        <TouchableOpacity
          style={[
            styles.statusToggle,
            task.status === 'Done' && styles.statusToggleDone,
            task.status === 'In Progress' && styles.statusToggleInProgress,
          ]}
          onPress={() => onStatusChange(task, getNextStatus(task.status))}
          activeOpacity={0.7}
        >
          <Text style={styles.statusToggleIcon}>
            {task.status === 'Done' ? '✓' : task.status === 'In Progress' ? '⏳' : '○'}
          </Text>
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={[styles.title, isDone && styles.titleDone]} numberOfLines={2}>
            {task.title}
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onEdit(task)}
            accessibilityLabel="Edit Task"
          >
            <Text style={styles.actionIcon}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteActionButton]}
            onPress={() => onDelete(task.id, task.title)}
            accessibilityLabel="Delete Task"
          >
            <Text style={styles.actionIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Description */}
      {!!task.description && (
        <Text style={[styles.description, isDone && styles.descriptionDone]} numberOfLines={3}>
          {task.description}
        </Text>
      )}

      {/* Metadata Badges */}
      <View style={styles.footerRow}>
        <View style={styles.badgesWrapper}>
          {/* Status badge */}
          <TouchableOpacity
            style={[styles.badge, { backgroundColor: statusStyle.bg }]}
            onPress={() => onStatusChange(task, getNextStatus(task.status))}
          >
            <Text style={[styles.badgeText, { color: statusStyle.text }]}>{statusStyle.label}</Text>
          </TouchableOpacity>

          {/* Priority badge */}
          <View style={[styles.badge, { backgroundColor: priorityStyle.bg }]}>
            <Text style={[styles.badgeText, { color: priorityStyle.text }]}>
              {priorityStyle.label}
            </Text>
          </View>
        </View>

        {/* Due date or created date */}
        {task.dueDate ? (
          <Text style={styles.dateText}>📅 Due: {task.dueDate}</Text>
        ) : (
          <Text style={styles.dateText}>
            {new Date(task.createdAt).toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardDone: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.85,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  statusToggle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  statusToggleInProgress: {
    borderColor: colors.statusInProgress,
    backgroundColor: colors.statusInProgressBg,
  },
  statusToggleDone: {
    borderColor: colors.statusDone,
    backgroundColor: colors.statusDone,
  },
  statusToggleIcon: {
    fontSize: 12,
    color: colors.white,
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 22,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  deleteActionButton: {
    backgroundColor: colors.dangerBg,
  },
  actionIcon: {
    fontSize: 14,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 10,
    paddingLeft: 36,
  },
  descriptionDone: {
    color: colors.textMuted,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingLeft: 36,
  },
  badgesWrapper: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
});
