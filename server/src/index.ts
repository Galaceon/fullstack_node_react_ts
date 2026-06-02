import colors from 'colors'
import server, { connectDB } from './server'

const port = process.env.PORT || 4000

connectDB().then(() => {
    server.listen(port, () => {
        console.log(colors.cyan.bold(`REST API en puerto ${port}`))
    })
})