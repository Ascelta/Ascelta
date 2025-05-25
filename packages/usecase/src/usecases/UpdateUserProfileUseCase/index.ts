import { TUserProfileRepository, TUserProfiles } from '@core/domain';

export class UpdateUserProfileUseCase {
  constructor(private readonly tUserProfileRepository: TUserProfileRepository) {}

  async execute(userId: string, displayName?: string, selfIntroduction?: string): Promise<TUserProfiles> {
    return this.tUserProfileRepository.updateByPrimaryKeySelective(userId, {
      display_name: displayName,
      self_introduction: selfIntroduction,
    });
  }
}
