'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class report_detail extends Model {
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
      this.belongsTo(models.report, {
        foreignKey: 'report_id',
        as: 'report'
      })
    }
  }
  report_detail.init({
    user_id: DataTypes.BIGINT,
    report_id: DataTypes.BIGINT,
    date: DataTypes.DATE,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'report_detail',
    timestamps: false,
    freezeTableName: true,
  });
  return report_detail;
};