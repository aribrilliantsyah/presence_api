'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('presence', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      check_in: {
        type: Sequelize.DATE
      },
      check_out: {
        type: Sequelize.DATE
      },
      position_check_in: {
        type: Sequelize.TEXT
      },
      position_check_out: {
        type: Sequelize.TEXT
      },
      description: {
        type: Sequelize.TEXT
      },
      late: {
        type: Sequelize.BOOLEAN
      },
      late_amount: {
        type: Sequelize.DOUBLE
      },
      full_time: {
        type: Sequelize.BOOLEAN
      },
      remaining_hour: {
        type: Sequelize.DOUBLE
      },
      overtime: {
        type: Sequelize.BOOLEAN
      },
      overtime_start_at: {
        type: Sequelize.DATE
      },
      overtime_end_at: {
        type: Sequelize.DATE
      },
      type: {
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
      idle_amount: {
        type: Sequelize.DOUBLE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('presence');
  }
};