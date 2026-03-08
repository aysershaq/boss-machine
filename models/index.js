'use strict';

/**
 * (افتراض) نحمّل env هنا لضمان توفر متغيرات DB حتى لو تم require للموديلات من app.js مباشرة.
 */
require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');

function buildSequelize() {
  const sslEnabled = process.env.PG_SSL === 'true';

  const baseOptions = {
    dialect: 'postgres',
    logging: process.env.SEQUELIZE_LOGGING === 'true' ? console.log : false,
    pool: {
      max: Number(process.env.PG_POOL_MAX || 10),
      min: Number(process.env.PG_POOL_MIN || 0),
      acquire: Number(process.env.PG_POOL_ACQUIRE || 30000),
      idle: Number(process.env.PG_POOL_IDLE || 10000),
    },
    dialectOptions: sslEnabled ? { ssl: { require: true, rejectUnauthorized: false } } : {},
  };

  // (افتراض) ندعم DATABASE_URL (مناسب للنشر) أو قيم PG* المنفصلة (محليًا)
  if (process.env.DATABASE_URL) {
    return new Sequelize(process.env.DATABASE_URL, baseOptions);
  }

  return new Sequelize(
    process.env.PGDATABASE || 'boss_machine',
    process.env.PGUSER || 'boss_user',
    process.env.PGPASSWORD || 'boss_pass',
    {
      ...baseOptions,
      host: process.env.PGHOST || '127.0.0.1',
      port: Number(process.env.PGPORT || 5432),
    }
  );
}

const sequelize = buildSequelize();

const Minion = require('./minion')(sequelize, DataTypes);
const Idea = require('./idea')(sequelize, DataTypes);
const Work = require('./work')(sequelize, DataTypes);
const Meeting = require('./meeting')(sequelize, DataTypes);

// Associations: Minion 1..N Work
Minion.hasMany(Work, {
  as: 'work',
  foreignKey: { name: 'minionId', field: 'minion_id', allowNull: false },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Work.belongsTo(Minion, {
  as: 'minion',
  foreignKey: { name: 'minionId', field: 'minion_id', allowNull: false },
});

module.exports = {
  sequelize,
  Sequelize,
  Minion,
  Idea,
  Work,
  Meeting,
};
