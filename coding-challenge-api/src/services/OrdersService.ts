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

interface combinedOrder {
  orderId: string;
  orderValue: string;
  items: string;
  destination: string;
  daysOverdue: number;
  storeCountry: string;
  storeMarketplace: string;
  storeShopName: string;
}

const dataDir = path.resolve(__dirname, '../../data');

const readGzippedCSV = (filePath: string, pageSize: number, skip: number, order: 'asc' | 'desc'): Promise<Order[]> =>
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
      .on('end', () => {
        orders.sort((a, b) => {
          const dateA = new Date(`${a.latest_ship_date.split('/').reverse().join('-')}`);
          const dateB = new Date(`${b.latest_ship_date.split('/').reverse().join('-')}`);
          if (order === 'asc') {
            return dateA.getTime() - dateB.getTime();
          }
          return dateB.getTime() - dateA.getTime();
        });

        resolve(orders.slice(skip * pageSize, (skip + 1) * pageSize));
      })
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

const getSortedOverdueOrders = async (order: OrderType, pageSize: number, skip: number) => {
  const orders = await readGzippedCSV(path.join(dataDir, 'orders.csv.gz'), pageSize, skip, order);
  const stores = await readCSV(path.join(dataDir, 'stores.csv'));
  const combinedOrders: combinedOrder[] = [];

  orders.forEach((item) => {
    const store = stores.find((s) => s.storeId === item.storeId);

    if (store) {
      const [day, month, year] = item.latest_ship_date.split('/');
      const latestShipDate = new Date(`${year}-${month}-${day}`);
      const currentDate = new Date();
      const daysOverdue = Math.floor((currentDate.getTime() - latestShipDate.getTime()) / (1000 * 60 * 60 * 24));

      combinedOrders.push({
        orderId: item.orderId,
        orderValue: item.orderValue,
        items: item.items,
        destination: item.destination,
        daysOverdue,
        storeCountry: store.country,
        storeMarketplace: store.marketplace,
        storeShopName: store.shopName,
      });
    }
  });

  return combinedOrders;
};

export default getSortedOverdueOrders;
