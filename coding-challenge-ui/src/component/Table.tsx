import React from 'react';
import MaterialTable from 'material-table';
import { Order } from '../page/Dashboard';
import './OverdueOrdersTable.css';

interface OverdueOrdersTableProps {
  orders: Order[];
}

const OverdueOrdersTable: React.FC<OverdueOrdersTableProps> = ({ orders }) => {
  return (
    <div className="table-container">
      <MaterialTable
        title="Overdue Orders"
        columns={[
          {
            title: 'MARKETPLACE',
            field: 'storeMarketplace',
            sorting: false,
          },
          {
            title: 'STORE',
            field: 'storeShopName',
            sorting: false,
          },
          {
            title: 'ORDER ID',
            field: 'orderId',
            sorting: false,
          },
          {
            title: 'ORDER VALUE',
            field: 'orderValue',
            sorting: false,
          },
          {
            title: 'ITEMS',
            field: 'items',
            type: 'numeric',
            sorting: false,
          },
          {
            title: 'DESTINATION',
            field: 'destination',
            sorting: false,
          },
          {
            title: 'DAYS OVERDUE',
            field: 'daysOverdue',
            type: 'numeric',
            render: (rowData) => (
              <span
                style={{ color: rowData.daysOverdue > 20 ? 'red' : 'black' }}
              >
                {rowData.daysOverdue}
              </span>
            ),
          },
        ]}
        data={orders}
        options={{
          paging: true,
          pageSize: 5,
          search: false,
          headerStyle: {
            fontSize: 12,
            color: '#ABB2B9',
            fontWeight: 600,
            backgroundColor: '#F2F3F4',
          },
          rowStyle: {
            fontSize: 12,
          },
        }}
      />
    </div>
  );
};

export default OverdueOrdersTable;
