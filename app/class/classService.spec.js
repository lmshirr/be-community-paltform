const classService = require('./classService');
const uuid = require('uuid');

describe('classService', () => {
  describe('create class', () => {
    it('should return object', async () => {
      const createClassDto = {
        community_id: uuid.v4(),
        member_id: uuid.v4(),
        name: 'haris',
        description: 'this is class',
        summary: 'this is course/class summary',
        about: 'this is course/class about',
      };
      const file = {
        filename: 'dfskjff.jpg',
      };

      expect(
        await classService.createClass(createClassDto, file)
      ).toBeDefined();
    });
  });
});
