'use strict';

/**
 * (افتراض) Seed بيانات dev ثابتة لتسهيل التشغيل والاختبار اليدوي.
 * ملاحظة: يجب أن تحقق ideas قاعدة المليون دولار وإلا سترفضها CHECK constraint.
 */
module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('minions', [
      { name: 'Minion 1', title: 'Operator', weaknesses: 'None', salary: 40000, created_at: now, updated_at: now },
      { name: 'Minion 2', title: 'Planner', weaknesses: 'Overthinking', salary: 52000, created_at: now, updated_at: now },
      { name: 'Minion 3', title: 'Closer', weaknesses: 'Too honest', salary: 48000, created_at: now, updated_at: now },
      { name: 'Minion 4', title: 'Builder', weaknesses: 'Scope creep', salary: 61000, created_at: now, updated_at: now },
      { name: 'Minion 5', title: 'QA', weaknesses: 'Perfectionism', salary: 45000, created_at: now, updated_at: now },
      { name: 'Minion 6', title: 'Ops', weaknesses: 'No sleep', salary: 50000, created_at: now, updated_at: now },
      { name: 'Minion 7', title: 'Analyst', weaknesses: 'Too many charts', salary: 53000, created_at: now, updated_at: now },
      { name: 'Minion 8', title: 'Designer', weaknesses: 'Pixel pushing', salary: 47000, created_at: now, updated_at: now },
      { name: 'Minion 9', title: 'PM', weaknesses: 'Meeting overload', salary: 65000, created_at: now, updated_at: now },
      { name: 'Minion 10', title: 'Intern', weaknesses: 'None', salary: 0, created_at: now, updated_at: now },
    ]);

    await queryInterface.bulkInsert('ideas', [
      { name: 'Idea 1', description: 'Test idea', weekly_revenue: 200000, num_weeks: 10, created_at: now, updated_at: now }, // 2,000,000
      { name: 'Idea 2', description: 'Test idea', weekly_revenue: 100000, num_weeks: 10, created_at: now, updated_at: now }, // 1,000,000
      { name: 'Idea 3', description: 'Test idea', weekly_revenue: 50000, num_weeks: 20, created_at: now, updated_at: now },  // 1,000,000
      { name: 'Idea 4', description: 'Test idea', weekly_revenue: 25000, num_weeks: 40, created_at: now, updated_at: now },  // 1,000,000
      { name: 'Idea 5', description: 'Test idea', weekly_revenue: 40000, num_weeks: 30, created_at: now, updated_at: now },  // 1,200,000
    ]);

  

    // (افتراض) نضيف عمل واحد لكل minion بالاعتماد على أن IDs تبدأ من 1 في DB الفارغة
    await queryInterface.bulkInsert('work', [
      { minion_id: 1, title: 'Close deal #3', description: 'Close the biggest deal!', hours: 4, created_at: now, updated_at: now },
      { minion_id: 2, title: 'Close deal #4', description: 'Close the biggest deal!', hours: 2, created_at: now, updated_at: now },
      { minion_id: 3, title: 'Prepare pitch', description: 'Deck + rehearsal', hours: 5, created_at: now, updated_at: now },
      { minion_id: 4, title: 'Bug bash', description: 'Fix urgent issues', hours: 6, created_at: now, updated_at: now },
      { minion_id: 5, title: 'Write tests', description: 'Improve coverage', hours: 3, created_at: now, updated_at: now },
      { minion_id: 6, title: 'Deploy', description: 'Release pipeline', hours: 1, created_at: now, updated_at: now },
      { minion_id: 7, title: 'Analyze KPIs', description: 'Weekly report', hours: 2, created_at: now, updated_at: now },
      { minion_id: 8, title: 'Design review', description: 'UI polish', hours: 4, created_at: now, updated_at: now },
      { minion_id: 9, title: 'Plan sprint', description: 'Backlog grooming', hours: 2, created_at: now, updated_at: now },
      { minion_id: 10, title: 'Shadowing', description: 'Learn the system', hours: 1, created_at: now, updated_at: now },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('work', null, {});
    await queryInterface.bulkDelete('meetings', null, {});
    await queryInterface.bulkDelete('ideas', null, {});
    await queryInterface.bulkDelete('minions', null, {});
  },
};
