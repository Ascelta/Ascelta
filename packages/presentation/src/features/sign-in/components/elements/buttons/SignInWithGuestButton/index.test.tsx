import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { TamaguiProvider } from 'tamagui';
import config from '../../../../../../../tamagui.config.ts';
import { SignInWithGuestButton } from './index.tsx';

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
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

describe('<SignInWithGuestButton />', () => {
  const setup = () => {
    return render(
      <TamaguiProvider config={config}>
        <SignInWithGuestButton />
      </TamaguiProvider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('初期表示時のスナップショットが一致すること', () => {
    const { asFragment } = setup();
    expect(asFragment()).toMatchSnapshot();
  });

  it(`ボタンをタップした場合は、確認ダイアログが表示されて、「キャンセル」ボタンをタップすると signIn が呼ばれないこと`, async () => {
    setup();
    const continueWithGuestButtonText = screen.getByText('CONTINUE_WITH_GUEST');
    const guestSignInAlertTitle = screen.queryByText('GUEST_SIGN_IN_ALERT_TITLE');
    const guestSignInAlertMessage = screen.queryByText('GUEST_SIGN_IN_ALERT_MESSAGE');
    const cancelButtonText = screen.queryByText('CANCEL');
    const continueButtonText = screen.queryByText('CONTINUE');
    expect(continueWithGuestButtonText).toBeInTheDocument();
    expect(guestSignInAlertTitle).not.toBeInTheDocument();
    expect(guestSignInAlertMessage).not.toBeInTheDocument();
    expect(cancelButtonText).not.toBeInTheDocument();
    expect(continueButtonText).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(continueWithGuestButtonText);
    });
    
    // ダイアログが表示されるまで待機
    const alertTitle = await screen.findByText('GUEST_SIGN_IN_ALERT_TITLE');
    const alertMessage = await screen.findByText('GUEST_SIGN_IN_ALERT_MESSAGE');
    const cancelButton = await screen.findByText('CANCEL');
    const continueButton = await screen.findByText('CONTINUE');
    
    expect(continueWithGuestButtonText).toBeInTheDocument();
    expect(alertTitle).toBeInTheDocument();
    expect(alertMessage).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
    expect(continueButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(cancelButton);
    });
    
    // ダイアログが消えるまで待機
    await waitFor(() => {
      expect(screen.queryByText('GUEST_SIGN_IN_ALERT_TITLE')).not.toBeInTheDocument();
    });
    
    expect(continueWithGuestButtonText).toBeInTheDocument();
    expect(screen.queryByText('GUEST_SIGN_IN_ALERT_TITLE')).not.toBeInTheDocument();
    expect(screen.queryByText('GUEST_SIGN_IN_ALERT_MESSAGE')).not.toBeInTheDocument();
    expect(screen.queryByText('CANCEL')).not.toBeInTheDocument();
    expect(screen.queryByText('CONTINUE')).not.toBeInTheDocument();
    expect(mockSignIn).not.toHaveBeenCalled();
  });
});
