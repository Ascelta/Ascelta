import React from 'react';
import { useTranslation } from 'react-i18next';
import { TextButton } from '@core/presentation/components/elements/buttons/TextButton';

type Props = {
  disabled?: boolean;
  isLoading?: boolean;
  onDone: () => void;
};

export const DoneButton: React.FC<Props> = ({ onDone, ...props }) => {
  const { t } = useTranslation();
  return <TextButton text={t('DONE')} onPress={onDone} {...props} />;
};
