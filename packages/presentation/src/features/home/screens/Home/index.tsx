import React, { useState } from 'react';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { Separator, Spacer, View, XStack, YStack } from 'tamagui';
import { PostCard } from '@core/presentation/components/elements/cards/PostCard';
import { FloatingActionButton } from '@core/presentation/components/elements/buttons/FloatingActionButton';
import { CollapsibleHeader } from '@core/presentation/components/layouts/headers/CollapsibleHeader';
import Logo from '../../../../../assets/svgs/logo.svg';
import { DEFAULT_HEADER_HEIGHT } from '../../../../configs';

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

export const Home: React.FC = () => {
  const scrollY = useSharedValue(0);
  const translateY = useSharedValue(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { top } = useSafeAreaInsets();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      const dy = event.contentOffset.y - scrollY.value;
      scrollY.value = event.contentOffset.y;
      if (dy < 0 || scrollY.value <= 0) {
        // 上スクロール or スクロール位置が0 → ヘッダーを隠す
        translateY.value = Math.min(0, translateY.value + Math.abs(dy));
      } else {
        // 下スクロール → ヘッダーを表示
        translateY.value = Math.max(-DEFAULT_HEADER_HEIGHT, translateY.value - Math.abs(dy));
      }
    },
  });

  const data = Array.from({ length: 30 }).map((_, i) => ({ key: String(i), title: `Item ${i}` }));

  return (
    <View flex={1}>
      {/* 折りたたみヘッダー */}
      <CollapsibleHeader translateY={translateY}>
        <XStack justifyContent='center' alignItems='center' width='100%' height='100%' paddingHorizontal={16}>
          <YStack>
            <Logo width={36} height={36} />
          </YStack>
        </XStack>
      </CollapsibleHeader>
      <AnimatedFlashList
        data={data}
        renderItem={({}) => <PostCard />}
        ListFooterComponent={() => <Spacer size='$16' />}
        ItemSeparatorComponent={() => <Separator />}
        estimatedItemSize={100}
        refreshing={isRefreshing}
        onRefresh={() => {
          setIsRefreshing(true);
          setTimeout(() => {
            // setState(prev => prev + 1);
            setIsRefreshing(false);
          }, 2000);
        }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        progressViewOffset={DEFAULT_HEADER_HEIGHT}
        contentContainerStyle={{ paddingTop: DEFAULT_HEADER_HEIGHT }}
        scrollIndicatorInsets={{ top: DEFAULT_HEADER_HEIGHT - top, bottom: 0 }}
      />
      <FloatingActionButton />
    </View>
  );
};
