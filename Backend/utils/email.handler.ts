import nodemailer from 'nodemailer'

export const emailHandler = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 465,
    secure: true,
    auth: {
        user: process.env.ETHEREAL_USERNAME,
        pass: process.env.ETHEREAL_PASSWORD
    }
})