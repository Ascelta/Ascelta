import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { TamaguiProvider } from 'tamagui';
import config from '../../../../../tamagui.config.ts';
import { EditScreenName } from './index';

const screenNameMinLength = 4;
const screenNameMaxLength = 16;
const mockUserId = 'test-user-id';
const mockScreenName = 'screen_name';

// モックの設定
jest.mock('@tamagui/lucide-icons', () => {
  const React = require('react');
  const { Text } = require('tamagui');
  return {
    __esModule: true,
    CircleCheck: () => <Text>CircleCheck</Text>,
    XCircle: () => <Text>XCircle</Text>,
  };
});
jest.mock('@core/shared/configs/appConfig', () => ({
  __esModule: true,
  AppConfig: {
    SCREEN_NAME_MIN_LENGTH: screenNameMinLength,
    SCREEN_NAME_MAX_LENGTH: screenNameMaxLength,
  },
}));
jest.mock('../../../../contexts/UseCaseContext', () => {
  const mockCheckScreenNameExistenceUseCase = {
    execute: jest.fn(),
  };
  return {
    __esModule: true,
    useUseCases: () => ({
      checkScreenNameExistenceUseCase: mockCheckScreenNameExistenceUseCase,
    }),
    mockCheckScreenNameExistenceUseCase: mockCheckScreenNameExistenceUseCase,
  };
});
jest.mock('../../../../stores/userStore', () => {
  const mockUpdateScreenName = jest.fn();
  return {
    __esModule: true,
    useUserStore: (selector: any) => {
      const data = {
        userMap: {
          [mockUserId]: {
            data: {
              vUserDetail: {
                screen_name: mockScreenName,
              },
            },
            isLoading: false,
          },
        },
        updateScreenName: mockUpdateScreenName,
      };
      return selector(data);
    },
    mockUpdateScreenName: mockUpdateScreenName,
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

const mockCheckScreenNameExistenceUseCase = require('../../../../contexts/UseCaseContext').mockCheckScreenNameExistenceUseCase;
const mockUpdateScreenName = require('../../../../stores/userStore').mockUpdateScreenName;
const mockBack = require('solito/router').mockBack;

describe('EditScreenName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderComponent = () => {
    return render(
      <TamaguiProvider config={config}>
        <EditScreenName />
      </TamaguiProvider>,
    );
  };

  describe('正常系', () => {
    it('文字を入力して一定時間後にスクリーンネームの存在チェックが呼ばれること', async () => {
      renderComponent();
      const input = screen.getByPlaceholderText('USERNAME');

      // 入力
      fireEvent.change(input, { target: { value: 'new_username' } });

      // 入力直後は存在チェックが呼ばれないことを確認
      expect(mockCheckScreenNameExistenceUseCase.execute).not.toHaveBeenCalled();

      act(() => {
        // タイマーを進める
        jest.advanceTimersByTime(500);
      });

      // 非同期処理の完了を待つ
      await waitFor(() => {
        expect(mockCheckScreenNameExistenceUseCase.execute).toHaveBeenCalledTimes(1);
      });

      // checkScreenNameExistenceUseCaseが呼ばれたことを確認
      expect(mockCheckScreenNameExistenceUseCase.execute).toHaveBeenCalledWith('new_username');
    });

    it('スクリーンネームが変更されていない場合は更新処理が呼ばれないこと', () => {
      renderComponent();
      const doneButton = screen.getByText('DONE');

      // 完了ボタンをタップ
      fireEvent.click(doneButton);

      // updateScreenNameが呼ばれていないことを確認
      expect(mockUpdateScreenName).not.toHaveBeenCalled();
    });

    it('文字数カウンターが正しく表示されること', () => {
      renderComponent();
      const input = screen.getByPlaceholderText('USERNAME');

      // 入力
      const text = 'test123';
      fireEvent.change(input, { target: { value: 'test123' } });

      // 文字数が正しく表示されていることを確認
      expect(screen.queryByText(`${text.length}/${screenNameMaxLength}`)).toBeInTheDocument();
    });

    it('ステータスが成功の場合に更新処理が呼ばれること', async () => {
      mockCheckScreenNameExistenceUseCase.execute.mockResolvedValue(false);
      renderComponent();
      const input = screen.getByPlaceholderText('USERNAME');
      const doneButton = screen.getByText('DONE');

      // 入力
      fireEvent.change(input, { target: { value: 'new_username' } });

      // タイマーを進める
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // 非同期処理の完了を待つ
      await waitFor(() => {
        expect(screen.getByText('CircleCheck')).toBeInTheDocument();
      });

      // エラーメッセージが表示されていないことを確認
      expect(screen.queryByText('EDIT_SCREEN_NAME_EXISTENCE_ERROR')).not.toBeInTheDocument();
      expect(screen.queryByText('EDIT_SCREEN_NAME_MIN_LENGTH_ERROR')).not.toBeInTheDocument();
      expect(screen.queryByText('EDIT_SCREEN_NAME_REGEXP_ERROR')).not.toBeInTheDocument();
      // エラーアイコンが表示されていないことを確認
      expect(screen.queryByText('XCircle')).not.toBeInTheDocument();

      expect(mockUpdateScreenName).not.toHaveBeenCalled();
      // 完了ボタンをタップ
      fireEvent.click(doneButton);

      // updateScreenNameが正しい引数で呼ばれたことを確認
      expect(mockUpdateScreenName).toHaveBeenCalledTimes(1);
      expect(mockUpdateScreenName).toHaveBeenCalledWith(mockUserId, 'new_username');

      jest.useRealTimers();
      waitFor(() => {
        // backが呼ばれたことを確認
        expect(mockBack).toHaveBeenCalledTimes(1);
      });
    });

    it('ステータスが成功でない場合は更新処理が呼ばれないこと', async () => {
      mockCheckScreenNameExistenceUseCase.execute.mockResolvedValue(true);
      renderComponent();
      const input = screen.getByPlaceholderText('USERNAME');
      const doneButton = screen.getByText('DONE');

      // 入力
      fireEvent.change(input, { target: { value: 'existing_username' } });

      // タイマーを進める
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // 非同期処理の完了を待つ
      await waitFor(() => {
        expect(mockCheckScreenNameExistenceUseCase.execute).toHaveBeenCalledWith('existing_username');
      });

      // 完了ボタンをタップ
      fireEvent.click(doneButton);

      // updateScreenNameが呼ばれていないことを確認
      expect(mockUpdateScreenName).not.toHaveBeenCalled();
    });
  });

  describe('準正常系', () => {
    it('既存のスクリーンネームが存在する場合にエラーが表示され、DONE をタップしても更新処理が呼ばれないこと', async () => {
      mockCheckScreenNameExistenceUseCase.execute.mockResolvedValue(true);
      renderComponent();
      const input = screen.getByPlaceholderText('USERNAME');

      // 入力
      fireEvent.change(input, { target: { value: 'existing_username' } });

      // タイマーを進める
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // 非同期処理の完了を待つ
      await waitFor(() => {
        expect(screen.getByText('EDIT_SCREEN_NAME_EXISTENCE_ERROR')).toBeInTheDocument();
      });

      // エラーメッセージが表示されていることを確認
      expect(screen.queryByText('EDIT_SCREEN_NAME_MIN_LENGTH_ERROR')).not.toBeInTheDocument();
      expect(screen.queryByText('EDIT_SCREEN_NAME_REGEXP_ERROR')).not.toBeInTheDocument();
      // エラーアイコンが表示されていることを確認
      expect(screen.queryByText('CircleCheck')).not.toBeInTheDocument();
      expect(screen.queryByText('XCircle')).toBeInTheDocument();

      const doneButton = screen.getByText('DONE');
      // 完了ボタンをタップ
      fireEvent.click(doneButton);
      // updateScreenNameが呼ばれていないことを確認
      expect(mockUpdateScreenName).not.toHaveBeenCalled();
    });

    it('最小文字数未満の場合にエラーが表示され、DONE をタップしても更新処理が呼ばれないこと', () => {
      renderComponent();
      const input = screen.getByPlaceholderText('USERNAME');

      // 最小文字数未満の入力
      fireEvent.change(input, { target: { value: 'a' } });

      // エラーメッセージが表示されていることを確認
      expect(screen.queryByText('EDIT_SCREEN_NAME_EXISTENCE_ERROR')).not.toBeInTheDocument();
      expect(screen.queryByText('EDIT_SCREEN_NAME_MIN_LENGTH_ERROR')).toBeInTheDocument();
      expect(screen.queryByText('EDIT_SCREEN_NAME_REGEXP_ERROR')).not.toBeInTheDocument();
      // エラーアイコンが表示されていることを確認
      expect(screen.queryByText('CircleCheck')).not.toBeInTheDocument();
      expect(screen.queryByText('XCircle')).toBeInTheDocument();

      const doneButton = screen.getByText('DONE');
      // 完了ボタンをタップ
      fireEvent.click(doneButton);
      // updateScreenNameが呼ばれていないことを確認
      expect(mockUpdateScreenName).not.toHaveBeenCalled();
    });

    it('不正な文字が含まれる場合にエラーが表示され、DONE をタップしても更新処理が呼ばれないこと', () => {
      renderComponent();
      const input = screen.getByPlaceholderText('USERNAME');

      // 不正な文字を含む入力
      fireEvent.change(input, { target: { value: 'invalid@name' } });

      // エラーメッセージが表示されていることを確認
      expect(screen.queryByText('EDIT_SCREEN_NAME_EXISTENCE_ERROR')).not.toBeInTheDocument();
      expect(screen.queryByText('EDIT_SCREEN_NAME_MIN_LENGTH_ERROR')).not.toBeInTheDocument();
      expect(screen.queryByText('EDIT_SCREEN_NAME_REGEXP_ERROR')).toBeInTheDocument();
      // エラーアイコンが表示されていることを確認
      expect(screen.queryByText('CircleCheck')).not.toBeInTheDocument();
      expect(screen.queryByText('XCircle')).toBeInTheDocument();

      const doneButton = screen.getByText('DONE');
      // 完了ボタンをタップ
      fireEvent.click(doneButton);
      // updateScreenNameが呼ばれていないことを確認
      expect(mockUpdateScreenName).not.toHaveBeenCalled();
    });
  });
});
