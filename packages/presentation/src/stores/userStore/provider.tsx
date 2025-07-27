import React, { ReactNode, createContext, useContext, useRef } from 'react';
import { StoreApi } from 'zustand';
import { UserStoreType, createUserStore } from '@core/presentation/stores/userStore/store';
import { FindSuiteUserUseCase, UpdateScreenNameUseCase, UpdateUserProfileUseCase } from '@core/usecase';

type UserStoreDependencies = {
  findSuiteUserUseCase: FindSuiteUserUseCase;
  updateScreenNameUseCase: UpdateScreenNameUseCase;
  updateUserProfileUseCase: UpdateUserProfileUseCase;
};

type UserStoreProviderProps = {
  children: ReactNode;
  dependencies: UserStoreDependencies;
};

const UserStoreContext = createContext<StoreApi<UserStoreType> | undefined>(undefined);

export const UserStoreProvider: React.FC<UserStoreProviderProps> = ({ children, dependencies }) => {
  const storeRef = useRef<StoreApi<UserStoreType> | undefined>(undefined);

  if (!storeRef.current) {
    storeRef.current = createUserStore(dependencies);
  }

  return <UserStoreContext.Provider value={storeRef.current}>{children}</UserStoreContext.Provider>;
};

export const useUserStoreInContext = () => {
  const store = useContext(UserStoreContext);
  if (!store) {
    throw new Error('useUserStoreInContext must be used within UserStoreProvider');
  }
  return store;
};
