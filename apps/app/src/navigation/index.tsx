import React from 'react';
import BootSplash from 'react-native-bootsplash';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, useTheme } from 'tamagui';
import { AppConfig } from '@core/shared';
import { EditDisplayName, EditScreenName, EditSelfIntroduction, ProfileEdit, Setting, SignIn, Theme, useAuth, CreatePost } from '@core/presentation';
import { BottomTabs } from './BottomTabs';

const Stack = createNativeStackNavigator<{
  SignIn: undefined;
  SignedIn: undefined;
  ProfileEdit: undefined;
  EditScreenName: undefined;
  EditDisplayName: undefined;
  EditSelfIntroduction: undefined;
  CreatePost: undefined;
  Setting: undefined;
  NotFound: undefined;
}>();

type Props = {
  theme: Theme;
};

export const Navigation: React.FC<Props> = ({ theme }) => {
  const { userId } = useAuth();
  const { background, subtle, primary } = useTheme();
  const navigationTheme = theme === 'dark' ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...navigationTheme,
    colors: {
      ...navigationTheme.colors,
      background: background?.val,
      text: subtle?.val,
      primary: primary?.val,
      // card: theme.background?.get(),
      border: background?.val,
      // notification: theme.notification?.get(),
    },
  };
  return (
    <>
      <NavigationContainer
        onReady={() => BootSplash.hide()}
        theme={navTheme}
        linking={{
          prefixes: [`${AppConfig.APP_ID}://`, AppConfig.WEB_URL],
          config: {
            screens: {
              SignIn: 'sign-in',
              Home: {
                screens: {
                  HomeTab: 'home',
                  ProfileTab: 'profile',
                },
              },
              ProfileEdit: 'profile/edit',
              EditScreenName: 'profile/edit/screen-name',
              EditDisplayName: 'profile/edit/display-name',
              EditSelfIntroduction: 'profile/edit/self-introduction',
              CreatePost: 'post/create',
              Setting: 'setting',
              NotFound: '*',
            },
          },
        }}
      >
        <Stack.Navigator
          initialRouteName={userId ? 'SignedIn' : 'SignIn'}
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Group>{userId ? SignedInStack() : SignInStack()}</Stack.Group>
          <Stack.Screen name='NotFound' component={PageNotFound} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const PageNotFound: React.FC = () => {
  return <Text>Page Not Found</Text>;
};

const SignInStack = () => {
  return (
    <>
      <Stack.Screen name='SignIn' component={SignIn} />
    </>
  );
};

const SignedInStack = () => {
  return (
    <>
      <Stack.Screen name='SignedIn' component={BottomTabs} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name='ProfileEdit' component={ProfileEdit} />
        <Stack.Screen name='EditScreenName' component={EditScreenName} />
        <Stack.Screen name='EditDisplayName' component={EditDisplayName} />
        <Stack.Screen name='EditSelfIntroduction' component={EditSelfIntroduction} />
        <Stack.Screen name='CreatePost' component={CreatePost} />
        <Stack.Screen name='Setting' component={Setting} />
      </Stack.Group>
    </>
  );
};
