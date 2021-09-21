import mongoose from 'mongoose'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import appGetRoutes from './routes.js'

const app = express()

app.use(bodyParser.json({ limit: '30mb', extended: true}))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true}))
app.use(cors())

app.use('/post', appGetRoutes)

const CONNECTION_URL = 'mongodb+srv://mern:1234@cluster0.9uogc.mongodb.net/my-spotify-app?retryWrites=true&w=majority'
const PORT = process.env.PORT || 5000


mongoose.connect(CONNECTION_URL, { useNewUrlParser: true })
  .then(() => app.listen(PORT, () => console.log('Run')))
  .catch(e => console.error(e))


//mongoose.set('useFindAndModify', false)
