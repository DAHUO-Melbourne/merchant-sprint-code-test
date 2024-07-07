import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import getOverdueOrders from '../apis/getOverdueOrders';
import { Order, OrderType } from '../apis/getOverdueOrders';
import ReactCountryFlag from 'react-country-flag';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TableLoading } from 'react-bootstrap-table-loading';

const OverdueOrdersTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [order, setOrder] = useState<OrderType>('desc');
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true);
        const data = await getOverdueOrders('desc', 5, 0);
        setOrders(data?.orders ?? []);
        setTotalPages(data?.pagesTotalNum ?? 1);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    getOrders();
  }, []);

  const handlePageChange = async (pageNumber: number) => {
    try {
      setCurrentPage(pageNumber);
      setLoading(true);
      const orderData = await getOverdueOrders(order, 5, pageNumber - 1);
      setOrders(orderData?.orders ?? []);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePageSort = async () => {
    try {
      setCurrentPage(1);
      setLoading(true);
      let orderData;
      if (order === 'desc') {
        setOrder('asc');
        orderData = await getOverdueOrders('asc', 5, 0);
      } else {
        setOrder('desc');
        orderData = await getOverdueOrders('desc', 5, 0);
      }
      setOrders(orderData?.orders ?? []);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
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
        <thead>
          <tr>
            <th
              style={{
                textAlign: 'left',
                width: '12%',
                fontSize: '12px',
                backgroundColor: '#E5E7E9',
                color: '#808080',
                padding: '10px',
              }}
            >
              MARKETPLACE
            </th>
            <th
              style={{
                textAlign: 'left',
                width: '15%',
                backgroundColor: '#E5E7E9',
                fontSize: '12px',
                color: '#808080',
                padding: '10px',
              }}
            >
              STORE
            </th>
            <th
              style={{
                textAlign: 'left',
                width: '15%',
                backgroundColor: '#E5E7E9',
                fontSize: '12px',
                color: '#808080',
                padding: '10px',
              }}
            >
              ORDER ID
            </th>
            <th
              style={{
                textAlign: 'left',
                width: '15%',
                backgroundColor: '#E5E7E9',
                fontSize: '12px',
                color: '#808080',
                padding: '10px',
              }}
            >
              ORDER VALUE
            </th>
            <th
              style={{
                textAlign: 'left',
                width: '10%',
                fontSize: '12px',
                backgroundColor: '#E5E7E9',
                color: '#808080',
                padding: '10px',
              }}
            >
              ITEMS
            </th>
            <th
              style={{
                textAlign: 'left',
                width: '20%',
                fontSize: '12px',
                backgroundColor: '#E5E7E9',
                color: '#808080',
                padding: '10px',
              }}
            >
              DESTINATION
            </th>
            <th
              style={{
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '12px',
                backgroundColor: '#E5E7E9',
                display: 'flex',
                color: '#808080',
                alignItems: 'center',
                padding: '10px',
              }}
              onClick={() => handlePageSort()}
            >
              <span
                style={{
                  fontSize: '12px',
                  display: 'block',
                  color: '#808080',
                }}
              >
                DAYS OVERDUE
              </span>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '12px', display: 'block' }}
              >
                swap_vert
              </span>
            </th>
          </tr>
        </thead>
        {!loading && (
          <tbody>
            {orders?.map((order) => (
              <tr key={order.orderId}>
                <td style={{ textAlign: 'left' }}>
                  <ReactCountryFlag
                    countryCode={order.storeCountry.substring(0, 2)}
                  />
                  &nbsp;{order.storeMarketplace}
                </td>
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
        )}
        {loading && <TableLoading columns={7} lines={5} />}
      </Table>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '20px 20px 20px auto',
          listStyle: 'none',
          alignItems: 'center',
        }}
      >
        <span
          className="material-symbols-outlined"
          onClick={() => {
            if (currentPage === 1) {
              return;
            }
            handlePageChange(1);
          }}
          style={{
            cursor: 'pointer',
          }}
        >
          keyboard_double_arrow_left
        </span>
        <span
          className="material-symbols-outlined"
          onClick={() => {
            if (currentPage === 1) {
              return;
            }
            handlePageChange(currentPage - 1);
          }}
          style={{
            cursor: 'pointer',
          }}
        >
          chevron_left
        </span>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Page&nbsp;
          <input
            type="number"
            value={currentPage}
            onChange={(e) => {
              handlePageChange(parseInt(e.target.value));
            }}
            style={{ width: '50px', display: 'inline-block' }}
          />{' '}
          &nbsp;of {totalPages}
        </div>
        <span
          className="material-symbols-outlined"
          onClick={() => {
            if (currentPage === totalPages) {
              return;
            }
            handlePageChange(currentPage + 1);
          }}
          style={{
            cursor: 'pointer',
          }}
        >
          chevron_right
        </span>
        <span
          className="material-symbols-outlined"
          onClick={() => {
            if (currentPage === totalPages) {
              return;
            }
            handlePageChange(totalPages);
          }}
          style={{
            cursor: 'pointer',
          }}
        >
          keyboard_double_arrow_right
        </span>
      </div>
    </div>
  );
};

export default OverdueOrdersTable;
