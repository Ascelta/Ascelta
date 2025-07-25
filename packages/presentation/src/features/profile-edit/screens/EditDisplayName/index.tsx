import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'solito/router';
import { Input, Spacer, Text, YStack } from 'tamagui';
import { AppConfig } from '@core/shared/src/configs/appConfig';
import { CancelButton } from '@core/presentation/components/elements/buttons/CancelButton';
import { DoneButton } from '@core/presentation/components/elements/buttons/DoneButton';
import { TextInput } from '@core/presentation/components/elements/inputs/TextInput';
import { Header } from '@core/presentation/components/layouts/headers/Header';
import { useAuth } from '@core/presentation/contexts/AuthContext';
import { useUserStore } from '@core/presentation/stores/userStore';

export const EditDisplayName: React.FC = () => {
  const { t } = useTranslation();
  const { back } = useRouter();
  const { userId } = useAuth();
  const displayName = useUserStore(state => (userId ? state.userMap[userId]?.data!.vUserDetail?.display_name : undefined));
  const isLoading = useUserStore(state => (userId ? state.userMap[userId]?.isLoading : false));
  const updateUserProfile = useUserStore(state => state.updateUserProfile);
  const inputRef = useRef<Input>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(displayName ?? '');
  const [isValid, setIsValid] = useState<boolean>(true);

  useEffect(() => {
    // コンポーネントマウント時にキーボードを表示
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const onChangeText = (text: string) => {
    setNewDisplayName(text);
    setIsValid(text.length > 0);
  };

  const onDone = async () => {
    if (!userId) {
      return;
    }
    if (!isValid) {
      return;
    }
    if (displayName !== newDisplayName) {
      await updateUserProfile(userId, undefined, newDisplayName, undefined, undefined);
    }
    back();
  };

  const getBorderColor = () => {
    if (!isValid) {
      return '$error';
    }
    return isFocused ? '$primary' : '$subtle';
  };

  const getErrorMessage = () => {
    if (!isValid) {
      return t('REQUIRED_ERROR');
    }
    return '';
  };

  return (
    <>
      <YStack flex={1}>
        <Header title={t('EDIT_DISPLAY_NAME')} leading={<CancelButton />} action={<DoneButton disabled={!isValid} isLoading={isLoading} onDone={onDone} />} />
        <Spacer size='$4' />
        <YStack paddingTop='$2' paddingHorizontal='$4' gap='$4'>
          <TextInput
            borderColor={getBorderColor()}
            maxLength={AppConfig.DISPLAY_NAME_MAX_LENGTH}
            disabled={isLoading}
            ref={inputRef}
            value={newDisplayName}
            onChangeText={onChangeText}
            placeholder={t('DISPLAY_NAME')}
            returnKeyType='done'
            onSubmitEditing={onDone}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            errorMessage={getErrorMessage()}
          />
          <YStack gap='$2'>
            <Text color='$subtle'>{t('EDIT_DISPLAY_NAME_LENGTH', { max: AppConfig.DISPLAY_NAME_MAX_LENGTH })}</Text>
          </YStack>
        </YStack>
      </YStack>
    </>
  );
};
