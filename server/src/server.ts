import express from 'express'
import router from './router'
import morgan from 'morgan'
import cors, { CorsOptions }  from 'cors'
import db from './config/db'
import colors from 'colors'
import swaggerUI from 'swagger-ui-express'
import swaggerSpec, { swaggerUiOptions } from './config/swagger'

// Conectar a DB
export async function connectDB() {
    try {
        await db.authenticate()
        await db.sync()
        // console.log(colors.bold.green('CONEXIÓN EXITOSA A LA DB'))
    } catch(error) {
        // console.log(error)
        console.log(colors.bold.red('HUBO UN ERROR AL CONECTARSE A LA DB'))
    }
}

//Instancia de Express
const server = express()

// Permitir conexiones
const corsOptions : CorsOptions = {
    origin: function(origin, callback) {
        if(origin === process.env.FRONTEND_URL) {
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))
        }
    }
}
server.use(cors(corsOptions))

// Leer datos de formularios
server.use(express.json())

server.use(morgan('dev'))

server.use('/api/products', router)

// Docs
server.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, swaggerUiOptions))

export default server