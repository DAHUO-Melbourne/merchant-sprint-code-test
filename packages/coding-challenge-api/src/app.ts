import express from 'express';
import cors from 'cors';
import OrderController from './controllers/ordersController';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/orders', OrderController);

export default app;
