import React from 'react';
import { ChevronLeft } from '@tamagui/lucide-icons';
import { useRouter } from 'solito/router';

type Props = {
  disabled?: boolean;
};

export const BackButton: React.FC<Props> = ({ disabled }) => {
  const { back } = useRouter();
  return (
    <>
      <ChevronLeft size='$2' disabled={disabled} onPress={back} paddingVertical='$2' />
    </>
  );
};
