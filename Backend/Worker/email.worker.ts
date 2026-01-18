import { Job, Worker } from "bullmq";
import prisma from "../db/prisma.ts";
import { emailHandler } from "../utils/email.handler.ts";
import { redis } from "../config/redis.ts";
import { emailQueue } from "../config/email.queue.ts";

const CONCURRENCY = Number(process.env.CONCURRENCY);
const MAX_EMAILS_PER_HOUR = Number(process.env.MAX_EMAILS_PER_HOUR);
const DELAY = Number(process.env.DELAY)

new Worker('email-queue', async (job: Job) => {
    const { id } = job.data;

    const email = await prisma.email.findUnique({
        where: { id, status: "Scheduled" }
    })

    if (!email) return;

    const redisKey = `rate:${email.senderEmail}:${new Date().toISOString().slice(0, 13)}`

    const currentValue = await redis.incr(redisKey);

    if (currentValue == 1) {
        await redis.expire(redisKey, 60 * 60 + 8)
    }

    if (currentValue > MAX_EMAILS_PER_HOUR) {
        const nextOneHourWindow = 60 * 60 * 1000 - (
            + new Date().getMinutes() * 60 * 1000
            + new Date().getSeconds() * 1000
            + new Date().getMilliseconds()
        )
        await emailQueue.add("email-queue",
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

    await emailHandler.sendMail({
        from: email.senderEmail,
        to: email.receiverEmail,
        subject: email.subject,
        text: email.body
    })

    await prisma.email.update({
        where: { id },
        data: {
            status: "Sent",
        }
    })
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