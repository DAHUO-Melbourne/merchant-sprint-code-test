import express, { Request, Response } from 'express';
import getSortedOverdueOrders from '../services/OrdersService';

const router = express.Router();

router.get('/overdueOrders', async (req: Request, res: Response) => {
  try {
    const order = req.query.order as 'asc' | 'desc';
    const pageSize = parseInt(req.query.pageSize as string, 10);
    const skip = parseInt(req.query.skip as string, 10);
    const orders = await getSortedOverdueOrders(order, pageSize, skip);
    res.send(orders);
  } catch (err) {
    const error = err as Error;
    res.status(500).send(error.message);
  }
});

export default router;
