import { mock } from 'jest-mock-extended';
import { fakeTUser } from '@core/shared';
import { TUserRepository } from '@core/domain';
import { UpdateScreenNameUseCase } from './index.ts';

describe('UpdateScreenNameUseCase', () => {
  const tUser = fakeTUser();
  const mockTUserRepository = mock<TUserRepository>();
  const useCase = new UpdateScreenNameUseCase(mockTUserRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('#execute', () => {
    describe('正常系', () => {
      it('TUserRepository#updatePrimaryKey が呼ばれること', async () => {
        await useCase.execute(tUser.id, tUser.screen_name);
        expect(mockTUserRepository.updateByPrimaryKey).toHaveBeenCalledTimes(1);
        expect(mockTUserRepository.updateByPrimaryKey).toHaveBeenCalledWith(tUser.id, tUser.screen_name);
      });
    });
  });
});
