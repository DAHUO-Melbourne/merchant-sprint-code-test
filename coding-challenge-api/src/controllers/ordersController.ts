import express from 'express';

const router = express.Router();

router.get('/overdueOrders', async (req, res) => {
  try {
    const prod = {
      firstName: 'tokitou',
      lastName: 'kun',
      email: 'tokitou@email.com',
      id: 1,
    };
    res.send(prod);
  } catch (err) {
    const error = err as Error;
    res.status(500).send(error.message);
  }
});

export default router;
