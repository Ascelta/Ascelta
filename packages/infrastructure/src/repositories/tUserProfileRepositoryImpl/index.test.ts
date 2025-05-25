import { SupabaseClient } from '@supabase/supabase-js';
import { mock } from 'jest-mock-extended';
import { fakeTUserProfile } from '@core/shared';
import { TUserProfileRepositoryImpl } from './index.ts';

jest.mock('react-native-config', () => ({}));
jest.mock('react-native-app-auth');
jest.mock('@supabase/supabase-js');
describe('TUserProfileRepository', () => {
  const tUserProfile = fakeTUserProfile();
  const mockFrom = jest.fn();
  const mockSelect = jest.fn();
  const mockUpdate = jest.fn();
  const mockEq = jest.fn();
  const mockMaybeSingle = jest.fn();
  const mockSupabaseClient = mock<SupabaseClient>(
    {
      from: mockFrom.mockImplementation(() => ({
        select: mockSelect.mockImplementation(() => ({
          eq: mockEq.mockImplementation(() => ({
            maybeSingle: mockMaybeSingle,
          })),
        })),
        update: mockUpdate.mockImplementation(() => ({
          eq: mockEq,
        })),
      })),
    },
    { deep: true },
  );
  const repository = new TUserProfileRepositoryImpl(mockSupabaseClient);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('#findByPrimaryKey', () => {
    describe('正常系', () => {
      it(`eq に user_id, と渡した引数が渡されていること`, async () => {
        mockMaybeSingle.mockResolvedValue({ data: tUserProfile });
        const userId = tUserProfile.user_id!;
        expect(await repository.findByPrimaryKey(userId)).toBe(tUserProfile);
        expect(mockFrom).toHaveBeenCalledTimes(1);
        expect(mockFrom).toHaveBeenCalledWith('t_user_profiles');
        expect(mockSelect).toHaveBeenCalledTimes(1);
        expect(mockSelect).toHaveBeenCalledWith();
        expect(mockEq).toHaveBeenCalledTimes(1);
        expect(mockEq).toHaveBeenCalledWith('user_id', userId);
        expect(mockMaybeSingle).toHaveBeenCalledTimes(1);
        expect(mockUpdate).not.toHaveBeenCalled();
      });
    });
  });

  describe('#updateByPrimaryKeySelective', () => {
    describe('正常系', () => {
      it(`eq に user_id, と渡した引数が渡されていること`, async () => {
        const updates = { display_name: 'new_display_name' };
        mockEq.mockImplementation(() => ({
          select: mockSelect.mockImplementation(() => ({
            maybeSingle: mockMaybeSingle.mockResolvedValue({
              data: { ...tUserProfile, ...updates },
            }),
          })),
        }));
        const userId = tUserProfile.user_id;
        expect(await repository.updateByPrimaryKeySelective(userId, updates)).toEqual({ ...tUserProfile, ...updates });
        expect(mockFrom).toHaveBeenCalledTimes(1);
        expect(mockFrom).toHaveBeenCalledWith('t_user_profiles');
        expect(mockUpdate).toHaveBeenCalledTimes(1);
        expect(mockUpdate).toHaveBeenCalledWith(updates);
        expect(mockEq).toHaveBeenCalledTimes(1);
        expect(mockEq).toHaveBeenCalledWith('user_id', userId);
        expect(mockSelect).toHaveBeenCalledTimes(1);
        expect(mockMaybeSingle).toHaveBeenCalledTimes(1);
      });
    });

    describe('純系', () => {
      it('Supabase のエラーが発生した場合、エラーをスローすること', async () => {
        const updates = { display_name: 'new_display_name' };
        const userId = tUserProfile.user_id;
        const errorMessage = 'Supabase error';
        mockEq.mockImplementation(() => ({
          select: mockSelect.mockImplementation(() => ({
            maybeSingle: mockMaybeSingle.mockReturnValue({ error: new Error(errorMessage) }),
          })),
        }));

        await expect(repository.updateByPrimaryKeySelective(userId, updates)).rejects.toThrow(`Error updating user profile: ${errorMessage}`);
        expect(mockFrom).toHaveBeenCalledTimes(1);
        expect(mockFrom).toHaveBeenCalledWith('t_user_profiles');
        expect(mockUpdate).toHaveBeenCalledTimes(1);
        expect(mockUpdate).toHaveBeenCalledWith(updates);
        expect(mockEq).toHaveBeenCalledTimes(1);
        expect(mockEq).toHaveBeenCalledWith('user_id', userId);
        expect(mockSelect).toHaveBeenCalledTimes(1);
        expect(mockMaybeSingle).toHaveBeenCalledTimes(1);
      });
    });
  });
});
