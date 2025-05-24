import React from 'react';
import { X } from '@tamagui/lucide-icons';
import { useRouter } from 'solito/router';

type Props = {
  disabled?: boolean;
};

export const CloseButton: React.FC<Props> = ({ disabled }) => {
  const { back } = useRouter();
  return (
    <>
      <X disabled={disabled} onPress={back} />
    </>
  );
};
