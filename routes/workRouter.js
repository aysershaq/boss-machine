

const express = require('express')

const {deleteFromDatabasebyId,getAllFromDatabase ,getFromDatabaseById,findDataArrayByName,addToDatabase,addWorkToDatabase,updateInstanceInDatabase,}= require('../server/db.js')
const workRouter = express.Router()
const bodyParser = require('body-parser')
const {db} =require('../server/db.js')
const cors = require('cors');
const path = require('path');
const { Network } = require('inspector/promises')


workRouter.use(cors()); 




workRouter.use(bodyParser.json())


// get all work of selected minion  from db
workRouter.get('/minions/:minionId/work', (req, res, next) => {
  const minionId = req.params.minionId;

  // Get all work from the global work table
  const allWork = getAllFromDatabase('work');

  // Filter only work that belongs to this minion
  const minionWork = allWork.filter(work => work.minionId === minionId);

  res.send(minionWork);
});

workRouter.param('minionId',(req,res,next,id)=>{

  try{
    const foundMinion = getFromDatabaseById("minions",id)
    if(foundMinion){
      req.foundMinion = foundMinion
      next()
    }else{
      next(new Error("no minion with this id found"))
    }
  }catch(err){
    next(err)
  }
}
)

// CREATE new work for specific minion
workRouter.post('/minions/:minionId/work', (req, res, next) => {
  const minionId = req.params.minionId;
  const minion = getFromDatabaseById('minions', minionId);
  if (!minion) return res.status(400).send('Invalid minionId');

  const newWork = { ...req.body, minionId};
  const createdWork = addToDatabase('work', newWork);

  res.status(201).send(createdWork);
});

// edit existing work with specified id 
workRouter.put('/minions/:minionId/work/:workId', (req, res, next) => {
  const newWork = req.body;

  
  newWork.minionId = req.params.minionId;
  newWork.id = req.params.workId

  const updatedWork = updateInstanceInDatabase('work', newWork);
  if (updatedWork) {
    res.status(201).send(updatedWork);
  } else {
    res.status(400).send('Work must have a valid minionId that exists in the database');
  }
});

// delete specified work associated with id 
workRouter.delete('/minions/:minionId/work/:workId', (req, res, next) => {
 

  
   id = req.params.workId

  const deletedWork = deleteFromDatabasebyId('work',id );
  if (deletedWork) { 
    res.status(201).json({status:"deleted successfuly"  , data:deletedWork});
  } else {
    res.status(400).send('Work must have a valid id  that exists in the database');
  }
});
module.exports = workRouter