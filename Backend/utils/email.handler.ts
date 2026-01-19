import nodemailer from 'nodemailer'

export const getEmailHandler = async () => {
    const testAccount = await nodemailer.createTestAccount();
    
    const emailHandler = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    })

    return emailHandler;
}