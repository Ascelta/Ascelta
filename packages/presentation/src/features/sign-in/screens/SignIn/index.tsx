import React from 'react';
import { useTranslation } from 'react-i18next';
import { Separator, Spacer, Text, XStack, YStack, useTheme } from 'tamagui';
import { AppConfig } from '@core/shared';
import Logo from '../../../../../assets/svgs/logo.svg';
import Name from '../../../../../assets/svgs/name.svg';
import { SignInWithAppleButton } from '../../components/elements/buttons/SignInWithAppleButton';
import { SignInWithGoogleButton } from '../../components/elements/buttons/SignInWithGoogleButton';
import { SignInWithGuestButton } from '../../components/elements/buttons/SignInWithGuestButton';

export const SignIn: React.FC = () => {
  const { t } = useTranslation();
  const { subtle } = useTheme();
  return (
    <>
      <YStack alignItems='center' justifyContent='center' height='100%' width='100%'>
        <YStack paddingBottom='$10' alignItems='center'>
          <Logo width={96} height={96} />
          <Spacer size='$4' />
          <Name width={160} height={40} />
        </YStack>
        <YStack gap='$4' paddingHorizontal='$5' paddingVertical='$2'>
          <SignInWithAppleButton />
          <SignInWithGoogleButton />
          {/*<SignInWithXButton />*/}
          {/*<SignInWithDiscordButton />*/}
          <XStack gap='$4' alignItems='center'>
            <Separator />
            <Text color={subtle?.get()}>{t('OR')}</Text>
            <Separator />
          </XStack>
          <SignInWithGuestButton />
          <YStack gap='$2'>
            <Text paddingHorizontal='$2' color={subtle?.get()}>
              {t('CONTINUE_WITH_GUEST_WARNING')}
            </Text>
            <Text paddingHorizontal='$2' color={subtle?.get()}>
              {t('CONTINUE_IS_APPROVE_TERMS_OF_SERVICE_AND_PRIVACY_POLICY', { appName: AppConfig.APP_DISPLAY_NAME })}
            </Text>
          </YStack>
        </YStack>
      </YStack>
    </>
  );
};
