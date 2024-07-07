import express, { Request, Response } from 'express';
import getSortedOverdueOrders from '../services/OrdersService';

const router = express.Router();

router.get('/overdueOrders', async (req: Request, res: Response) => {
  try {
    const { order, pageSize, skip } = req.query;
    if (!order || !pageSize || !skip) {
      return res.status(400).send('Missing required query parameters: order, pageSize, skip');
    }
    if (!Number.isInteger(Number(pageSize)) || !Number.isInteger(Number(skip))) {
      return res.status(400).send('pageSize and skip must be valid integers.');
    }
    if (order !== 'asc' && order !== 'desc') {
      return res.status(400).send('Invalid value for order parameter. Expected "asc" or "desc".');
    }
    const pageSizeInt = parseInt(pageSize as string, 10);
    const skipInt = parseInt(skip as string, 10);
    const orders = await getSortedOverdueOrders(order, pageSizeInt, skipInt);
    return res.send(orders);
  } catch (err) {
    const error = err as Error;

    if (error.message.includes('Unauthorized')) {
      return res.status(401).send('Unauthorized access');
    }

    if (error.message.includes('Forbidden')) {
      return res.status(403).send('Forbidden access');
    }

    return res.status(500).send(error.message);
  }
});

export default router;
