import React, { PropsWithChildren } from 'react';
import { renderHook } from '@testing-library/react';
import { useCaseContainer } from '../../composition';
import { UseCaseProvider, useUseCases } from './index.tsx';

jest.mock('../../composition', () => ({
  useCaseContainer: {
    findSuiteUserUseCase: { execute: jest.fn() },
    getCurrentUserIdUseCase: { execute: jest.fn() },
    signInUseCase: { execute: jest.fn() },
    signOutUseCase: { execute: jest.fn() },
  },
}));

describe('<UseCaseProvider/>', () => {
  describe('正常系', () => {
    it('デフォルトの useCaseContainer が取得できること', () => {
      const wrapper: React.FC<PropsWithChildren> = ({ children }) => <UseCaseProvider>{children}</UseCaseProvider>;

      const { result } = renderHook(() => useUseCases(), { wrapper });
      expect(result.current).toStrictEqual(useCaseContainer);
    });

    it('container で個別の useCase を差し替えられること', () => {
      const fakeSignIn = { execute: jest.fn() };
      const wrapper: React.FC<PropsWithChildren> = ({ children }) => <UseCaseProvider container={{ signInUseCase: fakeSignIn as any }}>{children}</UseCaseProvider>;

      const { result } = renderHook(() => useUseCases(), { wrapper });
      expect(result.current).toStrictEqual({
        ...useCaseContainer,
        signInUseCase: fakeSignIn,
      });
    });
  });
});
