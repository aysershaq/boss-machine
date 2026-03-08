'use strict';

const express = require('express');
const { sequelize, Minion, Work } = require('../models');

const workRouter = express.Router();

function isNumericId(value) {
  return typeof value === 'string' && /^[0-9]+$/.test(value);
}

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

function pickWorkPayload(body, forcedMinionId) {
  return {
    title: typeof body.title === 'string' ? body.title : '',
    description: typeof body.description === 'string' ? body.description : '',
    hours: Number.isFinite(Number(body.hours)) ? Number(body.hours) : 0,
    // (افتراض) minionId يُفرض من الـ URL لضمان السلامة
    minionId: Number(forcedMinionId),
  };
}

workRouter.param(
  'minionId',
  asyncHandler(async (req, res, next, minionId) => {
    if (!isNumericId(minionId)) return res.sendStatus(404);

    const minion = await Minion.findByPk(Number(minionId));
    if (!minion) return res.sendStatus(404);

    req.minion = minion;
    next();
  })
);

workRouter.param(
  'workId',
  asyncHandler(async (req, res, next, workId) => {
    if (!isNumericId(workId)) return res.sendStatus(404);

    const work = await Work.findByPk(Number(workId));
    if (!work) return res.sendStatus(404);

    req.work = work;
    next();
  })
);

workRouter.get(
  '/minions/:minionId/work',
  asyncHandler(async (req, res) => {
    const work = await Work.findAll({
      where: { minionId: Number(req.params.minionId) },
      order: [['id', 'ASC']],
    });
    res.status(200).json(work);
  })
);

workRouter.post(
  '/minions/:minionId/work',
  asyncHandler(async (req, res) => {
    // (افتراض) إذا أرسل العميل minionId مختلف في body نرفض
    if (req.body.minionId && String(req.body.minionId) !== String(req.params.minionId)) {
      return res.status(400).send('minionId لا يطابق المسار');
    }

    const created = await sequelize.transaction(async (t) => {
      return Work.create(pickWorkPayload(req.body, req.params.minionId), { transaction: t });
    });

    res.status(201).json(created);
  })
);

workRouter.put(
  '/minions/:minionId/work/:workId',
  asyncHandler(async (req, res) => {
    // إذا workId لا يتبع minionId في المسار نخالف اختبار المشروع الأصلي (400)
    if (String(req.work.minionId) !== String(req.params.minionId)) {
      return res.status(400).send('Work لا يتبع minionId المطلوب');
    }

    const payload = pickWorkPayload(req.body, req.params.minionId);
    await req.work.update(payload);
    res.status(200).json(req.work);
  })
);

workRouter.delete(
  '/minions/:minionId/work/:workId',
  asyncHandler(async (req, res) => {
    if (String(req.work.minionId) !== String(req.params.minionId)) {
      return res.status(400).send('Work لا يتبع minionId المطلوب');
    }

    await req.work.destroy();
    res.sendStatus(204);
  })
);

module.exports = workRouter;
