import  { Router } from 'express'
import { getEmails, scheduleEmail } from '../../controllers/EmailController/email.controller.ts';

const EmailRouter =  Router();

EmailRouter.post('/schedule-email', scheduleEmail)

EmailRouter.get('/getEmails', getEmails)

export default EmailRouter;
