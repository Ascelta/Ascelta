import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CircleCheck, XCircle } from '@tamagui/lucide-icons';
import { useRouter } from 'solito/router';
import { Input, Spacer, Spinner, Text, View, XStack, YStack, styled } from 'tamagui';
import { AppConfig } from '@core/shared/configs/appConfig';
import { CancelButton } from '@core/presentation/components/elements/buttons/CancelButton';
import { DoneButton } from '@core/presentation/components/elements/buttons/DoneButton';
import { Header } from '@core/presentation/components/layouts/headers/Header';
import { useAuth } from '@core/presentation/contexts/AuthContext';
import { useUseCases } from '@core/presentation/contexts/UseCaseContext';
import { useUserStore } from '@core/presentation/stores/userStore';

type Status = 'success' | 'exists' | 'min-length' | 'invalid-format' | undefined;

const StyledInput = styled(Input, {
  flex: 1,
  width: '100%',
  padding: 0,
  fontSize: '$5',
  color: '$color',
  borderWidth: 0,
});

export const EditScreenName: React.FC = () => {
  const { checkScreenNameExistenceUseCase } = useUseCases();
  const { t } = useTranslation();
  const { back } = useRouter();
  const { userId } = useAuth();
  const screenName = useUserStore(state => (userId ? state.userMap[userId]?.data!.vUserDetail?.screen_name : undefined));
  const isLoading = useUserStore(state => (userId ? state.userMap[userId]?.isLoading : false));
  const updateScreenName = useUserStore(state => state.updateScreenName);
  const inputRef = useRef<Input>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [newScreenName, setNewScreenName] = useState(screenName ?? '');
  const [status, setStatus] = useState<Status>(undefined);
  const [isChecking, setIsChecking] = useState(false);

  // タイマー保持用
  const timer = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    // コンポーネントマウント時にキーボードを表示
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const onChangeText = (text: string) => {
    if (text === newScreenName) {
      return;
    }
    if (timer.current) {
      clearTimeout(timer.current);
    }
    setNewScreenName(text);
    setIsChecking(true);
    setStatus(undefined);

    // 半角英数字とアンダースコアのみのチェック
    if (!/^[a-zA-Z0-9_]*$/.test(text)) {
      setStatus('invalid-format');
      setIsChecking(false);
      return;
    }

    // 最小文字数未満の場合はエラー
    if (text.length < AppConfig.SCREEN_NAME_MIN_LENGTH) {
      setStatus('min-length');
      setIsChecking(false);
      return;
    }

    // 入力が空 or 既存のユーザー名と同じ場合はチェックをスキップ
    if (text === screenName || text.length === 0) {
      setStatus(undefined);
      setIsChecking(false);
      return;
    }

    timer.current = setTimeout(async () => {
      try {
        const exists = await checkScreenNameExistenceUseCase.execute(text);
        setStatus(exists ? 'exists' : 'success');
      } finally {
        setIsChecking(false);
      }
    }, 500);
  };

  const onDone = async () => {
    if (!userId) {
      return;
    }
    if (screenName === newScreenName) {
      back();
      return;
    }
    if (status !== 'success') {
      return;
    }
    await updateScreenName(userId, newScreenName);
    back();
  };

  const getBorderColor = () => {
    switch (status) {
      case 'exists':
      case 'min-length':
      case 'invalid-format':
        return '$error';
      case 'success':
        return '$success';
      case undefined:
        return isFocused ? '$primary' : '$subtle';
    }
  };

  const getErrorMessage = () => {
    let errorMessage;
    switch (status) {
      case 'exists':
        errorMessage = t('EDIT_SCREEN_NAME_EXISTENCE_ERROR');
        break;
      case 'min-length':
        errorMessage = t('EDIT_SCREEN_NAME_MIN_LENGTH_ERROR', { min: AppConfig.SCREEN_NAME_MIN_LENGTH });
        break;
      case 'invalid-format':
        errorMessage = t('EDIT_SCREEN_NAME_REGEXP_ERROR');
        break;
    }
    if (errorMessage) {
      return (
        <Text color='$error' fontSize='$2'>
          {errorMessage}
        </Text>
      );
    }
  };

  return (
    <>
      <YStack flex={1}>
        <Header
          title={t('EDIT_SCREEN_NAME')}
          leading={<CancelButton />}
          action={<DoneButton disabled={screenName !== newScreenName && status !== 'success'} isLoading={isLoading} onDone={onDone} />}
        />
        <Spacer size='$4' />
        <YStack paddingTop='$2' paddingHorizontal='$4' gap='$4'>
          <YStack gap='$2'>
            <XStack alignItems='center' gap='$1' borderWidth={1} borderColor={getBorderColor()} borderRadius='$6' paddingHorizontal='$3'>
              <Text fontSize='$5' opacity={0.5}>
                @
              </Text>
              <StyledInput
                maxLength={AppConfig.SCREEN_NAME_MAX_LENGTH}
                disabled={isLoading}
                ref={inputRef}
                value={newScreenName}
                onChangeText={onChangeText}
                placeholder={t('USERNAME')}
                keyboardType='web-search'
                returnKeyType='done'
                onSubmitEditing={onDone}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              {isChecking ? <Spinner /> : null}
              {status === 'success' ? <CircleCheck size={18} color='$success' /> : null}
              {status === 'exists' || status === 'min-length' || status === 'invalid-format' ? <XCircle size={18} color='$error' /> : null}
            </XStack>
            <YStack>
              <XStack justifyContent='space-between' alignItems='center' paddingHorizontal='$2'>
                <View flex={1}>{getErrorMessage()}</View>
                <Text color={status === 'min-length' ? '$error' : undefined}>
                  {newScreenName.length}/{AppConfig.SCREEN_NAME_MAX_LENGTH}
                </Text>
              </XStack>
            </YStack>
          </YStack>
          <YStack gap='$2'>
            <Text color='$subtle'>{t('EDIT_SCREEN_NAME_LENGTH', { min: AppConfig.SCREEN_NAME_MIN_LENGTH, max: AppConfig.SCREEN_NAME_MAX_LENGTH })}</Text>
            <Text color='$subtle'>{t('EDIT_SCREEN_NAME_REGEXP')}</Text>
          </YStack>
        </YStack>
      </YStack>
    </>
  );
};
