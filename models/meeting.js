'use strict';

module.exports = (sequelize, DataTypes) => {
  const Meeting = sequelize.define(
    'Meeting',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get() {
          const v = this.getDataValue('id');
          return v == null ? v : String(v);
        },
      },
      time: {
        type: DataTypes.STRING(5),
        allowNull: false,
        validate: {
          // (افتراض) تحقق صيغة HH:MM
          is: /^\d{2}:\d{2}$/,
        },
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      day: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: 'meetings',
      timestamps: true,
      underscored: true,
      defaultScope: {
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    }
  );

  return Meeting;
};
