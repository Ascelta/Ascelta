import { IdGenerator } from '@core/domain';
import { IdGeneratorImpl } from './idGeneratorImpl';

export const idGenerator: IdGenerator = new IdGeneratorImpl();