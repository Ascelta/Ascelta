import React from 'react';
import { useTranslation } from 'react-i18next';
import { TabBarProps } from 'react-native-collapsible-tab-view';
import { Settings } from '@tamagui/lucide-icons';
import { useRouter } from 'solito/router';
import { Spacer, Text, View, XStack, YStack } from 'tamagui';
import { SuiteUser } from '@core/domain';
import { UserAvatar } from '@core/presentation/components/elements/avatars/UserAvatar';
import { OutlinedButton } from '@core/presentation/components/elements/buttons/OutlinedButton';
import { ShimmerRectangle } from '@core/presentation/components/elements/loadings/Shimmer';
import { DisplayName } from '@core/presentation/components/elements/texts/DisplayName';
import { ScreenName } from '@core/presentation/components/elements/texts/ScreenName';
import { SelfIntroduction } from '@core/presentation/features/profile/components/parts/SelfIntroduction';

type Props = {
  suiteUser: SuiteUser | undefined;
  isLoading: boolean;
} & TabBarProps<string>;

export const ProfileHeader: React.FC<Props> = ({ isLoading, suiteUser }) => {
  const { t } = useTranslation();
  const { push } = useRouter();
  const vUserDetail = suiteUser?.vUserDetail;
  return (
    <>
      <View backgroundColor='$background' paddingTop='$4' paddingBottom='$2' paddingHorizontal='$4'>
        <YStack flex={1} gap='$3'>
          <YStack>
            <XStack justifyContent='space-between'>
              <UserAvatar size='$6' avatarUrl={vUserDetail?.avatar_url} isLoading={isLoading} />
              <YStack justifyContent='space-between'>
                {isLoading ? undefined : (
                  <XStack gap='$2' alignItems='center'>
                    <OutlinedButton height='$2.5' paddingHorizontal='$4' paddingVertical='$0' onPress={() => push('/profile/edit')}>
                      <Text>{t('EDIT')}</Text>
                    </OutlinedButton>
                    <View onPress={() => push('/setting')}>
                      <View padding='$2'>
                        <Settings color='$color' />
                      </View>
                    </View>
                  </XStack>
                )}
              </YStack>
            </XStack>
          </YStack>
          {(() => {
            if (isLoading) {
              return (
                <YStack flex={1} gap='$2'>
                  <View width='50%'>
                    <ShimmerRectangle visible={false} />
                  </View>
                  <Spacer size='$1' />
                  <ShimmerRectangle visible={false} />
                  <ShimmerRectangle visible={false} />
                  <ShimmerRectangle visible={false} />
                </YStack>
              );
            } else {
              return (
                <YStack flex={1} gap='$3'>
                  <YStack gap='$1'>
                    <DisplayName fontSize='$6' text={vUserDetail?.display_name} />
                    <ScreenName fontSize='$5' text={vUserDetail?.screen_name} />
                  </YStack>
                  <YStack gap='$3'>
                    <SelfIntroduction text={vUserDetail?.self_introduction} />
                    <XStack gap='$3'>
                      <XStack gap='$1.5'>
                        <Text fontSize='$3.5' color='$color'>
                          1000万人
                        </Text>
                        <Text fontSize='$3.5' color='$subtle'>
                          {t('FOLLOWS')}
                        </Text>
                      </XStack>
                      <XStack gap='$1.5'>
                        <Text fontSize='$3.5' color='$color'>
                          1000万人
                        </Text>
                        <Text fontSize='$3.5' color='$subtle'>
                          {t('FOLLOWERS')}
                        </Text>
                      </XStack>
                    </XStack>
                  </YStack>
                </YStack>
              );
            }
          })()}
        </YStack>
      </View>
    </>
  );
};
