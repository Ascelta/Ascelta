import { mock } from 'jest-mock-extended';
import { fakeTUserProfile } from '@core/shared';
import { IdGenerator, StorageRepository, TUserProfileRepository } from '@core/domain';
import { UpdateUserProfileUseCase } from './index.ts';

describe('UpdateUserProfileUseCase', () => {
  const tUserProfile = fakeTUserProfile();
  const mockIdGenerator = mock<IdGenerator>();
  const mockStorageRepository = mock<StorageRepository>();
  const mockTUserProfileRepository = mock<TUserProfileRepository>();
  const useCase = new UpdateUserProfileUseCase(mockIdGenerator, mockStorageRepository, mockTUserProfileRepository);

  beforeEach(() => {
    jest.clearAllMocks();
    mockTUserProfileRepository.updateByPrimaryKeySelective.mockResolvedValue(tUserProfile);
    mockIdGenerator.generateUuid.mockReturnValue('test-uuid');
    mockStorageRepository.uploadFile.mockResolvedValue('https://example.com/uploaded-image.jpg');
  });

  describe('#execute', () => {
    describe('正常系', () => {
      it('imageUrl, displayName, selfIntroduction が指定された場合、すべてのフィールドが更新されること', async () => {
        const imageUrl = 'file://test-image.jpg';
        const displayName = 'Test Display Name';
        const selfIntroduction = 'Test Self Introduction';

        await useCase.execute(tUserProfile.user_id, imageUrl, displayName, selfIntroduction);

        expect(mockIdGenerator.generateUuid).toHaveBeenCalledTimes(1);
        expect(mockStorageRepository.uploadFile).toHaveBeenCalledWith(
          'users',
          `${tUserProfile.user_id}/avatars`,
          'test-uuid',
          imageUrl
        );
        expect(mockTUserProfileRepository.updateByPrimaryKeySelective).toHaveBeenCalledWith(tUserProfile.user_id, {
          avatar_url: 'https://example.com/uploaded-image.jpg',
          display_name: displayName,
          self_introduction: selfIntroduction,
        });
      });

      it('displayName, selfIntroduction のみが指定された場合、画像は更新されないこと', async () => {
        await useCase.execute(tUserProfile.user_id, undefined, tUserProfile.display_name, tUserProfile.self_introduction);
        
        expect(mockIdGenerator.generateUuid).not.toHaveBeenCalled();
        expect(mockStorageRepository.uploadFile).not.toHaveBeenCalled();
        expect(mockTUserProfileRepository.updateByPrimaryKeySelective).toHaveBeenCalledWith(tUserProfile.user_id, {
          display_name: tUserProfile.display_name,
          self_introduction: tUserProfile.self_introduction,
        });
      });

      it('imageUrl のみが指定された場合、画像のみが更新されること', async () => {
        const imageUrl = 'file://test-image.jpg';

        await useCase.execute(tUserProfile.user_id, imageUrl, undefined, undefined);

        expect(mockIdGenerator.generateUuid).toHaveBeenCalledTimes(1);
        expect(mockStorageRepository.uploadFile).toHaveBeenCalledWith(
          'users',
          `${tUserProfile.user_id}/avatars`,
          'test-uuid',
          imageUrl
        );
        expect(mockTUserProfileRepository.updateByPrimaryKeySelective).toHaveBeenCalledWith(tUserProfile.user_id, {
          avatar_url: 'https://example.com/uploaded-image.jpg',
        });
      });

      it('displayName のみが指定された場合、表示名のみが更新されること', async () => {
        const displayName = 'Test Display Name';

        await useCase.execute(tUserProfile.user_id, undefined, displayName, undefined);

        expect(mockIdGenerator.generateUuid).not.toHaveBeenCalled();
        expect(mockStorageRepository.uploadFile).not.toHaveBeenCalled();
        expect(mockTUserProfileRepository.updateByPrimaryKeySelective).toHaveBeenCalledWith(tUserProfile.user_id, {
          display_name: displayName,
        });
      });

      it('selfIntroduction のみが指定された場合、自己紹介のみが更新されること', async () => {
        const selfIntroduction = 'Test Self Introduction';

        await useCase.execute(tUserProfile.user_id, undefined, undefined, selfIntroduction);

        expect(mockIdGenerator.generateUuid).not.toHaveBeenCalled();
        expect(mockStorageRepository.uploadFile).not.toHaveBeenCalled();
        expect(mockTUserProfileRepository.updateByPrimaryKeySelective).toHaveBeenCalledWith(tUserProfile.user_id, {
          self_introduction: selfIntroduction,
        });
      });

      it('すべてのパラメータが undefined の場合、空の updates で更新されること', async () => {
        await useCase.execute(tUserProfile.user_id, undefined, undefined, undefined);

        expect(mockIdGenerator.generateUuid).not.toHaveBeenCalled();
        expect(mockStorageRepository.uploadFile).not.toHaveBeenCalled();
        expect(mockTUserProfileRepository.updateByPrimaryKeySelective).toHaveBeenCalledWith(tUserProfile.user_id, {});
      });

      it('imageUrl に null が指定された場合、avatar_url が null で更新されること', async () => {
        await useCase.execute(tUserProfile.user_id, null, undefined, undefined);

        expect(mockIdGenerator.generateUuid).not.toHaveBeenCalled();
        expect(mockStorageRepository.uploadFile).not.toHaveBeenCalled();
        expect(mockTUserProfileRepository.updateByPrimaryKeySelective).toHaveBeenCalledWith(tUserProfile.user_id, {
          avatar_url: null,
        });
      });
    });
  });
});
