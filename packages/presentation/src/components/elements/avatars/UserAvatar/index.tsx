import React from 'react';
import { GetTokenString, Tokens } from '@tamagui/core';
import { Avatar, getTokenValue } from 'tamagui';
import { User } from '@tamagui/lucide-icons';
import { ShimmerCircle } from '@core/presentation/components/elements/loadings/Shimmer';

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
          <Avatar.Fallback backgroundColor='$borderColor' alignItems='center' justifyContent='center'>
            <User size={avatarSize * 0.65} color='$subtle' />
          </Avatar.Fallback>
        </Avatar>
      </ShimmerCircle>
</>
  );
};
