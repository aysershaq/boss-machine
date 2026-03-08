'use strict';

/**
 * (افتراض) Migration واحدة تنشئ كل الجداول + القيود + الفهارس داخل Transaction
 * لأن migrations هي الطريقة المفضلة لتتبع تغييرات المخطط بدل sync() في الإنتاج.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // MINIONS
      await queryInterface.createTable(
        'minions',
        {
          id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
          name: { type: Sequelize.STRING(255), allowNull: false, defaultValue: '' },
          title: { type: Sequelize.STRING(255), allowNull: false, defaultValue: '' },
          weaknesses: { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
          salary: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
          updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
        },
        { transaction }
      );

      // IDEAS
      await queryInterface.createTable(
        'ideas',
        {
          id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
          name: { type: Sequelize.STRING(255), allowNull: false, defaultValue: '' },
          description: { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
          weekly_revenue: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
          num_weeks: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
          updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
        },
        { transaction }
      );

      // MEETINGS
      await queryInterface.createTable(
        'meetings',
        {
          id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
          time: { type: Sequelize.STRING(5), allowNull: false },
          date: { type: Sequelize.DATE, allowNull: false },
          day: { type: Sequelize.STRING(64), allowNull: false },
          note: { type: Sequelize.TEXT, allowNull: false },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
          updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
        },
        { transaction }
      );

      // WORK (تابع لـ MINIONS)
      await queryInterface.createTable(
        'work',
        {
          id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
          minion_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: 'minions', key: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          title: { type: Sequelize.STRING(255), allowNull: false, defaultValue: '' },
          description: { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
          hours: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
          updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
        },
        { transaction }
      );

      // Indexes
      await queryInterface.addIndex('work', ['minion_id'], {
        name: 'work_minion_id_idx',
        transaction,
      });

      await queryInterface.addIndex('meetings', ['date'], {
        name: 'meetings_date_idx',
        transaction,
      });

      // CHECK constraints (PostgreSQL)
      await queryInterface.sequelize.query(
        `ALTER TABLE minions ADD CONSTRAINT minions_salary_chk CHECK (salary >= 0);`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE work ADD CONSTRAINT work_hours_chk CHECK (hours >= 0);`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE ideas ADD CONSTRAINT ideas_weekly_revenue_chk CHECK (weekly_revenue >= 0);`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE ideas ADD CONSTRAINT ideas_num_weeks_chk CHECK (num_weeks >= 0);`,
        { transaction }
      );

      // (افتراض) نفعّل قاعدة المليون دولار على مستوى DB أيضًا
      await queryInterface.sequelize.query(
        `ALTER TABLE ideas ADD CONSTRAINT ideas_million_dollar_chk CHECK ((weekly_revenue * num_weeks) >= 1000000);`,
        { transaction }
      );

      // (افتراض) تحقق صيغة time لجدول الاجتماعات (تقريبي)
      await queryInterface.sequelize.query(
        `ALTER TABLE meetings ADD CONSTRAINT meetings_time_fmt_chk CHECK (time ~ '^(?:[01][0-9]|2[0-3]):[0-5][0-9]$');`,
        { transaction }
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('work', { transaction });
      await queryInterface.dropTable('meetings', { transaction });
      await queryInterface.dropTable('ideas', { transaction });
      await queryInterface.dropTable('minions', { transaction });
    });
  },
};
