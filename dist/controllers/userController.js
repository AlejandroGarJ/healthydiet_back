"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserAuth = exports.login = exports.checkRegistrationToken = exports.sendConfirmationEmail = exports.getUser = void 0;
const db_1 = __importDefault(require("../config/db"));
const emailController_1 = __importDefault(require("./emailController"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const memory_cache_1 = __importDefault(require("memory-cache"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield db_1.default.user.findMany();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Back error' });
    }
});
exports.getUser = getUser;
const sendConfirmationEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const user = yield db_1.default.user.findUnique({
            where: {
                email: body.email
            }
        });
        if (user) {
            return res.json({ repsonse: 'email exists' });
        }
        const secretKey = process.env.EMAIL_JWT_KEY;
        if (!secretKey) {
            throw new Error('SECRET_KEY not defined .env');
        }
        const token = jsonwebtoken_1.default.sign({ email: body.email }, secretKey, { expiresIn: '1h' });
        const mailHtml = `<body style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px;">
    <div style="background-color: #ffffff; max-width: 600px; margin: auto; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333333;">Confirmación de Correo Electrónico</h2>
        <p style="color: #666666;">¡Gracias por registrarte! Haz clic en el siguiente botón para confirmar tu dirección
           de correo electrónico:</p>
        <a href="http://localhost:4200/auth/confirmEmail?auth=${token}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">Confirmar
            Email</a>
        <p style="color: #666666;">Si no has solicitado este correo electrónico, puedes ignorarlo de manera segura.</p>
    </div>
</body>`;
        memory_cache_1.default.put(body.email, body.password, 600 * 60000);
        (0, emailController_1.default)(body.email, 'Email confirmation', mailHtml);
        res.json({ response: 'Email enviado correctamente' });
    }
    catch (error) {
        console.error('Error al obtener usuario por email:', error);
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
});
exports.sendConfirmationEmail = sendConfirmationEmail;
const checkRegistrationToken = (req, res) => {
    console.log("Checking token");
    const body = req.body;
    const token = body.token;
    const secretKey = process.env.EMAIL_JWT_KEY;
    if (!secretKey) {
        return res.status(500).json({ response: false, message: 'Secret key not provided' });
    }
    jsonwebtoken_1.default.verify(token, secretKey, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            return res.json({ response: 'oken no valido' });
        }
        const email = decoded.email;
        const decodedPassword = memory_cache_1.default.get(email);
        yield memory_cache_1.default.del(email);
        if (!decodedPassword) {
            return res.json({ response: 'monoloco' });
        }
        memory_cache_1.default.del(email);
        try {
            console.log(decodedPassword);
            const salt = yield bcrypt_1.default.genSalt(10);
            const hash = yield bcrypt_1.default.hash(decodedPassword, salt);
            yield db_1.default.user.create({
                data: {
                    email: email,
                    password: hash
                }
            });
            console.log("perfe opaopa");
            return res.json({ response: true });
        }
        catch (error) {
            console.error('Error creating user:', error);
            return res.status(500).json({ response: false, message: 'Internal server error' });
        }
    }));
};
exports.checkRegistrationToken = checkRegistrationToken;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const user = yield db_1.default.user.findUnique({
            where: {
                email: body.email
            }
        });
        if (!user) {
            return res.json({ response: 'User not found' });
        }
        else {
            if (yield bcrypt_1.default.compare(body.password, user.password)) {
                /* Generate token */
                const secretKey = process.env.EMAIL_JWT_KEY;
                if (!secretKey) {
                    throw new Error('SECRET_KEY not defined .env');
                }
                const token = jsonwebtoken_1.default.sign({ email: body.email }, secretKey, { expiresIn: '10h' });
                res.json({ token: token });
            }
            else {
                return res.json({ response: 'Contraseña incorrecta' });
            }
        }
    }
    catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ response: false, message: 'Internal server error' });
    }
});
exports.login = login;
const checkUserAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    const secretKey = process.env.EMAIL_JWT_KEY;
    if (!secretKey) {
        return res.json({ response: false });
    }
    if (!token) {
        return res.json({ response: false });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        return res.json({ response: true });
    }
    catch (err) {
        return res.json({ response: false });
    }
});
exports.checkUserAuth = checkUserAuth;
