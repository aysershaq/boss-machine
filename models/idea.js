'use strict';

module.exports = (sequelize, DataTypes) => {
  const Idea = sequelize.define(
    'Idea',
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
      name: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
      description: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },

      weeklyRevenue: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'weekly_revenue',
        validate: { min: 0 },
      },
      numWeeks: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'num_weeks',
        validate: { min: 0 },
      },
    },
    {
      tableName: 'ideas',
      timestamps: true,
      underscored: true,
      defaultScope: {
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      validate: {
        // (افتراض) نطبق قاعدة “المليون دولار” على مستوى الموديل أيضًا (بالإضافة إلى middleware وCHECK)
        millionDollarRule() {
          const weeks = Number(this.numWeeks);
          const revenue = Number(this.weeklyRevenue);
          if (!Number.isFinite(weeks) || !Number.isFinite(revenue)) {
            throw new Error('Invalid weeklyRevenue/numWeeks');
          }
          if (weeks * revenue < 1000000) {
            throw new Error('Idea must be worth at least one million dollars!');
          }
        },
      },
    }
  );

  return Idea;
};
