import React, { PropsWithChildren } from 'react';
import { SheetProvider } from 'react-native-actions-sheet';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { TamaguiProvider } from 'tamagui';
import ToastManager from 'toastify-react-native';
import { AuthProvider } from '@core/presentation/contexts/AuthContext';
import { UseCaseProvider } from '@core/presentation/contexts/UseCaseContext';
import '@core/presentation/locales/config';
import { Theme } from '@core/presentation/types/theme';
import config from '../tamagui.config.ts';

type Props = {
  theme: Theme;
};

export const Provider: React.FC<PropsWithChildren<Props>> = ({ children, theme }) => {
  return (
    <UseCaseProvider>
      <AuthProvider>
        <KeyboardProvider>
          <TamaguiProvider config={config} defaultTheme={theme}>
            <SheetProvider context='global'>{children}</SheetProvider>
            <ToastManager theme={theme} />
          </TamaguiProvider>
        </KeyboardProvider>
      </AuthProvider>
    </UseCaseProvider>
  );
};
