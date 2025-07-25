import React, { PropsWithChildren } from 'react';
import ToastManager from 'toastify-react-native';
import { SheetProvider } from 'react-native-actions-sheet';
import { TamaguiProvider } from 'tamagui';
import config from '../tamagui.config.ts';
import { AuthProvider } from './contexts/AuthContext';
import { UseCaseProvider } from './contexts/UseCaseContext';
import './locales/config/index.ts';
import { Theme } from './types/theme';

type Props = {
  theme: Theme;
};

export const Provider: React.FC<PropsWithChildren<Props>> = ({ children, theme }) => {
  return (
    <UseCaseProvider>
      <AuthProvider>
        <TamaguiProvider config={config} defaultTheme={theme}>
          <SheetProvider context='global'>{children}</SheetProvider>
          <ToastManager theme={theme}/>
        </TamaguiProvider>
      </AuthProvider>
    </UseCaseProvider>
  );
};
