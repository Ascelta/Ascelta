import React, { PropsWithChildren, act } from 'react';
import { faker } from '@faker-js/faker';
import { render, waitFor } from '@testing-library/react';
import { AuthStatus } from '@core/domain';
import { UseCaseProvider } from '../UseCaseContext';
import { AuthProvider, useAuth } from './index.tsx';

const mockGetCurrentUserIdUseCase = jest.fn<Promise<string | undefined>, []>();
const mockSignInUseCase = jest.fn<Promise<void>, [string]>().mockResolvedValue();
const mockSignOutUseCase = jest.fn<Promise<void>, []>().mockResolvedValue();

import { authRepository } from '@core/infrastructure';
const mockOnAuthStateChange = authRepository.onAuthStateChange;

let captured: any;
const Consumer: React.FC = () => {
  const auth = useAuth();
  React.useEffect(() => {
    captured = auth;
  }, [auth]);
  return null;
};

const wrapper: React.FC<PropsWithChildren> = ({ children }) => (
  <UseCaseProvider
    container={
      {
        getCurrentUserIdUseCase: { execute: mockGetCurrentUserIdUseCase },
        signInUseCase: { execute: mockSignInUseCase },
        signOutUseCase: { execute: mockSignOutUseCase },
      } as any
    }
  >
    <AuthProvider>{children}</AuthProvider>
  </UseCaseProvider>
);

describe('<AuthProvider/>', () => {
  const userId = faker.string.uuid();

  beforeEach(() => {
    jest.clearAllMocks();
    captured = undefined;
  });

  describe('正常系', () => {
    it('初回ロード後に、GetCurrentUserIdUseCase#execute で取得した UserId が反映されこと', async () => {
      mockGetCurrentUserIdUseCase.mockResolvedValue(userId);

      await act(async () => {
        render(<Consumer />, { wrapper });
      });
      expect(mockGetCurrentUserIdUseCase).toHaveBeenCalledTimes(1);
      expect(captured.userId).toBe(userId);
    });

    it('signIn 時には、SignInUseCase#execute が呼ばれること', async () => {
      await act(async () => {
        render(<Consumer />, { wrapper });
      });
      expect(mockSignInUseCase).not.toHaveBeenCalled();
      expect(mockSignOutUseCase).not.toHaveBeenCalled();

      await act(async () => {
        await captured.signIn('google');
      });

      expect(mockSignInUseCase).toHaveBeenCalledTimes(1);
      expect(mockSignInUseCase).toHaveBeenCalledWith('google');
      expect(mockSignOutUseCase).not.toHaveBeenCalled();
    });

    it('signOut 時には、SignOutUseCase#execute が呼ばれること', async () => {
      await act(async () => {
        render(<Consumer />, { wrapper });
      });
      expect(mockSignInUseCase).not.toHaveBeenCalled();
      expect(mockSignOutUseCase).not.toHaveBeenCalled();

      await act(async () => {
        await captured.signOut();
      });
      expect(mockSignInUseCase).not.toHaveBeenCalled();
      expect(mockSignOutUseCase).toHaveBeenCalledTimes(1);
    });

    it('onAuthStateChange に渡したコールバック関数が呼ばれた場合に、引数の UserId が反映されること', async () => {
      mockGetCurrentUserIdUseCase.mockResolvedValue(userId);
      const newUserId = faker.string.uuid();
      mockOnAuthStateChange.mockImplementation((cb: (evt: AuthStatus, uid: string | undefined) => void) => {
        cb('SIGNED_IN', newUserId);
        return () => {};
      });

      await act(async () => {
        render(<Consumer />, { wrapper });
      });
      expect(mockGetCurrentUserIdUseCase).toHaveBeenCalledTimes(1);
      expect(captured.userId).toBe(userId);
      expect(mockOnAuthStateChange).toHaveBeenCalledTimes(1);
      waitFor(() => {
        expect(captured.userId).toBe(newUserId);
      });
    });
  });
});
