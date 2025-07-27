import React from 'react';
import { defaultConfig } from '@tamagui/config/v4';
import { fireEvent, render } from '@testing-library/react';
import { TamaguiProvider, createTamagui } from 'tamagui';
import { TextButton } from '@core/presentation/components/elements/buttons/TextButton';

const text = 'button-text';

describe('TextButton', () => {
  const config = createTamagui(defaultConfig);
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('正常系', () => {
    it('disabled が true, isLoading が未指定の場合は onPress が呼ばれないこと', () => {
      const { getByText } = render(
        <TamaguiProvider config={config}>
          <TextButton text={text} disabled={true} onPress={mockOnPress} />
        </TamaguiProvider>,
      );
      const button = getByText(text);
      fireEvent.click(button);
      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('disabled が true, isLoading が false の場合は onPress が呼ばれないこと', () => {
      const { getByText } = render(
        <TamaguiProvider config={config}>
          <TextButton text={text} disabled={true} isLoading={false} onPress={mockOnPress} />
        </TamaguiProvider>,
      );
      const button = getByText(text);
      fireEvent.click(button);
      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('disabled が未指定, isLoading が true の場合は DONE が表示されていないこと', () => {
      const { queryByText } = render(
        <TamaguiProvider config={config}>
          <TextButton text={text} isLoading={true} onPress={mockOnPress} />
        </TamaguiProvider>,
      );
      const button = queryByText(text);
      expect(button).not.toBeInTheDocument();
    });

    it('disabled が false, isLoading が true の場合は DONE が表示されていないこと', () => {
      const { queryByText } = render(
        <TamaguiProvider config={config}>
          <TextButton text={text} disabled={false} isLoading={true} onPress={mockOnPress} />
        </TamaguiProvider>,
      );
      const button = queryByText(text);
      expect(button).not.toBeInTheDocument();
    });

    it('disabled, isLoading が共に未指定の場合は onPress が呼ばれること', () => {
      const { getByText } = render(
        <TamaguiProvider config={config}>
          <TextButton text={text} disabled={false} isLoading={false} onPress={mockOnPress} />
        </TamaguiProvider>,
      );
      const button = getByText(text);
      fireEvent.click(button);
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('disabled, isLoading が共に false の場合は onPress が呼ばれること', () => {
      const { getByText } = render(
        <TamaguiProvider config={config}>
          <TextButton text={text} disabled={false} isLoading={false} onPress={mockOnPress} />
        </TamaguiProvider>,
      );
      const button = getByText(text);
      fireEvent.click(button);
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });
  });
});
