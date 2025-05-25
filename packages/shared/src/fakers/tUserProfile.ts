import { faker } from '@faker-js/faker';
import { TUserProfiles } from '@core/domain';

export const fakeTUserProfile = (): TUserProfiles => {
  return {
    user_id: faker.string.uuid(),
    display_name: faker.person.fullName(),
    avatar_url: faker.image.avatar(),
    self_introduction: faker.lorem.sentence(),
    created_at: faker.date.anytime().toISOString(),
    updated_at: faker.date.anytime().toISOString(),
    deleted_at: faker.date.anytime().toISOString(),
  };
};
