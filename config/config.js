
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // عدّل المسار لو .env في مكان مختلف



function must(name) {
  const v = process.env[name];
  if (v === undefined || v === null || v === '') {
    throw new Error(`${name} is missing (check .env path & variable name)`);
  }
  return String(v); // يضمن أنها string
}

module.exports = {
  development: {
    username: must('DB_USER'),
    password: must('DB_PASSWORD'),
    database: must('DB_NAME'),
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    dialect: 'postgres',
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};