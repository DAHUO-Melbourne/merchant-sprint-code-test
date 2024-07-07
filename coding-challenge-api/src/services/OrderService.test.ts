import { combineOrdersAndStores, CombinedOrder } from '../services/OrdersService';
import type { Order, Store } from '../models';

describe('combineOrdersAndStores', () => {
  it('should combine orders and stores correctly', () => {
    const mockOrders: Order[] = [
      {
        orderId: '1',
        orderValue: '100',
        items: '2',
        destination: 'City',
        latest_ship_date: '01/01/2022',
        shipment_status: 'Pending',
        storeId: '1',
        Id: '1',
      },
    ];

    const mockStores: Store[] = [
      {
        storeId: '1',
        country: 'US',
        marketplace: 'Amazon',
        shopName: 'Shop1',
      },
    ];

    const expectedCombinedOrders: CombinedOrder[] = [
      {
        orderId: '1',
        orderValue: '100',
        items: '2',
        destination: 'City',
        daysOverdue: expect.any(Number),
        storeCountry: 'US',
        storeMarketplace: 'Amazon',
        storeShopName: 'Shop1',
      },
    ];

    const combinedOrders = combineOrdersAndStores(mockOrders, mockStores);

    expect(combinedOrders).toEqual(expectedCombinedOrders);
  });

  it('should handle orders with no matching store', () => {
    const mockOrders: Order[] = [
      {
        orderId: '1',
        orderValue: '100',
        items: '2',
        destination: 'City',
        latest_ship_date: '01/01/2022',
        shipment_status: 'Pending',
        storeId: '2',
        Id: '1',
      },
    ];

    const mockStores: Store[] = [
      {
        storeId: '1',
        country: 'US',
        marketplace: 'Amazon',
        shopName: 'Shop1',
      },
    ];

    const combinedOrders = combineOrdersAndStores(mockOrders, mockStores);

    expect(combinedOrders).toEqual([]);
  });

  it('should handle stores with no matching orders', () => {
    const mockOrders: Order[] = [
      {
        orderId: '1',
        orderValue: '100',
        items: '2',
        destination: 'City',
        latest_ship_date: '01/01/2022',
        shipment_status: 'Pending',
        storeId: '1',
        Id: '1',
      },
    ];

    const mockStores: Store[] = [
      {
        storeId: '2',
        country: 'US',
        marketplace: 'Amazon',
        shopName: 'Shop2',
      },
    ];

    const combinedOrders = combineOrdersAndStores(mockOrders, mockStores);

    expect(combinedOrders).toEqual([]);
  });
});
