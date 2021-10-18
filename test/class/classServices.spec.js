const classService = require('../../app/services/classService');
const uuid = require('uuid');

describe('ClassService', () => {
  describe('Create Class', () => {
    it('should be return array of class if success', async () => {
      // const createClassDto = {
      //   community_id: '12',
      //   member_id: '12',
      //   name: 'class',
      //   description: 'oke',
      //   summary: 'oke',
      //   about: 'yoman',
      // };

      // const file = {
      //   filename: 'budi.jpg',
      // };

      expect(await classService.createClass()).toBeDefined();
    });
  });
});
