'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class absence extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // console.log(models)
      // define association here
      this.belongsTo(models.absence_type, {
        foreignKey: 'absence_type_id',
        as: 'absence_type'
      })
      this.belongsTo(models.user, {
        foreignKey: 'user_id',
        as: 'user'
      })
    }
  }
  absence.init({
    user_id: DataTypes.BIGINT,
    absence_at: DataTypes.DATE,
    absence_status: DataTypes.TEXT,
    absence_type_id: DataTypes.BIGINT,
    cut_annual_leave: DataTypes.BOOLEAN,
    desc: DataTypes.TEXT,
    attachment: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'absence',
    timestamps: false,
    freezeTableName: true,
  });
  return absence;
};