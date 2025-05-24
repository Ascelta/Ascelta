import { act, renderHook } from '@testing-library/react';
import { fakeVUserDetail } from '@core/shared';
import { SuiteUser } from '@core/domain';
import { useUserStore } from './index';

// モックの設定
jest.mock('../../contexts/UseCaseContext', () => {
  const mockFindSuiteUserUseCase = {
    execute: jest.fn(),
  };
  const mockUpdateScreenNameUseCase = {
    execute: jest.fn(),
  };
  return {
    __esModule: true,
    useUseCases: () => ({
      findSuiteUserUseCase: mockFindSuiteUserUseCase,
      updateScreenNameUseCase: mockUpdateScreenNameUseCase,
    }),
    mockFindSuiteUserUseCase: mockFindSuiteUserUseCase,
    mockUpdateScreenNameUseCase: mockUpdateScreenNameUseCase,
  };
});

const mockFindSuiteUserUseCase = require('../../contexts/UseCaseContext').mockFindSuiteUserUseCase;
const mockUpdateScreenNameUseCase = require('../../contexts/UseCaseContext').mockUpdateScreenNameUseCase;

describe('useUserStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('#fetchUser', () => {
    const mockUserId = 'test-user-id';
    const mockVUserDetail = fakeVUserDetail();
    const mockSuiteUser = new SuiteUser(mockVUserDetail);

    describe('正常系', () => {
      it('ユーザー情報の取得に成功すること', async () => {
        mockFindSuiteUserUseCase.execute.mockResolvedValue(mockSuiteUser);
        const { result } = renderHook(() => useUserStore());

        // 初期状態の確認
        expect(result.current.userMap).toEqual({});

        // fetchUserの実行
        await act(async () => {
          await result.current.fetchUser(mockUserId);
        });

        // ローディング状態の確認
        expect(result.current.userMap[mockUserId]).toEqual({
          isInitialized: true,
          isLoading: false,
          data: mockSuiteUser,
        });

        // findSuiteUserUseCaseが正しく呼ばれたことを確認
        expect(mockFindSuiteUserUseCase.execute).toHaveBeenCalledTimes(1);
        expect(mockFindSuiteUserUseCase.execute).toHaveBeenCalledWith(mockUserId);
      });
    });

    describe('異常系', () => {
      it('FindSuiteUserUseCase#execute でエラーが発生した場合は、ユーザー情報の取得に失敗すること', async () => {
        const mockError = new Error('Failed to fetch user');
        mockFindSuiteUserUseCase.execute.mockRejectedValue(mockError);
        const { result } = renderHook(() => useUserStore());

        // fetchUserの実行
        await act(async () => {
          await result.current.fetchUser(mockUserId);
        });

        // エラー状態の確認
        expect(result.current.userMap[mockUserId]).toEqual({
          isInitialized: true,
          isLoading: false,
          error: mockError,
        });

        // findSuiteUserUseCaseが正しく呼ばれたことを確認
        expect(mockFindSuiteUserUseCase.execute).toHaveBeenCalledTimes(1);
        expect(mockFindSuiteUserUseCase.execute).toHaveBeenCalledWith(mockUserId);
      });
    });
  });

  describe('#updateScreenName', () => {
    const mockUserId = 'test-user-id';
    const mockScreenName = 'new_screen_name';
    const mockVUserDetail = fakeVUserDetail();
    const mockInitialUserData = new SuiteUser(mockVUserDetail);

    describe('正常系', () => {
      it('スクリーンネームの更新に成功すること', async () => {
        mockUpdateScreenNameUseCase.execute.mockResolvedValue(undefined);
        const { result } = renderHook(() => useUserStore());

        // 初期データの設定
        act(() => {
          result.current.userMap = {
            [mockUserId]: {
              isInitialized: true,
              isLoading: false,
              data: mockInitialUserData,
            },
          };
        });

        // updateScreenNameの実行
        await act(async () => {
          await result.current.updateScreenName(mockUserId, mockScreenName);
        });

        // 更新後の状態の確認
        expect(result.current.userMap[mockUserId]).toEqual({
          isInitialized: true,
          isLoading: false,
          data: {
            vUserDetail: {
              ...mockVUserDetail,
              screen_name: mockScreenName,
            },
          },
        });

        // updateScreenNameUseCaseが正しく呼ばれたことを確認
        expect(mockUpdateScreenNameUseCase.execute).toHaveBeenCalledTimes(1);
        expect(mockUpdateScreenNameUseCase.execute).toHaveBeenCalledWith(mockUserId, mockScreenName);
      });
    });

    describe('異常系', () => {
      it('UpdateScreenNameUseCase#execute でエラーが発生した場合は、更新に失敗すること', async () => {
        const mockError = new Error('Failed to update screen name');
        mockUpdateScreenNameUseCase.execute.mockRejectedValue(mockError);
        const { result } = renderHook(() => useUserStore());

        // 初期データの設定
        act(() => {
          result.current.userMap = {
            [mockUserId]: {
              isInitialized: true,
              isLoading: false,
              data: mockInitialUserData,
            },
          };
        });

        // updateScreenNameの実行
        await act(async () => {
          await result.current.updateScreenName(mockUserId, mockScreenName);
        });

        // エラー状態の確認
        expect(result.current.userMap[mockUserId]).toEqual({
          isInitialized: true,
          isLoading: false,
          error: mockError,
          data: mockInitialUserData,
        });

        // updateScreenNameUseCaseが正しく呼ばれたことを確認
        expect(mockUpdateScreenNameUseCase.execute).toHaveBeenCalledTimes(1);
        expect(mockUpdateScreenNameUseCase.execute).toHaveBeenCalledWith(mockUserId, mockScreenName);
      });

      it('ユーザーデータが存在しない場合にエラーが発生すること', async () => {
        const userId = 'not-exists-user-id';
        const { result } = renderHook(() => useUserStore());

        // updateScreenNameの実行
        await act(async () => {
          await expect(result.current.updateScreenName(userId, mockScreenName)).rejects.toThrow(`User data for userId ${userId} not found in userMap.`);
        });

        // updateScreenNameUseCaseが呼ばれていないことを確認
        expect(mockUpdateScreenNameUseCase.execute).not.toHaveBeenCalled();
      });
    });
  });
});
