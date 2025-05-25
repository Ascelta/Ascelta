import React from 'react';
import { Input, Text, View, XStack, YStack, styled } from 'tamagui';

const StyledInput = styled(Input, {
  width: '100%',
  paddingHorizontal: '$3',
  fontSize: '$5',
  color: '$color',
  borderWidth: 1,
  borderRadius: '$6',
});

type Props = {
  ref?: React.Ref<Input>;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  borderColor?: string;
  returnKeyType?: 'done' | 'next' | 'go' | 'search' | 'send';
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  errorMessage?: string;
};

export const TextInput: React.FC<Props> = ({ ref, disabled, placeholder, value, multiline, numberOfLines, maxLength, borderColor, returnKeyType, onChangeText, onSubmitEditing, onFocus, onBlur, errorMessage }) => {
  const getErrorMessage = () => {
    if (errorMessage) {
      return (
        <Text color='$error' fontSize='$2'>
          {errorMessage}
        </Text>
      );
    }
    return '';
  };

  const getLengthCounter = () => {
    if (maxLength) {
      return (
        <Text color={errorMessage ? '$error' : '$color'}>
          {value?.length}/{maxLength}
        </Text>
      );
    }
    return null;
  };

  return (
    <>
      <YStack gap='$2'>
        <StyledInput
          ref={ref}
          disabled={disabled}
          value={value}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          borderColor={borderColor}
          onChangeText={onChangeText}
          placeholder={placeholder}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <YStack>
          <XStack justifyContent='space-between' alignItems='center' paddingHorizontal='$2'>
            <View flex={1}>{getErrorMessage()}</View>
            {getLengthCounter()}
          </XStack>
        </YStack>
      </YStack>
    </>
  );
};
