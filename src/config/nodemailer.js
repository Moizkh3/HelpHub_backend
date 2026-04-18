import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // Port 587 uses STARTTLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
    tls: {
        // This handles compatibility issues with some SMTP servers and local environments
        rejectUnauthorized: false
    }
});

export default transporter;
