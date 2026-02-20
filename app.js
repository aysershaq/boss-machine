const express = require('express');
const app = express();
const cors = require('cors')
const minionsRouter =require('./routes/minionsRouter.js')
const ideasRouter = require('./routes/ideasRouter.js')
const workRouter = require('./routes/workRouter.js')
const meetingRouter = require('./routes/meetingRouter.js')


// Add middleware for handling CORS requests from index.html
app.use(cors())

// Add middware for parsing request bodies here:

app.use(express.json())
// Mount your existing apiRouter below at the '/api' path.
const apiRouter = require('./server/api');


app.use('/api',minionsRouter)
app.use('/api',ideasRouter)
app.use('/api',workRouter)
app.use('/api',meetingRouter)


module.exports = app;