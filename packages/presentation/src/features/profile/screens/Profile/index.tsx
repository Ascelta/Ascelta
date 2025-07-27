import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { TabBarProps, Tabs } from 'react-native-collapsible-tab-view';
import { LinearGradient } from 'react-native-linear-gradient';
import Animated, { SharedValue, interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Separator, Spacer, Text, View, XStack, YStack, useTheme, useWindowDimensions } from 'tamagui';
import { PostCard } from '@core/presentation/components/elements/cards/PostCard';
import { useAuth } from '@core/presentation/contexts/AuthContext';
import { useUserStore } from '@core/presentation/stores/userStore';
import { ProfileHeader } from '@core/presentation/features/profile/layouts/ProfileHeader';

const DATA = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const identity = (v: unknown): string => v + '';

const AnimatedText = Animated.createAnimatedComponent(Text);

const TabBar: React.FC<TabBarProps<string> & { offset: SharedValue<number> }> = ({ offset, onTabPress }) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const { color, subtle, primary, secondary, accent } = useTheme();
  const animatedUnderline = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        {
          translateX: offset.value,
        },
      ],
    };
  });

  const animatedPostTabText = useAnimatedStyle(() => {
    'worklet';
    return {
      color: interpolateColor(offset.value, [0, width / 2], [color?.val, subtle?.val]) as string,
    };
  });

  const animatedFavoriteTabText = useAnimatedStyle(() => {
    'worklet';
    return {
      color: interpolateColor(offset.value, [0, width / 2], [subtle?.val, color?.val]) as string,
    };
  });

  return (
    <View width='100%' height={40} backgroundColor='$background' borderBottomColor='$borderColor' borderBottomWidth={1}>
      <XStack flex={1}>
        <YStack flex={1} height={36} onTouchEnd={() => onTabPress('Posts')} justifyContent='center' alignItems='center'>
          <AnimatedText style={[styles.tabBarText, animatedPostTabText]}>{t('POSTS')}</AnimatedText>
        </YStack>
        <YStack flex={1} height={36} onTouchEnd={() => onTabPress('Favorites')} justifyContent='center' alignItems='center'>
          <AnimatedText style={[styles.tabBarText, animatedFavoriteTabText]}>{t('FAVORITES')}</AnimatedText>
        </YStack>
      </XStack>
      <Animated.View style={[styles.tabBarUnderlineContainer, animatedUnderline]}>
        <YStack flex={1} width='100%' justifyContent='flex-end' alignItems='center'>
          <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} locations={[0.25, 0.5, 0.75]} colors={[primary?.val, secondary?.val, accent?.val]} style={styles.tabBarUnderline} />
        </YStack>
      </Animated.View>
    </View>
  );
};

export const Profile: React.FC = () => {
  const { top } = useSafeAreaInsets();
  const tabUnderlineOffset = useSharedValue(0);
  const { width } = useWindowDimensions();
  const { userId } = useAuth();
  const fetchUser = useUserStore(state => state.fetchUser);
  const data = useUserStore(state => (userId ? state.userMap[userId] : undefined));
  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId]);

  const renderItem = useCallback(({}) => {
    return <PostCard />;
  }, []);

  const onIndexChange = (index: number) => {
    const newOffset = (() => {
      switch (index) {
        case 0:
          return 0;
        case 1:
          return width / 2;
        default:
          return 0;
      }
    })();

    tabUnderlineOffset.value = withSpring(newOffset, {
      damping: 12,
    });
  };

  return (
    <>
      <View position='absolute' zIndex={20} height={top} width='100%'>
        <XStack flex={1} alignItems={'flex-end'}>
          <YStack flex={1}>
            <View width='100%' height='100%' backgroundColor='$background' />
          </YStack>
        </XStack>
      </View>
      <Tabs.Container
        onIndexChange={onIndexChange}
        containerStyle={{ top }}
        headerContainerStyle={styles.headerContainer}
        renderHeader={props => <ProfileHeader suiteUser={data?.data} isLoading={data?.isLoading ?? true} {...props} />}
        renderTabBar={props => <TabBar offset={tabUnderlineOffset} {...props} />}
        allowHeaderOverscroll
      >
        <Tabs.Tab name='Posts'>
          <Tabs.FlashList data={DATA} renderItem={renderItem} estimatedItemSize={110} ListFooterComponent={() => <Spacer size='$16' />} ItemSeparatorComponent={() => <Separator />} keyExtractor={identity} />
        </Tabs.Tab>
        <Tabs.Tab name='Favorites'>
          <Tabs.FlashList data={DATA} renderItem={renderItem} estimatedItemSize={110} ListFooterComponent={() => <Spacer size='$16' />} ItemSeparatorComponent={() => <Separator />} keyExtractor={identity} />
        </Tabs.Tab>
      </Tabs.Container>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    shadowOpacity: 0,
  },
  tabBarText: {
    fontWeight: 'bold',
  },
  tabBarUnderlineContainer: {
    width: '50%',
    position: 'absolute',
    zIndex: 20,
    bottom: 0,
  },
  tabBarUnderline: {
    width: '50%',
    height: 3,
    borderRadius: 30,
  },
});
