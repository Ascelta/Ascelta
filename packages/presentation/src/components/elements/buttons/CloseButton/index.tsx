import React from 'react';
import { X } from '@tamagui/lucide-icons';
import { useRouter } from 'solito/router';
import { SizeTokens } from 'tamagui';


type Props = {
  size?: number | SizeTokens;
  disabled?: boolean;
  onPress?: () => void;
};

export const CloseButton: React.FC<Props> = ({ size, disabled, onPress }) => {
  const { back } = useRouter();
  return (
    <>
      <X size={size} disabled={disabled} onPress={onPress ?? back} paddingVertical='$2' />
    </>
  );
};
