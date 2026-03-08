'use strict';

module.exports = (sequelize, DataTypes) => {
  const Minion = sequelize.define(
    'Minion',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        // (افتراض) نُرجع id كسلسلة لتوافق أفضل مع سلوك المشروع الأصلي
        get() {
          const v = this.getDataValue('id');
          return v == null ? v : String(v);
        },
      },
      name: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
      title: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
      weaknesses: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
      salary: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0, // (افتراض) حد أدنى
        },
      },
    },
    {
      tableName: 'minions',
      timestamps: true,
      underscored: true,
      defaultScope: {
        // (افتراض) لا نُظهر timestamps للعميل حتى لا نغير شكل الاستجابة الحالي
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    }
  );

  return Minion;
};
