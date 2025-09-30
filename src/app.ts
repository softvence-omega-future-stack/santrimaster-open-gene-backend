import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/global_error_handler';
import notFound from './app/middlewares/not_found_api';
import { handleStripeWebhook } from './app/modules/donation/donation.controller';
import appRouter from './routes';

// define app
const app = express()
app.use(cors({
    origin: ["http://localhost:5173", "https://opengene.netlify.app", "https://open-gene.com", "https://www.open-gene.com"],
    credentials: true
}))
app.use(
    "/api/payment/webhook",
    express.raw({ type: "application/json" }),
    handleStripeWebhook
);

// middleware
app.use(express.json({ limit: "100mb" }))
app.use(express.raw())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use("/api", appRouter)

// stating point
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running successful !!',
        data: null,
    });
});

// global error handler
app.use(globalErrorHandler);
app.use(notFound);

// export app

export default app;
