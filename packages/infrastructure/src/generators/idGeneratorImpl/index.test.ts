import { IdGeneratorImpl } from './index';

describe('IdGeneratorImpl', () => {
  const idGenerator = new IdGeneratorImpl();

  describe('generateUuid', () => {
    it('should generate a valid UUID v4 format', () => {
      const uuid = idGenerator.generateUuid();
      
      // UUID v4 regex pattern
      const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      
      expect(uuid).toMatch(uuidV4Regex);
    });

    it('should generate unique UUIDs', () => {
      const uuid1 = idGenerator.generateUuid();
      const uuid2 = idGenerator.generateUuid();
      
      expect(uuid1).not.toBe(uuid2);
    });

    it('should always return a string', () => {
      const uuid = idGenerator.generateUuid();
      
      expect(typeof uuid).toBe('string');
    });

    it('should generate UUIDs with correct length', () => {
      const uuid = idGenerator.generateUuid();
      
      expect(uuid.length).toBe(36);
    });
  });
});
