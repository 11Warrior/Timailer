import type { Request, Response } from "express";
import prisma from "../../db/prisma.ts";
import { emailQueue } from "../../config/email.queue.ts";



export const scheduleEmail = async (req: Request, res: Response) => {
    try {
        const { userId, senderEmail, receiverEmail, subject, body, scheduledAt, attachmentImage } = req.body;

        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) return;

        const newEmail = await prisma.email.create({
            data: {
                userId: userId,
                senderEmail,
                receiverEmail,
                subject,
                body,
                attachmentImage: attachmentImage || "",
                scheduledAt: new Date(scheduledAt),
                status: "Scheduled",
                createdAt: new Date()
            },
            include: {
                user: { select: { id: true, Email: true, emails: true, profileImage: true } }
            }
        })

        const delay = new Date(scheduledAt).getTime() - Date.now();

        const job = await emailQueue.add('email-queue', {
            id: newEmail.id
        },
            { delay }
        )

        return res.json({
            sucess: true,
            status: 200,
            message: "Sucessfully scheduled your email",
            job: job
        });
    } catch (error) {
        console.log("Error in error controller", error)
    }
}

export const getEmails = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        // console.log(userId);
        const user = await prisma.user.findUnique({ where: { id: userId as string } });
        if (!user) return;

        const emails = await prisma.email.findMany({
            where: { userId: user.id },
        })

        const [scheduledEmails, sentEmails] = await Promise.all([
            prisma.email.count({ where: { userId: user.id, status: "Scheduled" } }),
            prisma.email.count({ where: { userId: user.id, status: "Sent" } }),
        ])

        return res.json({
            emails,
            scheduledEmails,
            sentEmails
        })

    } catch (error) {
        console.log("Error while getting emails", error)
    }
}