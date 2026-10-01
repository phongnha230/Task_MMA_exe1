import { StyleSheet, Platform } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
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
