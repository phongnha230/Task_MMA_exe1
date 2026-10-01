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
import { CreateTaskInput, Task, TaskPriority, TaskStatus, UpdateTaskInput } from '../types/task';
import { colors } from '../theme/colors';

interface TaskModalProps {
  visible: boolean;
  taskToEdit?: Task | null;
  onClose: () => void;
  onSubmitCreate: (data: CreateTaskInput) => Promise<void>;
  onSubmitUpdate: (id: string, data: UpdateTaskInput) => Promise<void>;
}

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
      setErrorMessage('Tiêu đề công việc là bắt buộc!');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');

      if (isEditMode && taskToEdit) {
        await onSubmitUpdate(taskToEdit.id, {
          title: title.trim(),
          description: description.trim(),
          status,
          priority,
          dueDate: dueDate.trim() || null,
        });
      } else {
        await onSubmitCreate({
          title: title.trim(),
          description: description.trim(),
          status,
          priority,
          dueDate: dueDate.trim() || null,
        });
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

  const statusOptions: TaskStatus[] = ['To Do', 'In Progress', 'Done'];
  const priorityOptions: TaskPriority[] = ['Low', 'Medium', 'High'];

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isEditMode ? 'Chỉnh Sửa Công Việc' : 'Tạo Công Việc Mới'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Error banner */}
            {!!errorMessage && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>⚠️ {errorMessage}</Text>
              </View>
            )}

            {/* Title field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Tiêu đề <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, !!errorMessage && !title.trim() && styles.inputError]}
                placeholder="Nhập tiêu đề công việc..."
                placeholderTextColor={colors.textMuted}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (errorMessage) setErrorMessage('');
                }}
              />
            </View>

            {/* Description field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Mô tả chi tiết</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Nhập mô tả thêm (không bắt buộc)..."
                placeholderTextColor={colors.textMuted}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Status Selector */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Trạng thái</Text>
              <View style={styles.chipsRow}>
                {statusOptions.map((opt) => {
                  const selected = status === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.chip, selected && styles.chipSelectedPrimary]}
                      onPress={() => setStatus(opt)}
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Priority Selector */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Độ ưu tiên</Text>
              <View style={styles.chipsRow}>
                {priorityOptions.map((opt) => {
                  const selected = priority === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.chip, selected && styles.chipSelectedWarning]}
                      onPress={() => setPriority(opt)}
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Due Date field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Hạn chót (Due Date)</Text>
              <TextInput
                style={styles.input}
                placeholder="VD: 2026-10-15 hoặc Ngày mai"
                placeholderTextColor={colors.textMuted}
                value={dueDate}
                onChangeText={setDueDate}
              />
            </View>

            {/* Submit & Cancel Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose} disabled={loading}>
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <Text style={styles.submitButtonText}>{isEditMode ? 'Cập Nhật' : 'Tạo Mới'}</Text>
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
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  closeBtn: {
    padding: 6,
  },
  closeBtnText: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  errorBanner: {
    backgroundColor: colors.dangerBg,
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  errorBannerText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  requiredAsterisk: {
    color: colors.danger,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.danger,
  },
  textArea: {
    minHeight: 80,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  chipSelectedPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipSelectedWarning: {
    backgroundColor: colors.priorityMedium,
    borderColor: colors.priorityMedium,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: colors.white,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  submitButton: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
});
