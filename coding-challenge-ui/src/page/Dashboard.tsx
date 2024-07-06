import React, { useEffect, useState } from 'react';
import Table from '../component/Table';

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
    fetch(
      'http://localhost:8080/orders/overdueOrders?order=desc&pageSize=5&skip=0',
    )
      .then((results) => results.json())
      .then((data) => {
        setOrders(data);
      });
  }, []);
  return <Table orders={orders} />;
};

export default Dashboard;
