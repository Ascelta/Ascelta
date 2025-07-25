import { defaultConfig } from '@tamagui/config/v4';
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { TamaguiProvider, createTamagui } from 'tamagui';
import { OAuthButton } from './index.tsx';

// toastify-react-native をモック
jest.mock('toastify-react-native', () => {
  const mockToastError = jest.fn();
  return {
    __esModule: true,
    Toast: {
      error: mockToastError,
    },
    mockToastError: mockToastError,
  };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../../../../../../contexts/AuthContext', () => {
  // モックファクトリ内で直接作る
  const mockSignIn = jest.fn();
  return {
    __esModule: true,
    useAuth: jest.fn().mockImplementation(() => ({
      signIn: mockSignIn,
    })),
    mockSignIn: mockSignIn,
  };
});

const mockSignIn = require('../../../../../../contexts/AuthContext').mockSignIn;
const mockToastError = require('toastify-react-native').mockToastError;

describe('<OAuthButton />', () => {
  const config = createTamagui(defaultConfig);
  const setup = () => {
    return render(
      <TamaguiProvider config={config}>
        <OAuthButton type='google' icon={<div />} backgroundColor='#FFF' borderColor='#FFF' text='Sign in with Google' textColor='#000' />
      </TamaguiProvider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockToastError.mockClear();
  });

  describe('正常系', () => {
    it('スナップショットが一致すること', () => {
      const { asFragment } = setup();
      expect(asFragment()).toMatchSnapshot();
    });

    it('ボタンをタップした場合は、SignInUseCase#execute が呼ばれていること', async () => {
      setup();
      const button = screen.getByText('Sign in with Google');
      expect(button).toBeInTheDocument();
      expect(mockSignIn).not.toHaveBeenCalled();
      await act(async () => {
        fireEvent.click(button);
      });
      expect(mockSignIn).toHaveBeenCalledTimes(1);
      expect(mockSignIn).toHaveBeenCalledWith('google');
    });
  });

  describe('準正常系', () => {
    it('ユーザーがキャンセルした場合、toast.error が呼ばれないこと', async () => {
      // ユーザーキャンセルのエラーを設定
      const cancelError = new Error('User cancelled');
      mockSignIn.mockRejectedValueOnce(cancelError);

      setup();
      const button = screen.getByText('Sign in with Google');

      await act(async () => {
        fireEvent.click(button);
      });

      expect(mockSignIn).toHaveBeenCalledTimes(1);
      expect(mockToastError).not.toHaveBeenCalled();
    });

    it('OAuth エラー (-3) の場合、toast.error が呼ばれないこと', async () => {
      // OAuth エラー (-3) を設定
      const oauthError = new Error('org.openid.appauth.general error -3');
      mockSignIn.mockRejectedValueOnce(oauthError);

      setup();
      const button = screen.getByText('Sign in with Google');

      await act(async () => {
        fireEvent.click(button);
      });

      expect(mockSignIn).toHaveBeenCalledTimes(1);
      expect(mockToastError).not.toHaveBeenCalled();
    });
  });

  describe('異常系', () => {
    it('サインインでエラーが発生した場合、toast.error が呼ばれること', async () => {
      // signIn がエラーを投げるように設定
      const signInError = new Error('Sign in failed');
      mockSignIn.mockRejectedValueOnce(signInError);

      setup();
      const button = screen.getByText('Sign in with Google');

      await act(async () => {
        fireEvent.click(button);
      });

      expect(mockSignIn).toHaveBeenCalledTimes(1);
      expect(mockToastError).toHaveBeenCalledTimes(1);
      expect(mockToastError).toHaveBeenCalledWith('SIGN_IN_ERROR');
    });
  });
});
