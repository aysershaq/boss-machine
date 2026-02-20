
const express = require('express')
const {getAllFromDatabase ,getFromDatabaseById,findDataArrayByName,addToDatabase,updateInstanceInDatabase,deleteFromDatabasebyId}= require('../server/db.js')
const checkMillionDollarIdea =require('../server/checkMillionDollarIdea.js')
const ideasRouter = express.Router()
const bodyParser = require('body-parser')
const {db} =require('../server/db.js')
const cors = require('cors');
const path = require('path');


ideasRouter.use(cors()); 





ideasRouter.use(bodyParser.json())


// get all ideas from db
ideasRouter.get('/ideas',(req,res,next)=>{
 let array = getAllFromDatabase("ideas")

  if(array){
  res.status(200).send(array)
}else{
  res.status(400).send('not found')
}
})


// create new idea and save ti to the database 
ideasRouter.post('/ideas',checkMillionDollarIdea,(req,res)=>{

  // {id,name,title,salary} = req.body;
     let data = addToDatabase('ideas',req.body)
      if(data){
     res.status(201).send(data)
      }else{
        res.status(404).send('model not found')
      }

})

// get idea by its id
ideasRouter.get('/ideas/:ideaId',(req,res)=>{
 const minionId = req.params.minionId
const data = getFromDatabaseById("ideas",req.params.ideaId)
  if(data){
    res.status(200).send(data)
  }else{
    res.status(404).send("no id matched")
  }

})

// update existing idea  with an Id
ideasRouter.put('/ideas/:ideaId', (req, res) => {
  const ideaId = req.params.ideaId;

  // Check if idea exists
  const existingIdea = getFromDatabaseById('ideas', ideaId);
  if (!existingIdea) return res.status(404).send();

  // Build updated idea object
  const updatedIdea = {
    id: ideaId,
    name: req.body.name,
    description: req.body.description,
    weeklyRevenue: Number(req.body.weeklyRevenue),
    numWeeks: Number(req.body.numWeeks)
  };

  const persistedIdea = updateInstanceInDatabase('ideas', updatedIdea);
  if (!persistedIdea) return res.status(400).send(); // invalid body

  res.status(200).send(persistedIdea);
});


ideasRouter.delete('/ideas/:id', (req, res) => {

  const deleted = deleteFromDatabasebyId('ideas', req.params.id);
  
 
  if (deleted) {
    res.status(204).send(); // No content, deletion successful
  } else {
    res.status(404).send(); // Idea not found
  }
});


module.exports = ideasRouter