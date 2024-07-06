import React, { useEffect, useState } from 'react';
import Table from '../component/Table';
import getOverdueOrders from '../apis/getOverdueOrders';

export interface Order {
  orderId: string;
  orderValue: string;
  items: string;
  destination: string;
  daysOverdue: number;
  storeCountry: string;
  storeMarketplace: string;
  storeShopName: string;
}

const Dashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    const getOrders = async () => {
      const data = await getOverdueOrders('desc', 5, 0);
      setOrders(data);
    };
    getOrders();
  }, []);
  return <Table orders={orders} setOrders={setOrders} />;
};

export default Dashboard;
