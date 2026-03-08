'use strict';

const express = require('express');
const { Meeting } = require('../models');

const meetingRouter = express.Router();

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

// (افتراض) مولد اجتماع بدون faker لتفادي اعتماد runtime على devDependency



meetingRouter.get(
  '/meetings',
  asyncHandler(async (req, res) => {
    const meetings = await Meeting.findAll({ order: [['date', 'ASC']] });
    res.status(200).json(meetings);
  })
);

meetingRouter.post(
  '/meetings',
  asyncHandler(async (req, res) => {
    try{
   console.log("Incoming meeting payload:", req.body);

   const    { time,day,date, note} = req.body
    const created = await Meeting.create({time,date,day,note});
    res.status(201).json({created});
  }catch(err){
console.error('Meeting creation error:', err);
   res.status(500).json({msg:"internl server error",msg:err.message})
  }
  }
)

);

meetingRouter.delete(
  '/meetings',
  asyncHandler(async (req, res) => {
   const deleted =  await Meeting.destroy({ where: {} });
    res.sendStatus(204).json({msg:"deleted sucessfully ",deleted});
  })
);

module.exports = meetingRouter;
