import { TUserRepository } from '@core/domain';

export class UpdateScreenNameUseCase {
  constructor(private readonly tUserRepository: TUserRepository) {}

  execute(userId: string, screenName: string): Promise<void> {
    return this.tUserRepository.updateByPrimaryKey(userId, screenName);
  }
}
