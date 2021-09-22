'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      'user',
      [
        {
          pk: 1,
          id: 'abf9d50e-22d9-4908-b851-d9124d4a0a3e',
          name: 'john',
          profile_pict: 'profile_pict.jpg',
          phone_number: '089603699330',
          confirmed: true,
          email: 'john@gmail.com',
          birthday: '1/2/3',
          password:
            '$2b$10$t7QG.4Kg7bwWSkvaFrs6Meprs6tmbH2IaWGRNdpbtlSxS.u/y6gN2',
          created_at: '2003-01-01 17:00:00.000 +00:00',
          updated_at: '2003-01-01 17:00:00.000 +00:00',
        },
        {
          pk: 2,
          id: '56f12538-4d38-45b6-b7b8-4fbc11ec73f5',
          name: 'budi',
          profile_pict: 'profile_pict.jpg',
          phone_number: '089603699330',
          confirmed: true,
          email: 'budi@gmail.com',
          birthday: '1/2/3',
          password:
            '$2b$10$t7QG.4Kg7bwWSkvaFrs6Meprs6tmbH2IaWGRNdpbtlSxS.u/y6gN2',
          created_at: '2003-01-01 17:00:00.000 +00:00',
          updated_at: '2003-01-01 17:00:00.000 +00:00',
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
