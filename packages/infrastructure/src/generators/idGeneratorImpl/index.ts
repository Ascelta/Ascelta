import uuid from 'react-native-uuid';
import { IdGenerator } from '@core/domain';

export class IdGeneratorImpl implements IdGenerator {
  generateUuid(): string {
    return uuid.v4();
  }
}
