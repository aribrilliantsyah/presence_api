'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class overtime extends Model {
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
  overtime.init({
    user_id: DataTypes.BIGINT,
    overtime_at: DataTypes.DATE,
    overtime_status: DataTypes.TEXT,
    desc: DataTypes.TEXT,
    attachment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'overtime',
    timestamps: false,
    freezeTableName: true,
  });
  return overtime;
};