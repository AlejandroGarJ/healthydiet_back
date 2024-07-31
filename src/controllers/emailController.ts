import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export default async function sendEmail(adressee: string, subject: string, html: string) {
    try {


        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: adressee,
            subject: subject,
            html: html
        };



        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado:', info.messageId);
        return info.messageId;
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        throw error;
    }
}




