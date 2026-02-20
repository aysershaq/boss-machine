
const express = require('express')
const {getAllFromDatabase ,getFromDatabaseById,findDataArrayByName,addToDatabase,updateInstanceInDatabase,deleteFromDatabasebyId,generateIdForMinions}= require('../server/db.js')
const minionsRouter = express.Router()
const bodyParser = require('body-parser')
const {db} =require('../server/db.js')
const cors = require('cors');
const path = require('path');
const workRouter =require('./workRouter.js')

minionsRouter.use(cors()); 


minionsRouter.use('/', workRouter);

minionsRouter.use(bodyParser.json())




// get all minions from db
minionsRouter.get('/minions',(req,res,next)=>{
 let array = getAllFromDatabase("minions")

  if(array){
  res.status(200).send(array)
}else{
  res.status(400).send('not found')
}
})
// get a minion by its ID
minionsRouter.get('/minions/:minionId',(req,res)=>{
 const minionId = req.params.minionId
const data = getFromDatabaseById("minions",minionId)
  if(data){
    res.status(200).send(data)
  }else{
    res.status(404).send("no id matched")
  }

})

//create a new minion and save it to db 
minionsRouter.post('/minions', (req, res, next) => {
  const newMinion = {
    ...req.body,
    id: generateIdForMinions() // assign a new ID
  };

  const createdMinion = addToDatabase('minions', newMinion);
  res.status(201).send(createdMinion);
});
// update existing minion with an Id
minionsRouter.put('/minions/:id',(req,res)=>{

  const {title,name,salary,weaknesses} = req.body
           const updatedData = updateInstanceInDatabase("minions",{id:req.params.id,title:title,name:name,salary:salary,weaknesses:weaknesses})
     
      if(updatedData){
     res.status(201).send(updatedData)
      }else{
        res.status(404).send('model or index  not found')
      }

})

// delete existing minion with associated id 
minionsRouter.delete('/minions/:id',(req,res)=>{
  
        
        const deleted =  deleteFromDatabasebyId("minions",req.params.id)
     
      if(deleted){
     res.status(204).json({dataDeleted:"success",data:deleted})
      }else{
        res.status(404).send('model or index  not found')
      }

})


module.exports = minionsRouter

// module.exports = generateIdForMinions