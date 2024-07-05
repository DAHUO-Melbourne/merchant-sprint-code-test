import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import zlib from 'zlib';
import NodeCache from 'node-cache';
import type { Order, Store } from '../models';

const cache = new NodeCache();
const STORE_DATA_KEY = 'storesData';
const TTL_IN_SECONDS = 3600;

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
      .on('data', (data) => {
        const [day, month, year] = data.latest_ship_date.split('/');
        const date = new Date(`${year}-${month}-${day}`);
        const currentDate = new Date();
        if (data.shipment_status === 'Pending' && date < currentDate) {
          orders.push(data);
        }
      })
      .on('end', () => resolve(orders))
      .on('error', (error) => reject(error));
  });

const readCSV = (filePath: string): Promise<Store[]> =>
  new Promise((resolve, reject) => {
    const cachedData = cache.get<Store[]>(STORE_DATA_KEY);
    if (cachedData) {
      resolve(cachedData);
    } else {
      const data: Store[] = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => data.push(row))
        .on('end', () => {
          cache.set(STORE_DATA_KEY, data, TTL_IN_SECONDS);
          resolve(data);
        })
        .on('error', (error) => reject(error));
    }
  });

const getSortedOverdueOrders = async ({ order, pageSize, skip }: getSortedOverdueOrderDto) => {
  const orders = await readGzippedCSV(path.join(dataDir, 'orders.csv.gz'));
  const stores = await readCSV(path.join(dataDir, 'stores.csv'));
  console.log(stores[0]);
  console.log(orders.length);
};

export default getSortedOverdueOrders;
