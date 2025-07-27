import { authRepository, idGenerator, storageRepository, tUserProfileRepository, tUserRepository, vUserDetailRepository, tPostRepository, tPostMediaRepository } from '@core/infrastructure';
import { CheckScreenNameExistenceUseCase, FindSuiteUserUseCase, GetCurrentUserIdUseCase, SignInUseCase, SignOutUseCase, UpdateScreenNameUseCase, UpdateUserProfileUseCase, CreatePostUseCase, UploadPostMediaUseCase } from '@core/usecase';
import { UseCaseContainer } from '@core/presentation/contexts/UseCaseContext';

export const useCaseContainer: UseCaseContainer = {
  checkScreenNameExistenceUseCase: new CheckScreenNameExistenceUseCase(tUserRepository),
  findSuiteUserUseCase: new FindSuiteUserUseCase(vUserDetailRepository),
  getCurrentUserIdUseCase: new GetCurrentUserIdUseCase(authRepository),
  signInUseCase: new SignInUseCase(authRepository),
  signOutUseCase: new SignOutUseCase(authRepository),
  updateScreenNameUseCase: new UpdateScreenNameUseCase(tUserRepository),
  updateUserProfileUseCase: new UpdateUserProfileUseCase(idGenerator, storageRepository, tUserProfileRepository),
  createPostUseCase: new CreatePostUseCase(idGenerator, storageRepository, tPostRepository),
  uploadPostMediaUseCase: new UploadPostMediaUseCase(idGenerator, storageRepository),
};
