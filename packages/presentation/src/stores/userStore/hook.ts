import { useStore } from 'zustand';
import { useUserStoreInContext } from '@core/presentation/stores/userStore/provider.tsx';
import { UserStoreType } from '@core/presentation/stores/userStore/store.ts';

export function useUserStore<T>(selector: (state: UserStoreType) => T): T {
  const store = useUserStoreInContext();
  return useStore(store, selector);
}
