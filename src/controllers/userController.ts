
import { Request, Response } from 'express';
import prisma from '../config/db';
import sendEmail from './emailController'
import redis, { createClient } from 'redis';
import jwt from 'jsonwebtoken';
import { error } from 'console';
import cache from 'memory-cache';
import bcrypt from 'bcrypt'

export const getUser = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Back error' });
    }
}

export const sendConfirmationEmail = async (req: Request, res: Response) => {

    const body = req.body;

    try {
        const user = await prisma.user.findUnique({
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

        const token = jwt.sign({ email: body.email }, secretKey, { expiresIn: '1h' });

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

        cache.put(body.email, body.password, 600 * 60000);
        sendEmail(body.email, 'Email confirmation', mailHtml);
        res.json({ response: 'Email enviado correctamente' });
    } catch (error) {
        console.error('Error al obtener usuario por email:', error);
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
}

export const checkRegistrationToken = (req: Request, res: Response) => {
    console.log("Checking token");
    const body = req.body;
    const token = body.token;
    const secretKey = process.env.EMAIL_JWT_KEY;

    if (!secretKey) {
        return res.status(500).json({ response: false, message: 'Secret key not provided' });
    }

    jwt.verify(token, secretKey, async (err: any, decoded: any) => {
        if (err) {
            console.log(err);
            return res.json({ response: 'oken no valido' });
        }

        const email = decoded.email;

        const decodedPassword = cache.get(email);
        await cache.del(email);

        if (!decodedPassword) {
            return res.json({ response: 'monoloco' });
        }

        cache.del(email);

        try {
            console.log(decodedPassword);
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(decodedPassword, salt);
            await prisma.user.create({
                data: {
                    email: email,
                    password: hash
                }
            });
            console.log("perfe opaopa");
            return res.json({ response: true });
        } catch (error) {
            console.error('Error creating user:', error);
            return res.status(500).json({ response: false, message: 'Internal server error' });
        }
    });
}

export const login = async (req: Request, res: Response) => {
    const body = req.body;

    try {

        const user = await prisma.user.findUnique({
            where: {
                email: body.email
            }
        });

        if (!user) {
            return res.json({ response: 'User not found' });
        } else {
            if (await bcrypt.compare(body.password, user.password)) {

                /* Generate token */
                const secretKey = process.env.EMAIL_JWT_KEY;
                if (!secretKey) {
                    throw new Error('SECRET_KEY not defined .env');
                }
                const token = jwt.sign({ email: body.email }, secretKey, { expiresIn: '10h' });
                res.json({ token: token });
            }
            else {
                return res.json({ response: 'Contraseña incorrecta' });
            }

        }





    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ response: false, message: 'Internal server error' });
    }


}


export const checkUserAuth = async (req: Request, res: Response) => {
    const token = req.headers['authorization']?.split(' ')[1];
    const secretKey = process.env.EMAIL_JWT_KEY;

    if (!secretKey) {
        return res.json({ response: false });
    }

    if (!token) {
        return res.json({ response: false });
    }

    try {

        const decoded = jwt.verify(token, secretKey);
        return res.json({ response: true });
    } catch (err) {
        return res.json({ response: false });
    }
};

