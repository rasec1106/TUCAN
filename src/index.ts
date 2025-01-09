import express from 'express'
import jiraRouter from './routes/jiraRouter'
import lmRouter from './routes/lmRouter'
import validatorRouter from './routes/validatorRouter'
import configurationRouter from './routes/configurationRouter'
import fileRouter from './routes/fileRouter'
import { errorHandler } from './middleware/errorHandler'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import * as swaggerDoc from './swagger.json'

const app = express()
app.use(express.json())

const PORT = 3000

app.get('/ping', (_req, res) => {
  res.send('pong')
})

app.use('/api/jira', jiraRouter)
app.use('/api/lm', lmRouter)
app.use('/api/validator', validatorRouter)
app.use('/api/config', configurationRouter)
app.use('/api/file', fileRouter)

app.use(errorHandler)

// Configure the app to use Swagger
const swaggerOptions = {
  swaggerDefinition: swaggerDoc,
  apis: ['./routes/*.ts']
}
const swaggerDocs = swaggerJsdoc(swaggerOptions)
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`)
})
