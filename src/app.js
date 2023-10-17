import express from 'express'
import preguntasRoutes from './routes/preguntas.routes.js'
import indexRoutes from './routes/index.routes.js'

const app = express()

app.use(express.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Esto permite todas las solicitudes, puedes restringirlo a un dominio específico en producción.
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(indexRoutes)
app.use( '/api', preguntasRoutes)

app.use((req, res, next) => {
    res.status(404).json({
        message: 'endpoint no encontrada'
    })
})

export default app;