import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { TamaguiProvider } from 'tamagui';
import config from '../../../../../tamagui.config.ts';
import { EditDisplayName } from './index';

const displayNameMaxLength = 20;
const mockUserId = 'test-user-id';
const mockDisplayName = 'display_name';

// モックの設定
jest.mock('@core/shared/src/configs/appConfig', () => ({
  __esModule: true,
  AppConfig: {
    DISPLAY_NAME_MAX_LENGTH: displayNameMaxLength,
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
                display_name: mockDisplayName,
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

describe('EditDisplayName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderComponent = () => {
    return act(() => {
      return render(
        <TamaguiProvider config={config}>
          <EditDisplayName />
        </TamaguiProvider>,
      );
    });
  };

  describe('正常系', () => {
    it('表示名が変更されていない場合は更新処理が呼ばれないこと', () => {
      renderComponent();
      const doneButton = screen.getByText('DONE');

      // 完了ボタンをタップ
      fireEvent.click(doneButton);

      // updateScreenNameが呼ばれていないことを確認
      expect(mockUpdateUserProfile).not.toHaveBeenCalled();
    });

    it('文字数カウンターが正しく表示されること', () => {
      renderComponent();
      const input = screen.getByPlaceholderText('DISPLAY_NAME');

      // 入力
      const text = 'test123';
      fireEvent.change(input, { target: { value: 'test123' } });

      // 文字数が正しく表示されていることを確認
      expect(screen.queryByText(`${text.length}/${displayNameMaxLength}`)).toBeInTheDocument();
    });

    it('ステータスが成功の場合に更新処理が呼ばれること', async () => {
      renderComponent();
      const input = screen.getByPlaceholderText('DISPLAY_NAME');
      const doneButton = screen.getByText('DONE');

      // 入力
      fireEvent.change(input, { target: { value: 'new_display_name' } });

      // タイマーを進める
      jest.advanceTimersByTime(500);

      // エラーメッセージが表示されていないことを確認
      expect(screen.queryByText('REQUIRED_ERROR')).not.toBeInTheDocument();

      expect(mockUpdateUserProfile).not.toHaveBeenCalled();
      // 完了ボタンをタップ
      fireEvent.click(doneButton);

      // updateScreenNameが正しい引数で呼ばれたことを確認
      expect(mockUpdateUserProfile).toHaveBeenCalledTimes(1);
      expect(mockUpdateUserProfile).toHaveBeenCalledWith(mockUserId, 'new_display_name', undefined);

      jest.useRealTimers();
      waitFor(() => {
        // backが呼ばれたことを確認
        expect(mockBack).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('準正常系', () => {
    it('1文字も入力されていない場合は、必須入力のエラーが表示されていること', async () => {
      renderComponent();
      const input = screen.getByPlaceholderText('DISPLAY_NAME');

      // 最小文字数未満の入力
      fireEvent.change(input, { target: { value: '' } });

      // タイマーを進める
      jest.advanceTimersByTime(500);

      // エラーメッセージが表示されていることを確認
      expect(await screen.findByText('REQUIRED_ERROR')).toBeInTheDocument();

      const doneButton = screen.getByText('DONE');
      // 完了ボタンをタップ
      fireEvent.click(doneButton);
      // updateScreenNameが呼ばれていないことを確認
      expect(mockUpdateUserProfile).not.toHaveBeenCalled();
    });
  });
});
