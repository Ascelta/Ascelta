import React from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner, Text } from 'tamagui';

type Props = {
  disabled?: boolean;
  isLoading?: boolean;
  onDone: () => void;
};

export const DoneButton: React.FC<Props> = ({ disabled, isLoading, onDone }) => {
  const { t } = useTranslation();
  const onPress = () => {
    if (disabled) {
      return;
    }
    onDone();
  };
  return (
    <>
      {isLoading ? (
        <Spinner testID='spinner' />
      ) : (
        <Text fontSize='$6' fontWeight='bold' opacity={disabled ? 0.2 : 1} onPress={onPress} paddingVertical='$2'>
          {t('DONE')}
        </Text>
      )}
    </>
  );
};
