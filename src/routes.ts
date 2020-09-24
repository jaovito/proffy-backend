import express from 'express'
import ClassesController from './controllers/ClassesController'
import LoginController from './controllers/LoginController'
import ConnectionsController from './controllers/ConnectionsController'

//rotas

const routes = express.Router()
const classesControllers = new ClassesController()
const connectionsController = new ConnectionsController
const loginController = new LoginController

routes.get('/classes', classesControllers.index)
routes.post('/classes', classesControllers.create)
routes.post('/login', loginController.create)
routes.get('/user', loginController.index)
routes.post('/forgot-password', loginController.forgot)
routes.post('/reset-password', loginController.reset)
routes.post('/connections', connectionsController.create)
routes.get('/connections', connectionsController.index)


export default routes