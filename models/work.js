'use strict';

module.exports = (sequelize, DataTypes) => {
  const Work = sequelize.define(
    'Work',
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
      title: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
      description: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
      hours: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
      },
      minionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'minion_id',
        // (افتراض) نُرجع minionId كسلسلة للعميل
        get() {
          const v = this.getDataValue('minionId');
          return v == null ? v : String(v);
        },
        set(value) {
          // (افتراض) نقبل string/number ونحوّل
          const n = Number(value);
          this.setDataValue('minionId', Number.isFinite(n) ? n : value);
        },
      },
    },
    {
      tableName: 'work',
      timestamps: true,
      underscored: true,
      defaultScope: {
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    }
  );

  return Work;
};
