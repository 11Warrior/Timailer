import { Queue } from "bullmq";
import { redis } from "./redis.ts";

export const emailQueue = new Queue("email-queue", {
    connection: redis
})