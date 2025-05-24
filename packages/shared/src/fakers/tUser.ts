import { faker } from '@faker-js/faker';
import { TUsers } from '@core/domain';

export const fakeTUser = (): TUsers => {
  return {
    id: faker.string.uuid(),
    screen_name: faker.string.ulid(),
    created_at: faker.date.anytime().toISOString(),
    updated_at: faker.date.anytime().toISOString(),
    deleted_at: faker.date.anytime().toISOString(),
  };
};
