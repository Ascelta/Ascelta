import React, { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authRepository } from '@core/infrastructure';
import { useUseCases } from '@core/presentation/contexts/UseCaseContext';
import { AuthProviderType } from '@core/domain';

interface Props {
  userId: string | undefined;
  signIn: (provider: AuthProviderType) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<Props | undefined>(undefined);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { getCurrentUserIdUseCase, signInUseCase, signOutUseCase } = useUseCases();
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const userId = await getCurrentUserIdUseCase.execute();
      setUserId(userId);
      setLoading(false);
    })();
    return authRepository.onAuthStateChange((_, userId) => {
      setUserId(userId);
      setLoading(false);
    });
  }, []);

  const signIn = useCallback(async (type: AuthProviderType) => signInUseCase.execute(type), [signInUseCase]);

  const signOut = useCallback(async () => signOutUseCase.execute(), [signOutUseCase]);

  const value: Props = useMemo(
    () => ({
      userId,
      signIn,
      signOut,
    }),
    [userId, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
