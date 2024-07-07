import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import getOverdueOrders from '../apis/getOverdueOrders';
import { Order, OrderType } from '../apis/getOverdueOrders';
import ReactCountryFlag from 'react-country-flag';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TableLoading } from 'react-bootstrap-table-loading';
import useDebounce from '../hooks/useDebounce';
import './OverdueOrdersTable.css';

const OverdueOrdersTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [order, setOrder] = useState<OrderType>('desc');
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const debouncedCurrentPage = useDebounce(
    currentPage,
    currentPage !== 1 ? 1500 : 0,
  );

  useEffect(() => {
    const getOrders = async () => {
      try {
        if (Number.isNaN(debouncedCurrentPage)) {
          return;
        }
        setLoading(true);
        const data = await getOverdueOrders(order, 5, debouncedCurrentPage - 1);
        setOrders(data?.orders ?? []);
        setTotalPages(data?.pagesTotalNum ?? 1);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    getOrders();
  }, [debouncedCurrentPage, order]);

  const handlePageChange = async (pageNumber: number) => {
    setCurrentPage(pageNumber);
    if (Number.isNaN(pageNumber)) {
      return;
    }
    setLoading(true);
  };

  const handlePageSort = async () => {
    try {
      setLoading(true);
      if (order === 'desc') {
        setOrder('asc');
      } else {
        setOrder('desc');
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="table-container">
      <div className="table-title">Overdue Orders</div>
      <Table striped hover size="sm" className="table-content">
        <thead>
          <tr>
            <th className="table-header-cell small-column-width">
              MARKETPLACE
            </th>
            <th className="table-header-cell medium-column-width">STORE</th>
            <th className="table-header-cell medium-column-width">ORDER ID</th>
            <th className="table-header-cell medium-column-width">
              ORDER VALUE
            </th>
            <th className="table-header-cell small-column-width">ITEMS</th>
            <th className="table-header-cell large-column-width">
              DESTINATION
            </th>
            <th
              className="table-header-cell clickable-head"
              onClick={() => handlePageSort()}
            >
              <span>DAYS OVERDUE</span>
              <span className="material-symbols-outlined swap-icon ">
                swap_vert
              </span>
            </th>
          </tr>
        </thead>
        {!loading && (
          <tbody>
            {orders?.map((order) => (
              <tr key={order.orderId}>
                <td className="text-leftAlign">
                  <ReactCountryFlag
                    countryCode={order.storeCountry.substring(0, 2)}
                  />
                  &nbsp;{order.storeMarketplace}
                </td>
                <td className="text-leftAlign">{order.storeShopName}</td>
                <td className="text-leftAlign">{order.orderId}</td>
                <td className="text-leftAlign">{order.orderValue}</td>
                <td className="text-leftAlign">{order.items}</td>
                <td className="text-leftAlign">{order.destination}</td>
                <td
                  className="text-leftAlign"
                  style={{
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
      <div className="pagination-wrapper">
        <span
          className="material-symbols-outlined"
          onClick={() => {
            if (currentPage === 1) {
              return;
            }
            handlePageChange(1);
          }}
          style={{
            cursor: currentPage !== 1 ? 'pointer' : 'auto',
            color: currentPage !== 1 ? '#000000' : '#D3D3D3',
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
            cursor: currentPage !== 1 ? 'pointer' : 'auto',
            color: currentPage !== 1 ? '#000000' : '#D3D3D3',
          }}
        >
          chevron_left
        </span>
        <div className="pagination-input-wrapper">
          <span
            style={{
              color:
                currentPage !== 1 && currentPage !== totalPages
                  ? '#000000'
                  : '#D3D3D3',
            }}
          >
            Page&nbsp;
          </span>
          <input
            type="number"
            value={currentPage}
            onChange={(e) => {
              handlePageChange(parseInt(e.target.value));
            }}
            className="pagination-inputbox"
          />{' '}
          &nbsp;{totalPages}
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
            cursor: currentPage !== totalPages ? 'pointer' : 'auto',
            color: currentPage !== totalPages ? '#000000' : '#D3D3D3',
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
            cursor: currentPage !== totalPages ? 'pointer' : 'auto',
            color: currentPage !== totalPages ? '#000000' : '#D3D3D3',
          }}
        >
          keyboard_double_arrow_right
        </span>
      </div>
    </div>
  );
};
export default OverdueOrdersTable;
