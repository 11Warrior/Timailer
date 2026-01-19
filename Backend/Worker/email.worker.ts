import "dotenv/config"
import { Job, Worker } from "bullmq";
import prisma from "../db/prisma.ts";
import { redis } from "../config/redis.ts";
import { emailQueue } from "../config/email.queue.ts";
import nodemailer from 'nodemailer'
import { getEmailHandler } from "../utils/email.handler.ts";

const CONCURRENCY = Number(process.env.CONCURRENCY!);
const MAX_EMAILS_PER_HOUR = Number(process.env.MAX_EMAILS_PER_HOUR!);
const DELAY = Number(process.env.DELAY!)

// console.log(CONCURRENCY, MAX_EMAILS_PER_HOUR, DELAY)

const worker = new Worker('email-queue', async (job: Job) => {
    // console.log(job.data);
    const { id } = job.data;

    const claim = await prisma.email.updateMany({
        where: { id, status: "Scheduled" },
        data: { status: "Sending" }
    });

    if (claim.count == 0) return;

    const email = await prisma.email.findFirst({
        where: { id }
    })

    // console.log(email);
    if (!email) return;

    const redisKey = `rate:${email.senderEmail}:${new Date().toISOString().slice(0, 13)}`

    const currentValue = await redis.incr(redisKey);

    console.log(`[${new Date().toLocaleTimeString()}] Sending email to ${email.receiverEmail}`);

    console.log(currentValue);

    if (currentValue == 1) {
        await redis.expire(redisKey, 60 * 60 + 8)
    }
    // console.log("After Expiry check", currentValue);
    if (currentValue > MAX_EMAILS_PER_HOUR) {
        const nextOneHourWindow = 60 * 60 * 1000 - (
            + new Date().getMinutes() * 60 * 1000
            + new Date().getSeconds() * 1000
            + new Date().getMilliseconds()
        )
        await emailQueue.add("email-sent",
            { id },
            {
                delay: nextOneHourWindow,
                jobId: `email:${id}`,
                removeOnComplete: true
            }
        )

        await prisma.email.update({
            where: { id },
            data: {
                status: "Scheduled"
            }
        })
        return;
    }

    console.log("sending email..")

    try {
        const transporter = await getEmailHandler();

        const mailInfo = await transporter.sendMail({
            from: email.senderEmail,
            to: email.receiverEmail,
            subject: email.subject,
            text: email.body
        })

        console.log("Ethereal URL", nodemailer.getTestMessageUrl(mailInfo))


        await prisma.email.update({
            where: { id },
            data: {
                status: "Sent",
            }
        })

    } catch (error) {
        console.log("Error sending email...", error);
        return;
    }
},
    {
        connection: redis,
        concurrency: CONCURRENCY,
        limiter: {
            max: 1,
            duration: DELAY
        }
    }
)

// worker.on("ready", () => console.log("Worker Running."))

// worker.on("active", (job: Job) => console.log("Job active Running.", job.id))

// worker.on("failed", (job) => console.log("Job Failed..", job?.id))