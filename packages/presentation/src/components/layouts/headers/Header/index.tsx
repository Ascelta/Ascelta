import React from 'react';
import { Text, View, XStack, styled } from 'tamagui';

const HeaderView = styled(View, {
  width: '100%',
  height: 56,
  backgroundColor: '$background',
  borderBottomWidth: 1,
  borderBottomColor: '$borderColor',
  paddingHorizontal: '$3',
});

type Props = {
  title?: string;
  leading?: React.ReactNode;
  action?: React.ReactNode;
};

export const Header: React.FC<Props> = ({ title, leading, action }) => {
  return (
    <>
      <HeaderView>
        <XStack flex={1} justifyContent='space-between' alignItems='center'>
          <View flex={1} alignItems='flex-start'>
            <View>{leading}</View>
          </View>
          {title && (
            <View alignItems='center'>
              <Text fontSize='$7' fontWeight='bold'>
                {title}
              </Text>
            </View>
          )}
          <View flex={1} alignItems='flex-end'>
            {action}
          </View>
        </XStack>
      </HeaderView>
    </>
  );
};
