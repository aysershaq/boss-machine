


const express = require('express')
const {getAllFromDatabase ,createMeeting ,getFromDatabaseById,findDataArrayByName,addToDatabase,deleteAllFromDatabase}= require('../server/db.js')
const meetingRouter = express.Router()
const bodyParser = require('body-parser')
const {db} =require('../server/db.js')
const cors = require('cors');
const path = require('path');


meetingRouter.use(cors()); 




meetingRouter.use(bodyParser.json())


// get all meetings from db
meetingRouter.get('/meetings',(req,res,next)=>{
 let array = getAllFromDatabase("meetings")

  if(array){
  res.status(200).send(array)
}else{
  res.status(400).send('not found')
}
})

// delete all meetings 
meetingRouter.delete('/meetings',(req,res)=>{
  
        
        const deleted =  deleteAllFromDatabase("meetings")
     
      if(deleted){
     res.status(204).json({dataDeleted:"success"})
      }else{
        res.status(404).send('model or index  not found')
      }

})




// create new idea and save ti to the database 
meetingRouter.post('/meetings', (req, res, next) => {
  const newMeeting = createMeeting();           // ✅ must call this
  const added = addToDatabase('meetings', newMeeting);
  res.status(201).send(added);                  // ✅ send the full object
});


module.exports = meetingRouter