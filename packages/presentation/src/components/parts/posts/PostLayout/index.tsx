import React from 'react';
import { MoreHorizontal, X } from '@tamagui/lucide-icons';
import { Button, Image, ScrollView, Text, View, XStack, YStack } from 'tamagui';
import { UserAvatar } from '@core/presentation/components/elements/avatars/UserAvatar';
import { UserInfo } from '@core/presentation/components/elements/users/UserInfo';
import { VUserDetails } from '@core/domain/types/database';

type Props = {
  userDetail: VUserDetails | undefined;
  content: React.ReactNode;
  actions?: React.ReactNode;
  metadata?: React.ReactNode;
  timestamp?: string;
  showMenu?: boolean;
  onMenuPress?: () => void;
  onAvatarPress?: () => void;
  paddingVertical?: string;
  isLoading?: boolean;
  images?: string[];
  onRemoveImage?: (index: number) => void;
  showRemoveButton?: boolean;
};

export const PostLayout: React.FC<Props> = ({
  userDetail,
  content,
  actions,
  metadata,
  timestamp,
  showMenu = false,
  onMenuPress,
  onAvatarPress = () => {},
  paddingVertical = '$2.5',
  isLoading = false,
  images,
  onRemoveImage,
  showRemoveButton = false,
}) => {
  return (
    <XStack flex={1} gap='$3' paddingHorizontal='$3' paddingVertical={paddingVertical} justifyContent='flex-start' alignItems='flex-start'>
      <UserAvatar size='$3' avatarUrl={userDetail?.avatar_url} isLoading={isLoading || !userDetail} onPress={onAvatarPress} />
      <YStack flex={1} gap='$1' justifyContent='flex-start' alignItems='flex-start'>
        <XStack gap='$2' flex={1} alignItems='center' height='$1'>
          <XStack gap='$2' flex={1} alignItems='center'>
            <UserInfo displayName={userDetail?.display_name || ''} screenName={userDetail?.screen_name || ''} />
            {timestamp && (
              <>
                <Text color='$subtle'>{timestamp}</Text>
              </>
            )}
          </XStack>
          {metadata && <XStack>{metadata}</XStack>}
          {showMenu && (
            <XStack>
              <YStack justifyContent='space-between' alignItems='flex-end'>
                <MoreHorizontal size={20} color='$subtle' onPress={onMenuPress} />
              </YStack>
            </XStack>
          )}
        </XStack>
        <YStack flex={1} gap='$2' width='100%'>
          {content}

          {images && images.length > 0 && (
            <YStack gap='$2'>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <XStack gap='$2'>
                  {images.map((imageUri: string, index: number) => (
                    <View key={index} position='relative'>
                      <View width={120} height={120} borderRadius='$3' overflow='hidden' borderWidth={1} borderColor='$borderColor'>
                        <Image src={imageUri} width='100%' height='100%' objectFit='cover' />
                      </View>
                      {showRemoveButton && onRemoveImage && (
                        <Button
                          size='$2'
                          circular
                          position='absolute'
                          top={-5}
                          right={-5}
                          backgroundColor='$error'
                          color='white'
                          onPress={() => onRemoveImage(index)}
                          padding={0}
                          minHeight={24}
                          minWidth={24}
                        >
                          <X size={14} />
                        </Button>
                      )}
                    </View>
                  ))}
                </XStack>
              </ScrollView>
            </YStack>
          )}
          {actions && actions}
        </YStack>
      </YStack>
    </XStack>
  );
};
