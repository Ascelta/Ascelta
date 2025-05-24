import { SupabaseClient } from '@supabase/supabase-js';
import { mock } from 'jest-mock-extended';
import { fakeTUser } from '@core/shared';
import { TUserRepositoryImpl } from '.';

jest.mock('react-native-config', () => ({}));
jest.mock('react-native-app-auth');
jest.mock('@supabase/supabase-js');
describe('TUserRepository', () => {
  const tUser = fakeTUser();
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
  const repository = new TUserRepositoryImpl(mockSupabaseClient);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('#findByPrimaryKey', () => {
    describe('正常系', () => {
      it(`eq に user_id, と渡した引数が渡されていること`, async () => {
        mockMaybeSingle.mockResolvedValue({ data: tUser });
        const id = tUser.id!;
        expect(await repository.findByPrimaryKey(id)).toBe(tUser);
        expect(mockFrom).toHaveBeenCalledTimes(1);
        expect(mockFrom).toHaveBeenCalledWith('t_users');
        expect(mockSelect).toHaveBeenCalledTimes(1);
        expect(mockSelect).toHaveBeenCalledWith();
        expect(mockEq).toHaveBeenCalledTimes(1);
        expect(mockEq).toHaveBeenCalledWith('id', id);
        expect(mockMaybeSingle).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('#findByScreenName', () => {
    describe('正常系', () => {
      it(`eq に screen_name, と渡した引数が渡されていること`, async () => {
        mockMaybeSingle.mockResolvedValue({ data: tUser });
        const screenName = tUser.screen_name!;
        expect(await repository.findByScreenName(screenName)).toBe(tUser);
        expect(mockFrom).toHaveBeenCalledTimes(1);
        expect(mockFrom).toHaveBeenCalledWith('t_users');
        expect(mockSelect).toHaveBeenCalledTimes(1);
        expect(mockSelect).toHaveBeenCalledWith();
        expect(mockEq).toHaveBeenCalledTimes(1);
        expect(mockEq).toHaveBeenCalledWith('screen_name', screenName);
        expect(mockMaybeSingle).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('#existsByScreenName', () => {
    describe('正常系', () => {
      it(`eq に screen_name, と渡した引数が渡されていること`, async () => {
        mockMaybeSingle.mockResolvedValue({ data: tUser });
        const screenName = tUser.screen_name!;
        expect(await repository.existsByScreenName(screenName)).toBe(true);
        expect(mockFrom).toHaveBeenCalledTimes(1);
        expect(mockFrom).toHaveBeenCalledWith('t_users');
        expect(mockSelect).toHaveBeenCalledTimes(1);
        expect(mockSelect).toHaveBeenCalledWith('id');
        expect(mockEq).toHaveBeenCalledTimes(1);
        expect(mockEq).toHaveBeenCalledWith('screen_name', screenName);
        expect(mockMaybeSingle).toHaveBeenCalledTimes(1);
      });
    });

    describe('異常系', () => {
      it(`エラーが発生した場合、例外がスローされること`, async () => {
        mockMaybeSingle.mockResolvedValue({ error: new Error('Database error') });
        const screenName = tUser.screen_name!;
        await expect(repository.existsByScreenName(screenName)).rejects.toThrow('Error checking existence of screen name: Database error');
        expect(mockFrom).toHaveBeenCalledTimes(1);
        expect(mockFrom).toHaveBeenCalledWith('t_users');
        expect(mockSelect).toHaveBeenCalledTimes(1);
        expect(mockSelect).toHaveBeenCalledWith('id');
        expect(mockEq).toHaveBeenCalledTimes(1);
        expect(mockEq).toHaveBeenCalledWith('screen_name', screenName);
        expect(mockMaybeSingle).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('#updateByPrimaryKey', () => {
    describe('正常系', () => {
      it(`eq に id, と渡した引数が渡されていること`, async () => {
        mockMaybeSingle.mockResolvedValue({ data: tUser });
        const id = tUser.id!;
        const screenName = tUser.screen_name!;
        await repository.updateByPrimaryKey(id, screenName);
        expect(mockFrom).toHaveBeenCalledTimes(1);
        expect(mockFrom).toHaveBeenCalledWith('t_users');
        expect(mockSelect).not.toHaveBeenCalled();
        expect(mockUpdate).toHaveBeenCalledTimes(1);
        expect(mockEq).toHaveBeenCalledTimes(1);
        expect(mockEq).toHaveBeenCalledWith('id', id);
        expect(mockMaybeSingle).not.toHaveBeenCalled();
      });
    });
  });
});
