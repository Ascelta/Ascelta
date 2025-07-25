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
  loadingByUserId: (userId: string) => void;
  errorByUserId: (userId: string, error: Error) => void;
  fetchUser: (userId: string) => Promise<void>;
  updateScreenName: (userId: string, screenName: string) => Promise<void>;
  updateUserProfile: (userId: string, imageUrl?: string | null, screenName?: string, displayName?: string, selfIntroduction?: string) => Promise<void>;
};

export const useUserStore = create<State & Action>((set, get) => {
  const { findSuiteUserUseCase, updateScreenNameUseCase, updateUserProfileUseCase } = useUseCases();
  return {
    userMap: {},
    userIds: [],
    loadingByUserId: (userId: string) => {
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
    },
    errorByUserId: (userId: string, error: Error) => {
      set(state => ({
        ...state,
        userMap: {
          ...state.userMap,
          [userId]: {
            ...state.userMap[userId],
            isLoading: false,
            error,
          },
        },
      }));
    },
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
      const state = get();
      state.loadingByUserId(userId);
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
                data: new SuiteUser({
                  ...data.data!.vUserDetail,
                  screen_name: screenName,
                }),
                isLoading: false,
              },
            },
          };
        });
      } catch (error) {
        state.errorByUserId(userId, error as Error);
      }
    },
    updateUserProfile: async (userId: string, imageUrl?: string | null, screenName?: string, displayName?: string, selfIntroduction?: string) => {
      const state = get();
      state.loadingByUserId(userId);
      const data = state.userMap[userId];
      if (!data || !data.data) {
        throw new Error(`User data for userId ${userId} not found in userMap.`);
      }
      try {
        if (screenName) {
          await updateScreenNameUseCase.execute(userId, screenName);
        }
        const tUserProfile = await updateUserProfileUseCase.execute(userId, imageUrl, displayName, selfIntroduction);
        set(state => {
          return {
            ...state,
            userMap: {
              ...state.userMap,
              [userId]: {
                ...data,
                data: new SuiteUser({
                  ...data.data!.vUserDetail,
                  avatar_url: tUserProfile.avatar_url,
                  display_name: tUserProfile.display_name,
                  self_introduction: tUserProfile.self_introduction,
                }),
                isLoading: false,
              },
            },
          };
        });
      } catch (error) {
        state.errorByUserId(userId, error as Error);
      }
    },
  };
});
