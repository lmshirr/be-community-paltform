'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try{
      await queryInterface.addIndex(
        'Users',
        ['email'],
        {
          name: 'email',
          unique: true,
          transaction,
        }
      );
      await transaction.commit();
    }catch(error){
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try{
      await queryInterface.removeIndex('Users', 'email', )
    }catch(error){
      await transaction.rollback();
      throw error;
    }
  }
};
