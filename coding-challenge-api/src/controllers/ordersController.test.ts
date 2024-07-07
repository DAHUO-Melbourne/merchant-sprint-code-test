// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import express from 'express';
import router from '../controllers/ordersController';
import getSortedOverdueOrders from '../services/OrdersService';

jest.mock('../services/OrdersService');

const app = express();
app.use(express.json());
app.use('/orders', router);

describe('GET /orders/overdueOrders', () => {
  it('should return 400 if required query parameters are missing', async () => {
    const res = await request(app).get('/orders/overdueOrders');
    expect(res.status).toBe(400);
    expect(res.text).toBe('Missing required query parameters: order, pageSize, skip');
  });

  it('should return 400 if pageSize and skip are not valid integers', async () => {
    const res = await request(app).get('/orders/overdueOrders?order=asc&pageSize=invalid&skip=invalid');
    expect(res.status).toBe(400);
    expect(res.text).toBe('pageSize and skip must be valid integers.');
  });

  it('should return 400 if order parameter is invalid', async () => {
    const res = await request(app).get('/orders/overdueOrders?order=invalid&pageSize=5&skip=0');
    expect(res.status).toBe(400);
    expect(res.text).toBe('Invalid value for order parameter. Expected "asc" or "desc".');
  });

  it('should return 200 and the orders if the parameters are valid', async () => {
    const mockOrders = { pagesTotalNum: 1, orders: [] };
    (getSortedOverdueOrders as jest.Mock).mockResolvedValue(mockOrders);

    const res = await request(app).get('/orders/overdueOrders?order=asc&pageSize=5&skip=0');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockOrders);
  });

  it('should return 401 if unauthorized error occurs', async () => {
    (getSortedOverdueOrders as jest.Mock).mockRejectedValue(new Error('Unauthorized'));

    const res = await request(app).get('/orders/overdueOrders?order=asc&pageSize=5&skip=0');
    expect(res.status).toBe(401);
    expect(res.text).toBe('Unauthorized access');
  });

  it('should return 403 if forbidden error occurs', async () => {
    (getSortedOverdueOrders as jest.Mock).mockRejectedValue(new Error('Forbidden'));

    const res = await request(app).get('/orders/overdueOrders?order=asc&pageSize=5&skip=0');
    expect(res.status).toBe(403);
    expect(res.text).toBe('Forbidden access');
  });

  it('should return 500 if an unexpected error occurs', async () => {
    (getSortedOverdueOrders as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

    const res = await request(app).get('/orders/overdueOrders?order=asc&pageSize=5&skip=0');
    expect(res.status).toBe(500);
    expect(res.text).toBe('Unexpected error');
  });
});
