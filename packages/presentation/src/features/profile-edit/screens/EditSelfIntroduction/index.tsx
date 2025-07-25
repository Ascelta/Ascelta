import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'solito/router';
import { Input, Spacer, Text, YStack } from 'tamagui';
import { AppConfig } from '@core/shared/configs/appConfig';
import { CancelButton } from '@core/presentation/components/elements/buttons/CancelButton';
import { DoneButton } from '@core/presentation/components/elements/buttons/DoneButton';
import { TextInput } from '@core/presentation/components/elements/inputs/TextInput';
import { Header } from '@core/presentation/components/layouts/headers/Header';
import { useAuth } from '@core/presentation/contexts/AuthContext';
import { useUserStore } from '@core/presentation/stores/userStore';

export const EditSelfIntroduction: React.FC = () => {
  const { t } = useTranslation();
  const { back } = useRouter();
  const { userId } = useAuth();
  const selfIntroduction = useUserStore(state => (userId ? state.userMap[userId]?.data!.vUserDetail?.self_introduction : undefined));
  const isLoading = useUserStore(state => (userId ? state.userMap[userId]?.isLoading : false));
  const updateUserProfile = useUserStore(state => state.updateUserProfile);
  const inputRef = useRef<Input>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [newSelfIntroduction, setNewSelfIntroduction] = useState(selfIntroduction ?? '');

  useEffect(() => {
    // コンポーネントマウント時にキーボードを表示
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const onDone = async () => {
    if (!userId) {
      return;
    }
    if (selfIntroduction !== newSelfIntroduction) {
      await updateUserProfile(userId, undefined, undefined, undefined, newSelfIntroduction);
    }
    back();
  };

  return (
    <>
      <YStack flex={1}>
        <Header title={t('EDIT_SELF_INTRODUCTION')} leading={<CancelButton />} action={<DoneButton isLoading={isLoading} onDone={onDone} />} />
        <Spacer size='$4' />
        <YStack paddingTop='$2' paddingHorizontal='$4' gap='$4'>
          <TextInput
            borderColor={isFocused ? '$primary' : '$subtle'}
            multiline
            numberOfLines={6}
            maxLength={AppConfig.SELF_INTRODUCTION_MAX_LENGTH}
            disabled={isLoading}
            ref={inputRef}
            value={newSelfIntroduction}
            onChangeText={setNewSelfIntroduction}
            placeholder={t('SELF_INTRODUCTION')}
            onSubmitEditing={onDone}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <YStack gap='$2'>
            <Text color='$subtle'>{t('EDIT_SELF_INTRODUCTION_LENGTH', { max: AppConfig.SELF_INTRODUCTION_MAX_LENGTH })}</Text>
          </YStack>
        </YStack>
      </YStack>
    </>
  );
};
