const app = require('./app.js');
const express = require('express')
const path = require('path')
const minionsRouter =require('./routes/minionsRouter.js')

/* Do not change the following line! It is required for testing and allowing
*  the frontend application to interact as planned with the api server
*/
const PORT = process.env.PORT || 4001;


// This conditional is here for testing purposes:
if (require.main === module) { 
  // Add your code to start the server listening at PORT below:
 

 app.use('/api',minionsRouter)
 
  app.listen(PORT,()=>{
    console.log(`server is listening on port ${PORT}`)
  })
}