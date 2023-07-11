'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
<<<<<<< HEAD
      User.hasMany(models.Booking, { foreignKey: 'userId' });
      User.hasMany(models.Review, { foreignKey: 'userId' });
      User.hasMany(models.Spot, { foreignKey: 'ownerId' });
      User.belongsToMany(models.Spot, { through: models.Review, foreignKey: "userId", otherKey: "spotId" });
      User.belongsToMany(models.Spot, { through: models.Booking, foreignKey: "userId", otherKey: "spotId" });
=======
      User.hasMany(models.Booking, { foreignKey: 'userId', onDelete: 'CASCADE',
      hooks: true });
      User.hasMany(models.Review, { foreignKey: 'userId', onDelete: 'CASCADE',
      hooks: true });
      User.hasMany(models.Spot, { foreignKey: 'ownerId', onDelete: 'CASCADE',
      hooks: true });
>>>>>>> dev
    }
  };

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 256],
          isEmail: true
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlpha: true
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlpha: true
        }
      },
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
        }
      }
    }
  );
  return User;
};
