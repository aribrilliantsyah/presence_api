'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class presence extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user, {
        foreignKey: 'user_id',
        as: 'user'
      })
    }
  }
  presence.init({
    check_in: DataTypes.DATE,
    check_out: DataTypes.DATE,
    position_check_in: DataTypes.TEXT,
    position_check_out: DataTypes.TEXT,
    description: DataTypes.TEXT,
    late: DataTypes.BOOLEAN,
    late_amount: DataTypes.DOUBLE,
    full_time: DataTypes.BOOLEAN,
    remaining_hour: DataTypes.DOUBLE,
    overtime: DataTypes.BOOLEAN,
    overtime_start_at: DataTypes.DATE,
    overtime_end_at: DataTypes.DATE,
    type: DataTypes.TEXT,
    user_id: DataTypes.BIGINT,
    idle_amount: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'presence',
    timestamps: false,
    freezeTableName: true,
  });
  return presence;
};