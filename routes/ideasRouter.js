'use strict';

const express = require('express');
const { Idea } = require('../models');
const checkMillionDollarIdea = require('../server/checkMillionDollarIdea');

const ideasRouter = express.Router();

function isNumericId(value) {
  return typeof value === 'string' && /^[0-9]+$/.test(value);
}

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

function pickIdeaPayload(body) {
  return {
    name: typeof body.name === 'string' ? body.name : '',
    description: typeof body.description === 'string' ? body.description : '',
    weeklyRevenue: Number.isFinite(Number(body.weeklyRevenue)) ? Number(body.weeklyRevenue) : 0,
    numWeeks: Number.isFinite(Number(body.numWeeks)) ? Number(body.numWeeks) : 0,
  };
}

// ideasRouter.param(
//   'ideaId',
//   asyncHandler(async (req, res, next, ideaId) => {
//     if (!isNumericId(ideaId)) return res.sendStatus(404);

//     const idea = await Idea.findByPk(Number(ideaId));
//     if (!idea) return res.sendStatus(404);

//     req.idea = idea;
//     next();
//   })
// );

ideasRouter.get(
  '/ideas',
  asyncHandler(async (req, res) => {
    const ideas = await Idea.findAll({ order: [['id', 'ASC']] });
    res.status(200).json(ideas);
  })
);

ideasRouter.get('/ideas/:ideaId',async (req, res) => {

  const ideaID = req.params.ideaId
  console.log(ideaID)

  try{
if (!isNumericId(ideaID)) return res.sendStatus(404);

    const idea = await Idea.findByPk(Number(ideaID));
    if (!idea) return res.sendStatus(404);

   res.status(200).json(idea)
  }catch(err){
   res.status(500).json({msg:"internl server error",msg:err.message})
  }
   
});

ideasRouter.post(
  '/ideas',
  checkMillionDollarIdea,
  asyncHandler(async (req, res) => {
    const created = await Idea.create(pickIdeaPayload(req.body));
    res.status(201).json(created);
  })
);

// (افتراض) نفعل checkMillionDollarIdea أيضًا في PUT لسلامة البيانات
ideasRouter.put(
  '/ideas/:ideaId',
  checkMillionDollarIdea,
  asyncHandler(async (req, res) => {
     const ideaID = req.params.ideaId

     const {name,description,numWeeks,weeklyRevenue} = req.body
   try{
    if (!isNumericId(ideaID)) return res.sendStatus(404);
    const updated = await Idea.update({name,description,numWeeks,weeklyRevenue},{where:{id:ideaID}})
   res.status(200).json({status:"updated success",updated})
  }catch(err){

       res.status(500).json({msg:"internl server error",msg:err.message})


  }
})
);

ideasRouter.delete(
  '/ideas/:ideaId',
  asyncHandler(async (req, res) => {

    const ideaID = req.params.ideaId
   try{
    if (!isNumericId(ideaID)) return res.sendStatus(404);
    const deleted = await Idea.destroy({where:{id:ideaID}})

    res.status(204).json({status:"deleted sucessfully",deleted})
   }catch(err){

   res.status(500).json({msg:"internl server error",msg:err.message})
   }
  })
);

module.exports = ideasRouter;
