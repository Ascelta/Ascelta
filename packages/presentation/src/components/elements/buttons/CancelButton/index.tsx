import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'solito/router';
import { Text } from 'tamagui';

export const CancelButton: React.FC = () => {
  const { t } = useTranslation();
  const { back } = useRouter();
  return (
    <>
      <Text onPress={back} fontSize='$6'>
        {t('CANCEL')}
      </Text>
    </>
  );
};
