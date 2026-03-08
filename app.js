'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const minionsRouter = require('./routes/minionsRouter');
const ideasRouter = require('./routes/ideasRouter');
const meetingRouter = require('./routes/meetingRouter');

const app = express();

// Middleware (cors + json) حسب متطلبات المشروع
app.use(cors());
app.use(express.json());


// Mount routers على /api
app.use('/api', minionsRouter);
app.use('/api', ideasRouter);
app.use('/api', meetingRouter);

// (افتراض) 404 لأي مسار غير معروف
app.use((req, res) => res.sendStatus(404));

// Error-handling middleware (Express يوثّق أن هذا الشكل هو المعتمد للأخطاء)
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const name = err && err.name ? err.name : 'Error';

  // (افتراض) تحويل أخطاء التحقق إلى 400
  if (
    name === 'SequelizeValidationError' ||
    name === 'SequelizeUniqueConstraintError' ||
    name === 'SequelizeForeignKeyConstraintError'
  ) {
    return res.status(400).json({ error: err.message });
  }

  // (افتراض) أخطاء أخرى
  return res.status(500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
  });
});

module.exports = app;
