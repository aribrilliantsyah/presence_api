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
      subimission_at: {
        type: Sequelize.DATE
      },
      submission_status: {
        type: Sequelize.TEXT
      },
      user_id: {
        type: Sequelize.BIGINT,
        references: {        
          model: 'user',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      attachment: {
        type: Sequelize.TEXT
      },
      overtime_at: {
        type: Sequelize.DATE
      },
      approvedAt: {
        type: Sequelize.DATE
      },
      approved_by: {
        allowNull: true,
        type: Sequelize.BIGINT,
        references: {        
          model: 'user',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      rejectedAt: {
        type: Sequelize.DATE
      },
      rejected_by: {
        allowNull: true,
        type: Sequelize.BIGINT,
        references: {        
          model: 'user',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('overtime');
  }
};