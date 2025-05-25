import React, { ReactNode, createContext, useContext } from 'react';
import { CheckScreenNameExistenceUseCase, FindSuiteUserUseCase, GetCurrentUserIdUseCase, SignInUseCase, SignOutUseCase, UpdateScreenNameUseCase, UpdateUserProfileUseCase } from '@core/usecase';
import { useCaseContainer } from '../../composition';

export interface UseCaseContainer {
  readonly checkScreenNameExistenceUseCase: CheckScreenNameExistenceUseCase;
  readonly findSuiteUserUseCase: FindSuiteUserUseCase;
  readonly getCurrentUserIdUseCase: GetCurrentUserIdUseCase;
  readonly signInUseCase: SignInUseCase;
  readonly signOutUseCase: SignOutUseCase;
  readonly updateScreenNameUseCase: UpdateScreenNameUseCase;
  readonly updateUserProfileUseCase: UpdateUserProfileUseCase;
}

const UseCaseContext = createContext<UseCaseContainer>(useCaseContainer);

type ProviderProps = {
  container?: Partial<UseCaseContainer>;
  children: ReactNode;
};
export const UseCaseProvider: React.FC<ProviderProps> = ({ container = {}, children }) => {
  const value = { ...useCaseContainer, ...container };
  return <UseCaseContext.Provider value={value}>{children}</UseCaseContext.Provider>;
};

export const useUseCases = () => useContext(UseCaseContext);
