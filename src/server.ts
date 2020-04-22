import App from './app'

import * as bodyParser from 'body-parser'
import loggerMiddleware from './middleware/logger'
import CallbackController from './controllers/callback/Callback.controller'

const app = new App({
  port: process.env.PORT || 3000,
  controllers: [
    new CallbackController()
  ],
  middleWares: [
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    loggerMiddleware
  ]
})

app.listen()