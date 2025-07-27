import React from 'react';
import { Spinner, Text } from 'tamagui';

type Props = {
  text: string;
  disabled?: boolean;
  isLoading?: boolean;
  onPress?: () => void;
};

export const TextButton: React.FC<Props> = ({ text, disabled, isLoading, onPress }) => {
  return (
    <>
      {isLoading ? (
        <Spinner testID='spinner' />
      ) : (
        <Text
          animation='quick'
          fontSize='$6'
          fontWeight='bold'
          opacity={disabled ? 0.2 : 1}
          onPress={() => {
            if (disabled) {
              return;
            }
            onPress();
          }}
          paddingVertical='$2'
        >
          {text}
        </Text>
      )}
    </>
  );
};
