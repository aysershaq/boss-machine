'use strict';

const express = require('express');
const { Minion } = require('../models');
const workRouter = require('./workRouter');

const minionsRouter = express.Router();

function isNumericId(value) {
  return typeof value === 'string' && /^[0-9]+$/.test(value);
}

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

function pickMinionPayload(body) {
  // (افتراض) نسمح فقط بهذه الحقول
  return {
    name: typeof body.name === 'string' ? body.name : '',
    title: typeof body.title === 'string' ? body.title : '',
    weaknesses: typeof body.weaknesses === 'string' ? body.weaknesses : '',
    salary: Number.isFinite(Number(body.salary)) ? Number(body.salary) : 0,
  };
}

// (افتراض) تمرير work routes من هنا (أو يمكن Mount في app.js)
minionsRouter.use('/', workRouter);

minionsRouter.param(
  'minionId',
  asyncHandler(async (req, res, next, minionId) => {
    if (!isNumericId(minionId)) return res.sendStatus(404);

    const minion = await Minion.findByPk(Number(minionId));
    if (!minion) return res.sendStatus(404);

    req.minion = minion;
    next();
  })
);

minionsRouter.get(
  '/minions',
  asyncHandler(async (req, res) => {
    const minions = await Minion.findAll({ order: [['id', 'ASC']] });
    res.status(200).json(minions);
  })
);

minionsRouter.get('/minions/:minionId', (req, res) => {
  res.status(200).json(req.minion);
});

minionsRouter.post(
  '/minions',
  asyncHandler(async (req, res) => {
    const payload = pickMinionPayload(req.body);
    const created = await Minion.create(payload);
    res.status(201).json(created);
  })
);

minionsRouter.put(
  '/minions/:minionId',
  asyncHandler(async (req, res) => {
    const payload = pickMinionPayload(req.body);
    await req.minion.update(payload);
    res.status(200).json(req.minion);
  })
);

minionsRouter.delete(
  '/minions/:minionId',
  asyncHandler(async (req, res) => {
    await req.minion.destroy();
    res.sendStatus(204);
  })
);

module.exports = minionsRouter;
