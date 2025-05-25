import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'solito/router';
import { Form, Separator, Spacer, Text, View, YStack, styled } from 'tamagui';
import { UserAvatar } from '../../../../components/elements/avatars/UserAvatar';
import { CloseButton } from '../../../../components/elements/buttons/CloseButton';
import { ShimmerRectangle } from '../../../../components/elements/loadings/Shimmer';
import { Header } from '../../../../components/layouts/headers/Header';
import { useAuth } from '../../../../contexts/AuthContext';
import { useUserStore } from '../../../../stores/userStore';

export const ProfileEdit: React.FC = () => {
  const { t } = useTranslation();
  const { push } = useRouter();
  const { userId } = useAuth();
  const vUserDetail = useUserStore(state => (userId ? state.userMap[userId]?.data?.vUserDetail : undefined));

  return (
    <YStack flex={1} justifyContent='space-between'>
      <Header title={t('EDIT_PROFILE')} leading={<CloseButton />} />
      <YStack flex={1} justifyContent='unset' paddingHorizontal='$4' paddingVertical='$8' gap='$4'>
        <View alignItems='center' justifyContent='center'>
          <UserAvatar size='$10' avatarUrl={vUserDetail?.avatar_url} isLoading={!vUserDetail} />
        </View>
        <StyledForm>
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
            <View>
              <Text color='$subtle'>{t('SELF_INTRODUCTION')}</Text>
              <Spacer size='$1' />
              <ShimmerRectangle visible={!!vUserDetail}>
                <Text>{vUserDetail?.self_introduction}</Text>
              </ShimmerRectangle>
            </View>
          </YStack>
        </StyledForm>
      </YStack>
    </YStack>
  );
};

const StyledForm = styled(Form, {
  borderWidth: 1,
  borderRadius: '$8',
  backgroundColor: '$background',
  borderColor: '$borderColor',
  padding: '$3.5',
});
