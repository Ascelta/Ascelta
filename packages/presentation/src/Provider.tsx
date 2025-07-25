import React, { PropsWithChildren } from 'react';
import ToastManager from 'toastify-react-native';
import { SheetProvider } from 'react-native-actions-sheet';
import { TamaguiProvider } from 'tamagui';
import config from '../tamagui.config.ts';
import { AuthProvider } from '@core/presentation/contexts/AuthContext';
import { UseCaseProvider } from '@core/presentation/contexts/UseCaseContext';
import '@core/presentation/locales/config';
import { Theme } from '@core/presentation/types/theme';

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
