import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionSheetRef } from 'react-native-actions-sheet';
import { useRouter } from 'solito/router';
import { Separator, Spacer, Text, View, YStack } from 'tamagui';
import { UserAvatar } from '@core/presentation/components/elements/avatars/UserAvatar';
import { CloseButton } from '@core/presentation/components/elements/buttons/CloseButton';
import { ShimmerRectangle } from '@core/presentation/components/elements/loadings/Shimmer';
import { Header } from '@core/presentation/components/layouts/headers/Header';
import { useAuth } from '@core/presentation/contexts/AuthContext';
import { useUserStore } from '@core/presentation/stores/userStore';
import { EditProfileImageActionSheetModal } from '../../components/modals/EditProfileImageActionSheetModal';

export const ProfileEdit: React.FC = () => {
  const { t } = useTranslation();
  const { push } = useRouter();
  const { userId } = useAuth();
  const vUserDetail = useUserStore(state => (userId ? state.userMap[userId]?.data?.vUserDetail : undefined));
  const actionSheetRef = useRef<ActionSheetRef>(null);

  return (
    <>
      <YStack flex={1} justifyContent='space-between'>
        <Header title={t('EDIT_PROFILE')} leading={<CloseButton />} />
        <YStack flex={1} justifyContent='unset' paddingHorizontal='$4' paddingVertical='$6' gap='$4'>
          <View alignItems='center'>
            <YStack alignItems='center' gap='$3' onPress={() => actionSheetRef.current?.show()}>
              <UserAvatar size='$10' avatarUrl={vUserDetail?.avatar_url} isLoading={!vUserDetail} />
              <Text>{t('CHANGE_PHOTO')}</Text>
            </YStack>
          </View>
          <View borderWidth={1} borderRadius='$8' borderColor='$borderColor' padding='$4'>
            <YStack gap='$2.5'>
              <View onPress={() => push('/profile/edit/screen-name')}>
                <Text color='$subtle'>{t('USERNAME')}</Text>
                <Spacer size='$1' />
                <ShimmerRectangle visible={!!vUserDetail}>
                  <Text>{vUserDetail ? `@${vUserDetail.screen_name}` : null}</Text>
                </ShimmerRectangle>
              </View>
              <Separator />
              <View onPress={() => push('/profile/edit/display-name')}>
                <Text color='$subtle'>{t('DISPLAY_NAME')}</Text>
                <Spacer size='$1' />
                <ShimmerRectangle visible={!!vUserDetail}>
                  <Text>{vUserDetail?.display_name}</Text>
                </ShimmerRectangle>
              </View>
              <Separator />
              <View onPress={() => push('/profile/edit/self-introduction')}>
                <Text color='$subtle'>{t('SELF_INTRODUCTION')}</Text>
                <Spacer size='$1' />
                <ShimmerRectangle visible={!!vUserDetail}>
                  <Text>{vUserDetail?.self_introduction}</Text>
                </ShimmerRectangle>
              </View>
            </YStack>
          </View>
        </YStack>
      </YStack>
      <EditProfileImageActionSheetModal ref={actionSheetRef} />
    </>
  );
};
