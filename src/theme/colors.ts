/**
 * Linear & Apple-inspired Design System Tokens
 * Focused on high-contrast typography, hairline borders, and subtle accent hues.
 */
export const colors = {
  // Brand Accents
  primary: '#4F46E5', // Modern Indigo
  primaryHover: '#4338CA',
  primaryLight: '#EEF2FF',
  primaryText: '#4338CA',

  // Surfaces & Backgrounds
  background: '#F8FAFC', // Slate-50 canvas
  surface: '#FFFFFF', // Pure white card
  card: '#FFFFFF', // Alias for backward compatibility
  surfaceSubtle: '#F1F5F9', // Slate-100 container
  surfaceHighlight: '#F8FAFC',

  // Typography
  textPrimary: '#0F172A', // Slate-900 (High contrast)
  textSecondary: '#475569', // Slate-600
  textMuted: '#94A3B8', // Slate-400
  textInverse: '#FFFFFF',

  // Borders & Hairlines
  border: '#E2E8F0', // Slate-200
  borderSubtle: '#F1F5F9', // Slate-100
  borderFocus: '#6366F1',

  // Status tokens (Linear-tier)
  statusTodo: '#64748B',
  statusTodoBg: '#F1F5F9',
  statusTodoBorder: '#E2E8F0',

  statusInProgress: '#2563EB',
  statusInProgressBg: '#EFF6FF',
  statusInProgressBorder: '#BFDBFE',

  statusDone: '#059669',
  statusDoneBg: '#ECFDF5',
  statusDoneBorder: '#A7F3D0',

  // Priority tokens
  priorityLow: '#10B981',
  priorityLowBg: '#F0FDF4',
  priorityLowBorder: '#BBF7D0',
  badgeLow: '#F0FDF4',

  priorityMedium: '#D97706',
  priorityMediumBg: '#FFFBEB',
  priorityMediumBorder: '#FDE68A',
  badgeMedium: '#FFFBEB',

  priorityHigh: '#E11D48',
  priorityHighBg: '#FFF1F2',
  priorityHighBorder: '#FECDD3',
  badgeHigh: '#FFF1F2',

  // Feedback & Utility
  danger: '#E11D48',
  dangerBg: '#FFF1F2',
  dangerBorder: '#FECDD3',
  warning: '#D97706',
  success: '#059669',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(15, 23, 42, 0.45)',
};
