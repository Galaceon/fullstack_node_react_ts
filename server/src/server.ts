import express from 'express'
import router from './router'
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

// Leer datos de formularios
server.use(express.json())

server.use('/api/products', router)

// Docs
server.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, swaggerUiOptions))

export default server