import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { colors } from '../theme/colors';

interface DueDatePickerProps {
  value: string;
  onChange: (formattedDate: string) => void;
}

const formatDateTime = (date: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const parseDateString = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const parsed = new Date(dateStr.replace(' ', 'T'));
  return isNaN(parsed.getTime()) ? null : parsed;
};

export const DueDatePicker: React.FC<DueDatePickerProps> = ({ value, onChange }) => {
  const [showIosPicker, setShowIosPicker] = useState(false);

  const handleOpenPicker = () => {
    const baseDate = parseDateString(value) || new Date();

    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: baseDate,
        mode: 'date',
        is24Hour: true,
        onValueChange: (_event, selectedDate: Date) => {
          DateTimePickerAndroid.open({
            value: selectedDate,
            mode: 'time',
            is24Hour: true,
            onValueChange: (_timeEvent, selectedTime: Date) => {
              const finalDate = new Date(selectedDate);
              finalDate.setHours(selectedTime.getHours());
              finalDate.setMinutes(selectedTime.getMinutes());
              onChange(formatDateTime(finalDate));
            },
            onDismiss: () => {
              onChange(formatDateTime(selectedDate));
            },
          });
        },
        onDismiss: () => {},
      });
    } else {
      setShowIosPicker(true);
    }
  };

  const handleQuickSelect = (type: 'today' | 'tomorrow' | 'nextWeek') => {
    const d = new Date();
    if (type === 'today') {
      d.setHours(18, 0, 0, 0);
    } else if (type === 'tomorrow') {
      d.setDate(d.getDate() + 1);
      d.setHours(9, 0, 0, 0);
    } else if (type === 'nextWeek') {
      d.setDate(d.getDate() + 7);
      d.setHours(9, 0, 0, 0);
    }
    onChange(formatDateTime(d));
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.fieldLabel}>Hạn hoàn thành (Due Date)</Text>
        {!!value && (
          <TouchableOpacity
            onPress={() => onChange('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.clearDateText}>Xoá hạn</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={[styles.inputBox, !!value && styles.inputBoxActive]}
        onPress={handleOpenPicker}
        activeOpacity={0.7}
      >
        <View style={styles.iconWrap}>
          <Feather
            name="calendar"
            size={16}
            color={value ? colors.primary : colors.textSecondary}
          />
        </View>

        <Text style={[styles.displayText, !value && styles.placeholderText]}>
          {value || 'Chạm để chọn ngày & giờ...'}
        </Text>

        <Feather
          name="clock"
          size={15}
          color={value ? colors.primary : colors.textMuted}
          style={styles.clockIcon}
        />
      </TouchableOpacity>

      {/* Quick shortcut chips */}
      <View style={styles.quickDateRow}>
        <TouchableOpacity
          style={styles.quickChip}
          onPress={() => handleQuickSelect('today')}
          activeOpacity={0.7}
        >
          <Text style={styles.quickChipText}>Hôm nay 18:00</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickChip}
          onPress={() => handleQuickSelect('tomorrow')}
          activeOpacity={0.7}
        >
          <Text style={styles.quickChipText}>Ngày mai 09:00</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickChip}
          onPress={() => handleQuickSelect('nextWeek')}
          activeOpacity={0.7}
        >
          <Text style={styles.quickChipText}>+7 ngày</Text>
        </TouchableOpacity>
      </View>

      {/* iOS Modal fallback */}
      {showIosPicker && (
        <View style={styles.iosPickerContainer}>
          <DateTimePicker
            value={parseDateString(value) || new Date()}
            mode="datetime"
            display="spinner"
            onChange={(_event: DateTimePickerEvent, selectedDate?: Date) => {
              if (selectedDate) {
                onChange(formatDateTime(selectedDate));
              }
            }}
          />
          <TouchableOpacity
            style={styles.iosDoneBtn}
            onPress={() => setShowIosPicker(false)}
          >
            <Text style={styles.iosDoneBtnText}>Xong</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  clearDateText: {
    fontSize: 12,
    color: colors.danger,
    fontWeight: '600',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
  },
  inputBoxActive: {
    borderColor: colors.primary,
    backgroundColor: '#F0FDF4',
  },
  iconWrap: {
    paddingLeft: 12,
    paddingRight: 8,
  },
  displayText: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  placeholderText: {
    color: colors.textMuted,
    fontWeight: '400',
  },
  clockIcon: {
    marginRight: 14,
  },
  quickDateRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  quickChip: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickChipText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  iosPickerContainer: {
    marginTop: 10,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 12,
    padding: 8,
  },
  iosDoneBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
    borderRadius: 8,
    marginTop: 6,
  },
  iosDoneBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
});
