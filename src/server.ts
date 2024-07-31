import express from 'express';
import dotenv from 'dotenv';
import pool from './config/db';
import routes from './routes';
import cors from 'cors';
import { error } from 'console';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware

const allowedOrigin = '*'

const options: cors.CorsOptions = {
    origin: allowedOrigin
}

/* const frontendIP = process.env.FRONT_IP;
const validateOrigin = (req: any, res: any, next: any) => {
    const requestIP = req.ip;

    if (requestIP !== frontendIP) {
        return res.status(403).json({ error: 'Solicitud no autorizada' });
    }
    next();
}; */


app.use(cors(options));


app.use(express.json());
/* app.use(validateOrigin); */
// The routes are resolved here
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
