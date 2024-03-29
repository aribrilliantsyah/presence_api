'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('overtime', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {        
          model: 'user',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      overtime_at: {
        type: Sequelize.DATE
      },
      overtime_status: {
        type: Sequelize.TEXT
      },
      desc: {
        type: Sequelize.TEXT
      },
      attachment: {
        type: Sequelize.TEXT
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('overtime');
  }
};