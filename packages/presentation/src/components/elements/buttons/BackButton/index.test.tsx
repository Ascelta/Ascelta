import { defaultConfig } from '@tamagui/config/v4';
import { fireEvent, render } from '@testing-library/react';
import { TamaguiProvider, createTamagui } from 'tamagui';
import { BackButton } from './';

jest.mock('@tamagui/lucide-icons', () => {
  const { Text } = require('tamagui');
  return {
    ChevronLeft: (props: any) => <Text onPress={props.onPress}>BACK</Text>,
  };
});

jest.mock('solito/router', () => {
  const mockBack = jest.fn();
  return {
    __esModule: true,
    useRouter: () => ({
      back: mockBack,
    }),
    mockBack: mockBack,
  };
});

const mockBack = require('solito/router').mockBack;

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('CloseButton', () => {
  const config = createTamagui(defaultConfig);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('正常系', () => {
    it('タップしたら back が呼ばれること', () => {
      const { getByText } = render(
        <TamaguiProvider config={config}>
          <BackButton />
        </TamaguiProvider>,
      );
      fireEvent.click(getByText('BACK'));
      expect(mockBack).toHaveBeenCalledTimes(1);
    });
  });
});
