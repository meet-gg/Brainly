import express, { Application } from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { ApiError } from './ApiError';
import cookieParser from "cookie-parser";
import userRoutes from '../routes/user.routes';
import contentRoutes from '../routes/content.routes';

const app: Application = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://brainly-rho.vercel.app'],
  // credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  return res.send('Hello, World!');
});


app.use("/api/v1", userRoutes);
app.use("/api/v1", contentRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  if (err instanceof ApiError) {

    let formattedErrors: { field: string; message: string }[] = [];

    if (err.errors?.issues) {
      formattedErrors = err.errors.issues.map((issue: any) => ({
        field: issue.path.join('.'),
        message: issue.message
      }));
    } else if (Array.isArray(err.errors)) {
      formattedErrors = err.errors;
    }

    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: formattedErrors.length > 0 ? formattedErrors : err.errors,
      data: err.data
    });
  }

  console.error(err);
  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    errors: [],
    data: null
  });
});

export { app };
