'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'community',
      [
        {
          id: '45d2035f-767c-41d2-be5b-47d6d6f1770d',
          created_at: '2021-09-22T01:26:27.729Z',
          updated_at: '2021-09-22T01:26:27.729Z',
          pk: 13,
          name: 'olahraaga',
          type: 'test',
          description: 'testdfdfds',
          community_pict: 'com_pict.jpg',
          privacy: 'closed',
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
