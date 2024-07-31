"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
const allowedOrigin = '*';
const options = {
    origin: allowedOrigin
};
/* const frontendIP = process.env.FRONT_IP;
const validateOrigin = (req: any, res: any, next: any) => {
    const requestIP = req.ip;

    if (requestIP !== frontendIP) {
        return res.status(403).json({ error: 'Solicitud no autorizada' });
    }
    next();
}; */
app.use((0, cors_1.default)(options));
app.use(express_1.default.json());
/* app.use(validateOrigin); */
// The routes are resolved here
app.use('/api', routes_1.default);
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
