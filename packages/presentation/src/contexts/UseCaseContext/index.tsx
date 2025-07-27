import React, { ReactNode, createContext, useContext, useMemo } from 'react';
import { useCaseContainer } from '@core/presentation/composition';
import { UserStoreProvider } from '@core/presentation/stores/userStore';
import { CheckScreenNameExistenceUseCase, FindSuiteUserUseCase, GetCurrentUserIdUseCase, SignInUseCase, SignOutUseCase, UpdateScreenNameUseCase, UpdateUserProfileUseCase } from '@core/usecase';

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
  const value = useMemo(
    () => ({ ...useCaseContainer, ...container }),
    [container]
  );

  const userStoreDependencies = useMemo(
    () => ({
      findSuiteUserUseCase: value.findSuiteUserUseCase,
      updateScreenNameUseCase: value.updateScreenNameUseCase,
      updateUserProfileUseCase: value.updateUserProfileUseCase,
    }),
    [value.findSuiteUserUseCase, value.updateScreenNameUseCase, value.updateUserProfileUseCase]
  );

  return (
    <UseCaseContext.Provider value={value}>
      <UserStoreProvider dependencies={userStoreDependencies}>
        {children}
      </UserStoreProvider>
    </UseCaseContext.Provider>
  );
};

export const useUseCases = () => useContext(UseCaseContext);
