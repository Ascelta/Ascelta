import { create } from 'zustand';
import { SuiteUser } from '@core/domain';
import { useUseCases } from '../../contexts/UseCaseContext';

type Data = {
  data?: SuiteUser;
  isInitialized: boolean;
  isLoading: boolean;
  error?: Error;
};

type State = {
  userMap: Record<string, Data>;
  userIds: Array<string>;
};

type Action = {
  fetchUser: (userId: string) => Promise<void>;
  updateScreenName: (userId: string, screenName: string) => Promise<void>;
};

export const useUserStore = create<State & Action>((set, get) => {
  const { findSuiteUserUseCase, updateScreenNameUseCase } = useUseCases();
  return {
    userMap: {},
    userIds: [],
    fetchUser: async (userId: string) => {
      try {
        set(state => ({
          ...state,
          userMap: { ...state.userMap, [userId]: { isInitialized: false, isLoading: true, data: undefined } },
        }));
        const suiteUser = await findSuiteUserUseCase.execute(userId);
        if (suiteUser) {
          set(state => ({
            ...state,
            userMap: { ...state.userMap, [userId]: { isInitialized: true, isLoading: false, data: suiteUser } },
          }));
        }
      } catch (error) {
        set(state => ({
          ...state,
          userMap: { ...state.userMap, [userId]: { isInitialized: true, isLoading: false, error: error as Error } },
        }));
      }
    },
    updateScreenName: async (userId: string, screenName: string) => {
      set(state => ({
        ...state,
        userMap: {
          ...state.userMap,
          [userId]: {
            ...state.userMap[userId],
            isLoading: true,
          },
        },
      }));
      const state = get();
      const data = state.userMap[userId];
      if (!data || !data.data) {
        throw new Error(`User data for userId ${userId} not found in userMap.`);
      }
      try {
        await updateScreenNameUseCase.execute(userId, screenName);
        set(state => {
          return {
            ...state,
            userMap: {
              ...state.userMap,
              [userId]: {
                ...data,
                data: {
                  ...data.data,
                  vUserDetail: {
                    ...data.data!.vUserDetail,
                    screen_name: screenName,
                  },
                },
                isLoading: false,
              },
            },
          };
        });
      } catch (error) {
        set(state => ({
          ...state,
          userMap: {
            ...state.userMap,
            [userId]: {
              ...state.userMap[userId],
              isLoading: false,
              error: error as Error,
            },
          },
        }));
      }
    },
  };
});
