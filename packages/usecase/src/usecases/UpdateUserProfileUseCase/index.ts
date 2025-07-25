import { IdGenerator, StorageRepository, TUserProfileRepository, TUserProfiles } from '@core/domain';

export class UpdateUserProfileUseCase {
  private static _avatarFolderName = 'avatars';

  constructor(
    private readonly idGenerator: IdGenerator,
    private readonly storageRepository: StorageRepository,
    private readonly tUserProfileRepository: TUserProfileRepository,
  ) {}

  async execute(userId: string, imageUrl?: string | null, displayName?: string, selfIntroduction?: string): Promise<TUserProfiles> {
    const updates: Partial<Omit<TUserProfiles, 'user_id' | 'created_at' | 'updated_at'>> = {};

    if (imageUrl !== undefined) {
      updates.avatar_url = await this.uploadImage(userId, imageUrl);
    }
    if (displayName !== undefined) {
      updates.display_name = displayName;
    }
    if (selfIntroduction !== undefined) {
      updates.self_introduction = selfIntroduction;
    }

    return this.tUserProfileRepository.updateByPrimaryKeySelective(userId, updates);
  }

  private async uploadImage(userId: string, imageUrl: string | null): Promise<string | null> {
    if (imageUrl == null) {
      return null;
    }
    return await this.storageRepository.uploadFile('users', `${userId}/${UpdateUserProfileUseCase._avatarFolderName}`, this.idGenerator.generateUuid(), imageUrl);
  }
}
