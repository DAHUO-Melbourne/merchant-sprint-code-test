import express, { Request, Response } from 'express';

import cors from 'cors';
import { getUser } from './user';

const app = express();

app.use(cors());
app.get('/user', getUser);

export default app;
