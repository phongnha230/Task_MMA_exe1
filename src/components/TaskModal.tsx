import React, { useState, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CreateTaskInput, Task, TaskPriority, TaskStatus, UpdateTaskInput } from '../types/task';
import { colors } from '../theme/colors';
import { DueDatePicker } from './DueDatePicker';
import { SegmentedControl, SegmentOption } from './SegmentedControl';

interface TaskModalProps {
  visible: boolean;
  taskToEdit?: Task | null;
  onClose: () => void;
  onSubmitCreate: (data: CreateTaskInput) => Promise<void>;
  onSubmitUpdate: (id: string, data: UpdateTaskInput) => Promise<void>;
}

const statusOptions: SegmentOption<TaskStatus>[] = [
  { label: 'To Do', value: 'To Do', color: colors.statusTodo },
  { label: 'In Progress', value: 'In Progress', color: colors.statusInProgress },
  { label: 'Done', value: 'Done', color: colors.statusDone },
];

const priorityOptions: SegmentOption<TaskPriority>[] = [
  { label: 'Low', value: 'Low', color: colors.priorityLow },
  { label: 'Medium', value: 'Medium', color: colors.priorityMedium },
  { label: 'High', value: 'High', color: colors.priorityHigh },
];

export const TaskModal: React.FC<TaskModalProps> = ({
  visible,
  taskToEdit,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
}) => {
  const isEditMode = !!taskToEdit;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('To Do');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setStatus(taskToEdit.status);
      setPriority(taskToEdit.priority);
      setDueDate(taskToEdit.dueDate || '');
    } else {
      resetForm();
    }
    setErrorMessage('');
  }, [taskToEdit, visible]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('To Do');
    setPriority('Medium');
    setDueDate('');
    setErrorMessage('');
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setErrorMessage('Tiêu đề công việc không được để trống.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');

      const payload = {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        dueDate: dueDate.trim() || null,
      };

      if (isEditMode && taskToEdit) {
        await onSubmitUpdate(taskToEdit.id, payload);
      } else {
        await onSubmitCreate(payload);
      }

      onClose();
      resetForm();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Đã xảy ra lỗi khi lưu công việc.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity style={styles.backdropDismiss} activeOpacity={1} onPress={onClose} />

        <View style={styles.sheetContainer}>
          {/* Thanh kéo trang trí */}
          <View style={styles.dragHandle} />

          {/* Tiêu đề Modal */}
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>
                {isEditMode ? 'Chỉnh sửa công việc' : 'Tạo công việc mới'}
              </Text>
              <Text style={styles.sheetSubtitle}>
                {isEditMode ? 'Cập nhật tiến độ & thông tin' : 'Thêm nhiệm vụ vào bảng theo dõi'}
              </Text>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeCircle} activeOpacity={0.7}>
              <Feather name="x" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formScroll}>
            {/* Banner hiển thị lỗi nếu có */}
            {!!errorMessage && (
              <View style={styles.errorBanner}>
                <Feather name="alert-triangle" size={14} color={colors.danger} />
                <Text style={styles.errorBannerText}>{errorMessage}</Text>
              </View>
            )}

            {/* Tiêu đề */}
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>
                Tiêu đề nhiệm vụ <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={[styles.textInput, !!errorMessage && !title.trim() && styles.inputError]}
                placeholder="Ví dụ: Thiết kế giao diện mobile..."
                placeholderTextColor={colors.textMuted}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (errorMessage) setErrorMessage('');
                }}
              />
            </View>

            {/* Ghi chú chi tiết */}
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Ghi chú chi tiết</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Mô tả các bước cần thực hiện (tuỳ chọn)..."
                placeholderTextColor={colors.textMuted}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Trạng thái công việc */}
            <SegmentedControl<TaskStatus>
              label="Trạng thái"
              options={statusOptions}
              selectedValue={status}
              onSelect={setStatus}
            />

            {/* Mức độ ưu tiên */}
            <SegmentedControl<TaskPriority>
              label="Mức độ ưu tiên"
              options={priorityOptions}
              selectedValue={priority}
              onSelect={setPriority}
            />

            {/* Hạn hoàn thành (Due Date Picker trực quan) */}
            <DueDatePicker value={dueDate} onChange={setDueDate} />

            {/* Hàng nút bấm Hành động */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
                disabled={loading}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Huỷ bỏ</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <View style={styles.submitInnerRow}>
                    <Feather name={isEditMode ? 'check' : 'plus'} size={16} color={colors.white} />
                    <Text style={styles.submitButtonText}>
                      {isEditMode ? 'Lưu thay đổi' : 'Tạo nhiệm vụ'}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  backdropDismiss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheetContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  sheetSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formScroll: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerBg,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    gap: 8,
  },
  errorBannerText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  fieldBlock: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  asterisk: {
    color: colors.danger,
  },
  textInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.danger,
  },
  textArea: {
    minHeight: 76,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
    marginBottom: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  submitButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
});
