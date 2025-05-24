import { TUserRepository } from '@core/domain';

export class CheckScreenNameExistenceUseCase {
  constructor(private readonly tUserRepository: TUserRepository) {}

  execute(screenName: string): Promise<boolean> {
    return this.tUserRepository.existsByScreenName(screenName);
  }
}
