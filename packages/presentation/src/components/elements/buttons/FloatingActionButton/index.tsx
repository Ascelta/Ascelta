import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus } from '@tamagui/lucide-icons';
import { useRouter } from 'solito/router';
import { Button } from 'tamagui';

export const FloatingActionButton: React.FC = () => {
  const { push } = useRouter();
  const { bottom } = useSafeAreaInsets();
  
  return (
    <Button
      position="absolute"
      bottom={bottom}
      right="$5"
      height={48}
      width={48}
      borderRadius={24}
      backgroundColor="$primary"
      color="white"
      onPress={() => push('/post/create')}
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 4 }}
      shadowOpacity={0.3}
      shadowRadius={8}
      elevation={8}
      zIndex={1000}
      borderWidth={0}
      justifyContent="center"
      alignItems="center"
    >
      <Plus size={24} color='white' />
    </Button>
  );
};
