import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Share,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { teamService } from '../../services/teamService';
import { taskService } from '../../services/taskService';
import { TeamMember } from '../../types/team';
import { Task } from '../../types/task';
import { TaskCard } from '../../components/TaskCard';
import { TaskModal } from '../../components/TaskModal';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { colors } from '../../theme/colors';

type TeamDetailRouteProp = RouteProp<RootStackParamList, 'TeamDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const TeamDetailScreen: React.FC = () => {
  const route = useRoute<TeamDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { team } = route.params;

  const [activeTab, setActiveTab] = useState<'members' | 'tasks'>('tasks');
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);

  // Modal create/edit task for this team
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  useEffect(() => {
    const unsubMembers = teamService.subscribeTeamMembers(
      team.id,
      (data) => {
        setMembers(data);
        setLoadingMembers(false);
      },
      (err) => {
        console.error('Error fetching team members:', err);
        setLoadingMembers(false);
      }
    );

    const unsubTasks = taskService.subscribeTeamTasks(
      team.id,
      (data) => {
        setTasks(data);
        setLoadingTasks(false);
      },
      (err) => {
        console.error('Error fetching team tasks:', err);
        setLoadingTasks(false);
      }
    );

    return () => {
      unsubMembers();
      unsubTasks();
    };
  }, [team.id]);

  const handleShareCode = async () => {
    try {
      await Share.share({
        message: `Mời bạn tham gia nhóm "${team.name}" trên Task Management App với mã: ${team.code}`,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenChat = () => {
    navigation.navigate('Chat', { teamId: team.id, teamName: team.name });
  };

  const renderMemberItem = ({ item }: { item: TeamMember }) => {
    const isOwner = item.role === 'owner';
    return (
      <View style={styles.memberCard}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarInitial}>
            {item.userName ? item.userName.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>

        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{item.userName}</Text>
          <Text style={styles.memberEmail}>{item.userEmail}</Text>
        </View>

        <View style={[styles.roleBadge, isOwner ? styles.ownerRole : styles.memberRole]}>
          <Text style={[styles.roleText, isOwner ? styles.ownerRoleText : styles.memberRoleText]}>
            {isOwner ? 'Trưởng nhóm' : 'Thành viên'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Navigation Top Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="arrow-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.navTitleBox}>
          <Text style={styles.navTitle} numberOfLines={1}>
            {team.name}
          </Text>
          <Text style={styles.navSubtitle}>Mã nhóm: {team.code}</Text>
        </View>

        <TouchableOpacity style={styles.shareBtn} onPress={handleShareCode}>
          <Feather name="share-2" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Team Banner Info */}
      <View style={styles.bannerCard}>
        {!!team.description && <Text style={styles.bannerDesc}>{team.description}</Text>}

        {/* Quick CTA to Chat */}
        <TouchableOpacity style={styles.chatHeroBtn} onPress={handleOpenChat} activeOpacity={0.8}>
          <View style={styles.chatHeroLeft}>
            <View style={styles.chatIconWrap}>
              <Feather name="message-circle" size={18} color={colors.white} />
            </View>
            <View>
              <Text style={styles.chatHeroTitle}>Kênh Chat Nhóm</Text>
              <Text style={styles.chatHeroSub}>Nhắn tin thảo luận thời gian thực</Text>
            </View>
          </View>
          <Feather name="arrow-right" size={18} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Tabs Switcher: Tasks vs Members */}
      <View style={styles.tabsTrack}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'tasks' && styles.tabButtonActive]}
          onPress={() => setActiveTab('tasks')}
          activeOpacity={0.7}
        >
          <Feather
            name="check-square"
            size={15}
            color={activeTab === 'tasks' ? colors.primary : colors.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'tasks' && styles.tabTextActive]}>
            Công việc ({tasks.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'members' && styles.tabButtonActive]}
          onPress={() => setActiveTab('members')}
          activeOpacity={0.7}
        >
          <Feather
            name="users"
            size={15}
            color={activeTab === 'members' ? colors.primary : colors.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'members' && styles.tabTextActive]}>
            Thành viên ({members.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'tasks' ? (
        loadingTasks ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TaskCard
                task={item}
                onEdit={(t) => {
                  setTaskToEdit(t);
                  setTaskModalVisible(true);
                }}
                onDelete={async (id) => {
                  await taskService.deleteTask(id);
                }}
                onStatusChange={async (t, nextStatus) => {
                  await taskService.updateTask(t.id, { status: nextStatus });
                }}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Feather name="inbox" size={36} color={colors.textMuted} />
                <Text style={styles.emptyTitle}>Chưa có công việc nào trong nhóm</Text>
                <TouchableOpacity
                  style={styles.createTaskBtn}
                  onPress={() => {
                    setTaskToEdit(null);
                    setTaskModalVisible(true);
                  }}
                  activeOpacity={0.8}
                >
                  <Feather name="plus" size={16} color={colors.white} />
                  <Text style={styles.createTaskBtnText}>Giao việc đầu tiên</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )
      ) : loadingMembers ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item) => item.id}
          renderItem={renderMemberItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Task Modal for creating task for this team */}
      <TaskModal
        visible={taskModalVisible}
        taskToEdit={taskToEdit}
        defaultTeamId={team.id}
        defaultTeamName={team.name}
        teamMembers={members}
        onClose={() => {
          setTaskModalVisible(false);
          setTaskToEdit(null);
        }}
        onSubmitCreate={async (data) => {
          await taskService.createTask({
            ...data,
            teamId: team.id,
            teamName: team.name,
          });
        }}
        onSubmitUpdate={async (id, data) => {
          await taskService.updateTask(id, data);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    backgroundColor: colors.surface,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  navTitleBox: {
    flex: 1,
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  navSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginTop: 1,
  },
  shareBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerCard: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
  },
  bannerDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: 12,
  },
  chatHeroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  chatHeroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chatIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatHeroTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  chatHeroSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 1,
  },
  tabsTrack: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 12,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 12,
    padding: 3,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 9,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: colors.surface,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarInitial: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  memberEmail: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '600',
  },
  ownerRole: {
    backgroundColor: colors.primaryLight,
  },
  ownerRoleText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  memberRole: {
    backgroundColor: colors.surfaceSubtle,
  },
  memberRoleText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 10,
    marginBottom: 16,
  },
  createTaskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  createTaskBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
});
