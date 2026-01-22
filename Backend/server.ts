import 'dotenv/config'
import express from 'express'
import EmailRouter from './routes/email/email.route.ts';
import authRoute from './routes/auth/auth.route.ts';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import './worker/email.worker.ts'

const app = express();

app.set('trust proxy', 1);

app.use(cors({
    origin: "https://timailer.vercel.app",
    credentials: true,
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

const PORT = Number(process.env.PORT) || 3000

app.listen(3000, () => {
    console.log("Listening on port", PORT)
})



