import 'dotenv/config'
import express from 'express'
import EmailRouter from './routes/email/email.route.ts';
import authRoute from './routes/auth/auth.route.ts';
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/timailer', EmailRouter)
app.use('/timailer/auth', authRoute)

app.get('/', (req, res) => {
    // console.log("Hello")
    res.send("Home...")
})

app.listen(3000, () => {
    console.log("Listening on port", 3000)
})



