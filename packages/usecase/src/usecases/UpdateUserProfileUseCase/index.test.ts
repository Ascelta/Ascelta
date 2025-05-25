import { mock } from 'jest-mock-extended';
import { fakeTUserProfile } from '@core/shared';
import { TUserProfileRepository } from '@core/domain';
import { UpdateUserProfileUseCase } from './index.ts';

describe('UpdateUserProfileUseCase', () => {
  const tUserProfile = fakeTUserProfile();
  const mockTUserProfileRepository = mock<TUserProfileRepository>();
  const useCase = new UpdateUserProfileUseCase(mockTUserProfileRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('#execute', () => {
    describe('正常系', () => {
      it('TUserProfileRepository#updateByPrimaryKeySelective が呼ばれること', async () => {
        await useCase.execute(tUserProfile.user_id, tUserProfile.display_name, tUserProfile.self_introduction);
        expect(mockTUserProfileRepository.updateByPrimaryKeySelective).toHaveBeenCalledTimes(1);
        expect(mockTUserProfileRepository.updateByPrimaryKeySelective).toHaveBeenCalledWith(tUserProfile.user_id, {
          display_name: tUserProfile.display_name,
          self_introduction: tUserProfile.self_introduction,
        });
      });
    });
  });
});
