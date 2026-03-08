'use strict';

require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./models');

/* Do not change the following line! It is required for testing and allowing
 * the frontend application to interact as planned with the api server */
const PORT = process.env.PORT || 4001;

// This conditional is here for testing purposes:
if (require.main === module) {
  (async () => {
    try {
      // (افتراض) فحص الاتصال مبكرًا
      await sequelize.authenticate();
      app.listen(PORT, () => {
        console.log(`server is listening on port ${PORT}`);
      });
    } catch (err) {
      console.error('فشل الاتصال بقاعدة البيانات:', err.message);
      process.exit(1);
    }
  })();
}
