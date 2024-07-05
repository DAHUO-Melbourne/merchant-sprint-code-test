import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import zlib from 'zlib';
import type { Order, Store } from '../models';

type OrderType = 'asc' | 'desc';

interface getSortedOverdueOrderDto {
  order: OrderType;
  pageSize: number;
  skip: number;
}

const dataDir = path.resolve(__dirname, '../../data');

const readGzippedCSV = (filePath: string): Promise<Order[]> =>
  new Promise((resolve, reject) => {
    const orders: Order[] = [];
    fs.createReadStream(filePath)
      .pipe(zlib.createGunzip())
      .pipe(csv())
      .on('data', (data) => orders.push(data))
      .on('end', () => resolve(orders))
      .on('error', (error) => reject(error));
  });

const readCSV = (filePath: string): Promise<Store[]> =>
  new Promise((resolve, reject) => {
    const data: any[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => data.push(row))
      .on('end', () => resolve(data))
      .on('error', (error) => reject(error));
  });

const getSortedOverdueOrders = async ({ order, pageSize, skip }: getSortedOverdueOrderDto) => {
  const orders = await readGzippedCSV(path.join(dataDir, 'orders.csv.gz'));
  const stores = await readCSV(path.join(dataDir, 'stores.csv'));
  console.log(stores[0]);
  console.log(orders[0]);
};

export default getSortedOverdueOrders;
