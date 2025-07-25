import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { TamaguiProvider } from 'tamagui';
import config from '../../../../../tamagui.config.ts';
import { EditSelfIntroduction } from './index';

const selfIntroductionMaxLength = 160;
const mockUserId = 'test-user-id';
const mockSelfIntroduction = 'self_introduction';

// モックの設定
jest.mock('@core/shared/configs/appConfig', () => ({
  __esModule: true,
  AppConfig: {
    DISPLAY_NAME_MAX_LENGTH: selfIntroductionMaxLength,
  },
}));
jest.mock('../../../../stores/userStore', () => {
  const mockUpdateUserProfile = jest.fn();
  return {
    __esModule: true,
    useUserStore: (selector: any) => {
      const data = {
        userMap: {
          [mockUserId]: {
            data: {
              vUserDetail: {
                self_introduction: mockSelfIntroduction,
              },
            },
            isLoading: false,
          },
        },
        updateUserProfile: mockUpdateUserProfile,
      };
      return selector(data);
    },
    mockUpdateUserProfile: mockUpdateUserProfile,
  };
});
jest.mock('../../../../contexts/AuthContext', () => {
  return {
    __esModule: true,
    useAuth: () => ({
      userId: mockUserId,
    }),
    mockUserId: mockUserId,
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
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockUpdateUserProfile = require('../../../../stores/userStore').mockUpdateUserProfile;
const mockBack = require('solito/router').mockBack;

describe('EditSelfIntroduction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return act(() => {
      return render(
        <TamaguiProvider config={config}>
          <EditSelfIntroduction />
        </TamaguiProvider>,
      );
    });
  };

  describe('正常系', () => {
    it('自己紹介が変更されていない場合は更新処理が呼ばれないこと', () => {
      renderComponent();
      const doneButton = screen.getByText('DONE');

      // 完了ボタンをタップ
      fireEvent.click(doneButton);

      // updateUserProfileが呼ばれていないことを確認
      expect(mockUpdateUserProfile).not.toHaveBeenCalled();
    });

    it('文字数カウンターが正しく表示されること', () => {
      renderComponent();
      const input = screen.getByPlaceholderText('SELF_INTRODUCTION');

      // 入力
      const text = 'test123';
      fireEvent.change(input, { target: { value: 'test123' } });

      // 文字数が正しく表示されていることを確認
      waitFor(() => {
        expect(screen.getByText(`${text.length}/${selfIntroductionMaxLength}`)).toBeInTheDocument();
      });
    });

    it('自己紹介が変更されている場合は更新処理が呼ばれること', async () => {
      renderComponent();
      const input = screen.getByPlaceholderText('SELF_INTRODUCTION');
      const doneButton = screen.getByText('DONE');

      // 入力
      fireEvent.change(input, { target: { value: 'new_self_introduction' } });

      expect(mockUpdateUserProfile).not.toHaveBeenCalled();
      // 完了ボタンをタップ
      fireEvent.click(doneButton);

      // updateUserProfileが正しい引数で呼ばれたことを確認
      expect(mockUpdateUserProfile).toHaveBeenCalledTimes(1);
      expect(mockUpdateUserProfile).toHaveBeenCalledWith(mockUserId, undefined, undefined, undefined, 'new_self_introduction');

      waitFor(() => {
        // backが呼ばれたことを確認
        expect(mockBack).toHaveBeenCalledTimes(1);
      });
    });

    it('1文字も入力されていない場合は、空文字で更新されていること', async () => {
      renderComponent();
      const input = screen.getByPlaceholderText('SELF_INTRODUCTION');

      // 最小文字数未満の入力
      fireEvent.change(input, { target: { value: '' } });

      // エラーメッセージが表示されていることを確認
      waitFor(() => {
        expect(screen.getByText('REQUIRED_ERROR')).toBeInTheDocument();
      });

      const doneButton = screen.getByText('DONE');
      // 完了ボタンをタップ
      fireEvent.click(doneButton);

      // updateUserProfileが正しい引数で呼ばれたことを確認
      expect(mockUpdateUserProfile).toHaveBeenCalledTimes(1);
      expect(mockUpdateUserProfile).toHaveBeenCalledWith(mockUserId, undefined, undefined, undefined, '');

      waitFor(() => {
        // backが呼ばれたことを確認
        expect(mockBack).toHaveBeenCalledTimes(1);
      });
    });
  });
});
