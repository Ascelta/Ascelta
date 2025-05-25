import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { TamaguiProvider } from 'tamagui';
import config from '../../../../../tamagui.config.ts';
import { TextInput } from './index';


describe('TextInput', () => {
  describe('正常系', () => {
    it('errorMessage が指定された場合、エラーカラーでエラーメッセージが表示されること', () => {
      const errorMessage = 'This is an error message';
      render(
        <TamaguiProvider config={config}>
          <TextInput errorMessage={errorMessage} />
        </TamaguiProvider>,
      );

      const errorText = screen.getByText(errorMessage);
      expect(errorText).toBeInTheDocument();
      expect(errorText).toHaveStyle({ color: '$error' });
    });

    it('maxLength が指定された場合、テキストカウンターが表示され、テキスト入力時に更新されること', async () => {
      const maxLength = 10;
      render(
        <TamaguiProvider config={config}>
          <TextInput maxLength={maxLength} placeholder='Placeholder' value='' />
        </TamaguiProvider>,
      );

      expect(screen.getByText('0/10')).toBeInTheDocument();
      expect(screen.queryByText('5/10')).not.toBeInTheDocument();

      const input = screen.getByPlaceholderText('Placeholder');

      fireEvent.change(input, { target: { value: 'Hello' } });

      waitFor(() => {
        expect(screen.queryByText('0/10')).not.toBeInTheDocument();
        expect(screen.getByText('5/10')).toBeInTheDocument();
      });
    });

    it('errorMessage と maxLength が両方指定された場合、テキストカウンターがエラーカラーで表示されること', () => {
      const errorMessage = 'This is an error message';
      const maxLength = 10;
      render(
        <TamaguiProvider config={config}>
          <TextInput errorMessage={errorMessage} maxLength={maxLength} value='' />
        </TamaguiProvider>,
      );

      const counterText = screen.getByText('0/10');
      expect(counterText).toBeInTheDocument();
      expect(counterText).toHaveStyle({ color: '$error' });
    });
  });
});
