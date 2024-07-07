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

export type OrderType = 'asc' | 'desc';

interface getOverdueOrdersData {
  pagesTotalNum: number;
  orders: Order[];
}

const getOverdueOrders = async (
  order: string,
  pageSize: number,
  skip: number,
): Promise<getOverdueOrdersData | undefined> => {
  try {
    const response = await fetch(
      `http://localhost:8080/orders/overdueOrders?order=${order}&pageSize=${pageSize}&skip=${skip}`,
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export default getOverdueOrders;
