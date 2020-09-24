import express from 'express'
import routes from './routes'
import cors from 'cors'
import dotenv from 'dotenv'

const app = express()

dotenv.config()
app.use(cors())
app.use(express.json())

app.use(routes)
//iniciando o servidor na porta 3333
app.listen(process.env.PORT || 3333)