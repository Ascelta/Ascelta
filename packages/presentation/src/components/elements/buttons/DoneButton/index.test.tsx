import React from 'react';
import { defaultConfig } from '@tamagui/config/v4';
import { fireEvent, render } from '@testing-library/react';
import { TamaguiProvider, createTamagui } from 'tamagui';
import { DoneButton } from './index';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('DoneButton', () => {
  const config = createTamagui(defaultConfig);
  const mockOnDone = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('正常系', () => {
    it('disabled が true, isLoading が未指定の場合は onDone が呼ばれないこと', () => {
      const { getByText } = render(
        <TamaguiProvider config={config}>
          <DoneButton disabled={true} onDone={mockOnDone} />
        </TamaguiProvider>,
      );
      const button = getByText('DONE');
      fireEvent.click(button);
      expect(mockOnDone).not.toHaveBeenCalled();
    });

    it('disabled が true, isLoading が false の場合は onDone が呼ばれないこと', () => {
      const { getByText } = render(
        <TamaguiProvider config={config}>
          <DoneButton disabled={true} isLoading={false} onDone={mockOnDone} />
        </TamaguiProvider>,
      );
      const button = getByText('DONE');
      fireEvent.click(button);
      expect(mockOnDone).not.toHaveBeenCalled();
    });

    it('disabled が未指定, isLoading が true の場合は DONE が表示されていないこと', () => {
      const { queryByText } = render(
        <TamaguiProvider config={config}>
          <DoneButton isLoading={true} onDone={mockOnDone} />
        </TamaguiProvider>,
      );
      const button = queryByText('DONE');
      expect(button).not.toBeInTheDocument();
    });

    it('disabled が false, isLoading が true の場合は DONE が表示されていないこと', () => {
      const { queryByText } = render(
        <TamaguiProvider config={config}>
          <DoneButton disabled={false} isLoading={true} onDone={mockOnDone} />
        </TamaguiProvider>,
      );
      const button = queryByText('DONE');
      expect(button).not.toBeInTheDocument();
    });

    it('disabled, isLoading が共に未指定の場合は onDone が呼ばれること', () => {
      const { getByText } = render(
        <TamaguiProvider config={config}>
          <DoneButton disabled={false} isLoading={false} onDone={mockOnDone} />
        </TamaguiProvider>,
      );
      const button = getByText('DONE');
      fireEvent.click(button);
      expect(mockOnDone).toHaveBeenCalledTimes(1);
    });

    it('disabled, isLoading が共に false の場合は onDone が呼ばれること', () => {
      const { getByText } = render(
        <TamaguiProvider config={config}>
          <DoneButton disabled={false} isLoading={false} onDone={mockOnDone} />
        </TamaguiProvider>,
      );
      const button = getByText('DONE');
      fireEvent.click(button);
      expect(mockOnDone).toHaveBeenCalledTimes(1);
    });
  });
});
