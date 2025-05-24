import { faker } from '@faker-js/faker';
import { mock } from 'jest-mock-extended';
import { TUserRepository } from '@core/domain';
import { CheckScreenNameExistenceUseCase } from './index.ts';

describe('CheckScreenNameExistenceUseCase', () => {
  const mockTUserRepository = mock<TUserRepository>();
  const useCase = new CheckScreenNameExistenceUseCase(mockTUserRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('#execute', () => {
    describe('正常系', () => {
      it('TUserRepository#getCurrentUserId が呼ばれること', async () => {
        const screenName = faker.internet.username();
        const b = faker.datatype.boolean();
        mockTUserRepository.existsByScreenName.mockResolvedValue(b);
        expect(await useCase.execute(screenName)).toBe(b);
        expect(mockTUserRepository.existsByScreenName).toHaveBeenCalledTimes(1);
        expect(mockTUserRepository.existsByScreenName).toHaveBeenCalledWith(screenName);
      });
    });
  });
});
