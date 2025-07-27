import React from 'react';
import { Spacer, Text } from 'tamagui';

type Props = {
  displayName: string;
  screenName: string;
};

export const UserInfo: React.FC<Props> = ({ displayName, screenName }) => {
  return (
    <Text ellipse>
      <Text fontWeight='bold'>{displayName}</Text>
      <Spacer size='$2' />
      <Text color='$subtle' textAlign='center'>
        @{screenName}
      </Text>
    </Text>
  );
};
