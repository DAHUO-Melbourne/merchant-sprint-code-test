import React, { useState, useEffect } from 'react';
import { Table, Pagination, FormControl } from 'react-bootstrap';
import getOverdueOrders from '../apis/getOverdueOrders';
import { Order, OrderType } from '../apis/getOverdueOrders';

const OverdueOrdersTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [order, setOrder] = useState<OrderType>('desc');
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  useEffect(() => {
    const getOrders = async () => {
      const data = await getOverdueOrders('desc', 5, 0);
      setOrders(data?.orders ?? []);
      setTotalPages(data?.pagesTotalNum ?? 1);
    };
    getOrders();
  }, []);

  const handlePageChange = async (pageNumber: number) => {
    setCurrentPage(pageNumber);
    const orderData = await getOverdueOrders(order, 5, pageNumber - 1);
    setOrders(orderData?.orders ?? []);
  };

  const handlePageSort = async () => {
    setCurrentPage(1);
    let orderData;
    if (order === 'desc') {
      setOrder('asc');
      orderData = await getOverdueOrders('asc', 5, 0);
    } else {
      setOrder('desc');
      orderData = await getOverdueOrders('desc', 5, 0);
    }
    setOrders(orderData?.orders ?? []);
  };

  return (
    <div
      style={{
        marginTop: '40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        width: '90%',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        margin: '40px auto',
      }}
    >
      <div
        style={{
          marginBottom: '10px',
          fontWeight: 'bold',
          width: '100%',
          textAlign: 'left',
          backgroundColor: '#ffffff',
          padding: '10px',
          borderRadius: '5px',
        }}
      >
        Overdue Orders
      </div>
      <Table
        striped
        hover
        size="sm"
        style={{ width: '100%', margin: 'auto', backgroundColor: '#ffffff' }}
      >
        <thead style={{ backgroundColor: '#E5E7E9' }}>
          <tr>
            <th style={{ textAlign: 'left', width: '15%', fontSize: '12px' }}>
              MARKETPLACE
            </th>
            <th style={{ textAlign: 'left', width: '15%', fontSize: '12px' }}>
              STORE
            </th>
            <th style={{ textAlign: 'left', width: '15%', fontSize: '12px' }}>
              ORDER ID
            </th>
            <th style={{ textAlign: 'left', width: '15%', fontSize: '12px' }}>
              ORDER VALUE
            </th>
            <th style={{ textAlign: 'left', width: '10%', fontSize: '12px' }}>
              ITEMS
            </th>
            <th style={{ textAlign: 'left', width: '20%', fontSize: '12px' }}>
              DESTINATION
            </th>
            <th
              style={{
                textAlign: 'left',
                width: '10%',
                cursor: 'pointer',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
              }}
              onClick={() => handlePageSort()}
            >
              <span className="material-symbols-outlined">swap_vert</span>DAYS
              OVERDUE
            </th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => (
            <tr key={order.orderId}>
              <td style={{ textAlign: 'left' }}>{order.storeMarketplace}</td>
              <td style={{ textAlign: 'left' }}>{order.storeShopName}</td>
              <td style={{ textAlign: 'left' }}>{order.orderId}</td>
              <td style={{ textAlign: 'left' }}>{order.orderValue}</td>
              <td style={{ textAlign: 'left' }}>{order.items}</td>
              <td style={{ textAlign: 'left' }}>{order.destination}</td>
              <td
                style={{
                  textAlign: 'left',
                  color: order.daysOverdue > 20 ? 'red' : 'black',
                }}
              >
                {order.daysOverdue}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px',
          listStyle: 'none',
          alignItems: 'center',
        }}
      >
        <Pagination.Item
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          <span className="material-symbols-outlined">
            keyboard_double_arrow_left
          </span>
        </Pagination.Item>
        <Pagination.Item
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </Pagination.Item>
        <Pagination.Item>
          Page{' '}
          <FormControl
            type="number"
            value={currentPage}
            onChange={(e) => {
              handlePageChange(parseInt(e.target.value));
            }}
            style={{ width: '50px', display: 'inline-block' }}
          />{' '}
          of {totalPages}
        </Pagination.Item>
        <Pagination.Item
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </Pagination.Item>
        <Pagination.Item
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <span className="material-symbols-outlined">
            keyboard_double_arrow_right
          </span>
        </Pagination.Item>
      </Pagination>
    </div>
  );
};

export default OverdueOrdersTable;
