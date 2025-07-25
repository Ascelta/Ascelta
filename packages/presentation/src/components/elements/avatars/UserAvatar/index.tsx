import React from 'react';
import { GetTokenString, Tokens } from '@tamagui/core';
import { Avatar, getTokenValue } from 'tamagui';
import { ShimmerCircle } from '../../loadings/Shimmer';

type Props = {
  size: GetTokenString<keyof Tokens['size']> | number;
  avatarUrl: string | null | undefined;
  isLoading: boolean;
  onPress: () => void;
};

export const UserAvatar: React.FC<Props> = ({ size, avatarUrl, isLoading, onPress }) => {
  const avatarSize = typeof size === 'string' ? getTokenValue(size) : size;
  return (
    <>
      <ShimmerCircle width={avatarSize} height={avatarSize} visible={!isLoading}>
        <Avatar circular size={avatarSize} onPress={onPress}>
          <Avatar.Image src={avatarUrl ?? undefined} />
          <Avatar.Fallback backgroundColor='white' />
        </Avatar>
      </ShimmerCircle>
    </>
  );
};
