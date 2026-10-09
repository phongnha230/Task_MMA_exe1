import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { teamService } from '../../services/teamService';
import { Team } from '../../types/team';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { colors } from '../../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const TeamsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { userProfile } = useAuth();

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [joinModalVisible, setJoinModalVisible] = useState(false);

  // Form states
  const [teamName, setTeamName] = useState('');
  const [teamDesc, setTeamDesc] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!userProfile) return;

    setLoading(true);
    const unsubscribe = teamService.subscribeUserTeams(
      userProfile.id,
      (data) => {
        setTeams(data);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching teams:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userProfile]);

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập tên nhóm.');
      return;
    }
    if (!userProfile) return;

    try {
      setSubmitting(true);
      await teamService.createTeam(
        { name: teamName.trim(), description: teamDesc.trim() },
        userProfile
      );
      setTeamName('');
      setTeamDesc('');
      setCreateModalVisible(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tạo nhóm.';
      Alert.alert('Lỗi', msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinTeam = async () => {
    if (!joinCode.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập mã tham gia nhóm.');
      return;
    }
    if (!userProfile) return;

    try {
      setSubmitting(true);
      const joinedTeam = await teamService.joinTeamByCode(joinCode.trim(), userProfile);
      setJoinCode('');
      setJoinModalVisible(false);
      Alert.alert('Thành công', `Bạn đã tham gia nhóm "${joinedTeam.name}".`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tham gia nhóm.';
      Alert.alert('Lỗi', msg);
    } finally {
      setSubmitting(false);
    }
  };

  const renderTeamCard = ({ item }: { item: Team }) => {
    const isOwner = userProfile?.id === item.ownerId;

    return (
      <TouchableOpacity
        style={styles.teamCard}
        onPress={() => navigation.navigate('TeamDetail', { team: item })}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardIconBox}>
            <Feather name="users" size={20} color={colors.primary} />
          </View>
          <View style={styles.cardTitleBox}>
            <Text style={styles.teamName} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.roleBadgeRow}>
              <View style={[styles.roleBadge, isOwner ? styles.ownerBadge : styles.memberBadge]}>
                <Text
                  style={[
                    styles.roleBadgeText,
                    isOwner ? styles.ownerBadgeText : styles.memberBadgeText,
                  ]}
                >
                  {isOwner ? 'Trưởng nhóm' : 'Thành viên'}
                </Text>
              </View>
              <Text style={styles.codeBadge}>Mã: {item.code}</Text>
            </View>
          </View>
          <Feather name="chevron-right" size={20} color={colors.textMuted} />
        </View>

        {!!item.description && (
          <Text style={styles.teamDesc} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        <View style={styles.cardFooter}>
          <View style={styles.footerInfo}>
            <Feather name="user" size={13} color={colors.textMuted} />
            <Text style={styles.footerText}>Tạo bởi: {item.ownerName || 'Trưởng nhóm'}</Text>
          </View>
          <View style={styles.chatAction}>
            <Text style={styles.chatActionText}>Chi tiết & Chat</Text>
            <Feather name="arrow-right" size={13} color={colors.primary} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.screenTitle}>Đội Nhóm</Text>
          <Text style={styles.screenSubtitle}>Cộng tác, chia sẻ công việc & thảo luận</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionBtnOutline}
            onPress={() => setJoinModalVisible(true)}
            activeOpacity={0.7}
          >
            <Feather name="log-in" size={15} color={colors.primary} />
            <Text style={styles.actionBtnOutlineText}>Nhập mã</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtnPrimary}
            onPress={() => setCreateModalVisible(true)}
            activeOpacity={0.8}
          >
            <Feather name="plus" size={16} color={colors.white} />
            <Text style={styles.actionBtnPrimaryText}>Tạo nhóm</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Đang tải danh sách nhóm...</Text>
        </View>
      ) : (
        <FlatList
          data={teams}
          keyExtractor={(item) => item.id}
          renderItem={renderTeamCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBox}>
                <Feather name="users" size={36} color={colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>Chưa tham gia nhóm nào</Text>
              <Text style={styles.emptySubtitle}>
                Hãy tạo nhóm mới hoặc nhập mã để tham gia cùng đồng đội.
              </Text>
              <View style={styles.emptyBtnRow}>
                <TouchableOpacity
                  style={styles.emptyBtnPrimary}
                  onPress={() => setCreateModalVisible(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.emptyBtnPrimaryText}>Tạo nhóm mới</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.emptyBtnSecondary}
                  onPress={() => setJoinModalVisible(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.emptyBtnSecondaryText}>Nhập mã nhóm</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
        />
      )}

      {/* Modal Tạo Nhóm */}
      <Modal visible={createModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tạo Nhóm Mới</Text>
              <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                <Feather name="x" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputBlock}>
              <Text style={styles.inputLabel}>Tên nhóm *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ví dụ: Đội Phát Triển Mobile"
                placeholderTextColor={colors.textMuted}
                value={teamName}
                onChangeText={setTeamName}
              />
            </View>

            <View style={styles.inputBlock}>
              <Text style={styles.inputLabel}>Mô tả mục tiêu</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Mô tả tóm tắt về hoạt động của nhóm..."
                placeholderTextColor={colors.textMuted}
                value={teamDesc}
                onChangeText={setTeamDesc}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setCreateModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitBtn, submitting && styles.disabledBtn]}
                onPress={handleCreateTeam}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <Text style={styles.submitBtnText}>Tạo Nhóm</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Tham Gia Nhóm */}
      <Modal visible={joinModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tham Gia Bằng Mã</Text>
              <TouchableOpacity onPress={() => setJoinModalVisible(false)}>
                <Feather name="x" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputBlock}>
              <Text style={styles.inputLabel}>Mã nhóm (6 ký tự) *</Text>
              <TextInput
                style={[styles.textInput, styles.codeInput]}
                placeholder="VD: 7K9X2M"
                placeholderTextColor={colors.textMuted}
                value={joinCode}
                onChangeText={(text) => setJoinCode(text.toUpperCase())}
                autoCapitalize="characters"
                maxLength={6}
              />
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setJoinModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitBtn, submitting && styles.disabledBtn]}
                onPress={handleJoinTeam}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <Text style={styles.submitBtnText}>Tham Gia</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  screenSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 14,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtnOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: 6,
  },
  actionBtnOutlineText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  actionBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.primary,
    gap: 6,
  },
  actionBtnPrimaryText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
  teamCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
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
        elevation: 2,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitleBox: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  roleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  roleBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  ownerBadge: {
    backgroundColor: colors.primaryLight,
  },
  ownerBadgeText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  memberBadge: {
    backgroundColor: colors.surfaceSubtle,
  },
  memberBadgeText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  codeBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  teamDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  footerText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  chatAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chatActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyIconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
    maxWidth: 280,
  },
  emptyBtnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  emptyBtnPrimary: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyBtnPrimaryText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  emptyBtnSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyBtnSecondaryText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  inputBlock: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textPrimary,
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  codeInput: {
    letterSpacing: 4,
    fontWeight: '800',
    textAlign: 'center',
    fontSize: 18,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  cancelBtnText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  submitBtn: {
    flex: 1.5,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  disabledBtn: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
