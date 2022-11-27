'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.User, {
        foreignKey: 'created_by',
        as: 'created_users'
      })

      this.belongsTo(models.User, {
        foreignKey: 'created_by',
        as: 'creator'
      })

      this.hasMany(models.User, {
        foreignKey: 'updated_by',
        as: 'updated_users'
      })

      this.belongsTo(models.User, {
        foreignKey: 'updated_by',
        as: 'updator'
      })

      this.hasMany(models.User, {
        foreignKey: 'deleted_by',
        as: 'deleted_users'
      })

      this.belongsTo(models.User, {
        foreignKey: 'deletor_by',
        as: 'deletor'
      })

      this.hasMany(models.Presence, {
        foreignKey: 'user_id',
        as: 'presences'
      })
    }
  }
  User.init({
    user_code: DataTypes.TEXT,
    username: DataTypes.TEXT,
    password: DataTypes.TEXT,
    email: DataTypes.TEXT,
    account_type: DataTypes.TEXT,
    name: DataTypes.TEXT,
    address: DataTypes.TEXT,
    description: DataTypes.TEXT,
    started_work_at: DataTypes.DATE,
    profile_picture: DataTypes.TEXT,
    created_by: DataTypes.BIGINT,
    updated_by: DataTypes.BIGINT,
    deleted: DataTypes.BOOLEAN,
    deletedAt: DataTypes.DATE,
    deleted_by: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};