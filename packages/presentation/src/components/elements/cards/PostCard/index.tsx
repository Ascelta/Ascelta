import React, { useEffect } from 'react';
import { MessageSquare, Repeat, Share, Star } from '@tamagui/lucide-icons';
import { Text, XStack, YStack } from 'tamagui';
import { PostLayout } from '@core/presentation/components/parts/posts/PostLayout';
import { useAuth } from '@core/presentation/contexts/AuthContext';
import { useUserStore } from '@core/presentation/stores/userStore';

const iconSize = 16;

export const PostCard: React.FC = () => {
  const { userId } = useAuth();
  const fetchUser = useUserStore(state => state.fetchUser);
  const userData = useUserStore(state => (userId ? state.userMap[userId] : undefined));
  const vUserDetail = userData?.data?.vUserDetail;

  useEffect(() => {
    if (userId && !userData) {
      fetchUser(userId).catch(console.error);
    }
  }, [userId, userData]); // fetchUserは意図的に依存配列から除外

  const content = (
    <Text lineHeight={18}>
      本文本本文本文本文本文本文本文本文本本文本本文本文本文本文本文本文本文本本文本本文本文本文本文本文本文本文本文本本文本文本文本文本文本文本文本
    </Text>
  );

  const actions = (
    <XStack flex={1} gap='$4' alignItems='center'>
      <XStack flex={3} gap='$1.5' alignItems='center'>
        <MessageSquare size={iconSize} color='$subtle' />
        <Text color='$subtle' fontSize='$3.5'>
          1000万
        </Text>
      </XStack>
      <XStack flex={3} gap='$1.5' alignItems='center'>
        <Repeat size={iconSize} color='$subtle' />
        <Text fontSize='$3.5' color='$subtle'>
          1000万
        </Text>
      </XStack>
      <XStack flex={3} gap='$1.5' alignItems='center'>
        <Star size={iconSize} color='$subtle' />
        <Text fontSize='$3.5' color='$subtle'>
          1000万
        </Text>
      </XStack>
      <XStack flex={1}>
        <YStack flex={1} alignItems='flex-end'>
          <Share size={iconSize} color='$subtle' />
        </YStack>
      </XStack>
    </XStack>
  );

  return (
    <PostLayout
      userDetail={vUserDetail}
      isLoading={userData?.isLoading ?? true}
      content={content}
      actions={actions}
      timestamp="1時間前"
      showMenu={true}
    />
  );
};
