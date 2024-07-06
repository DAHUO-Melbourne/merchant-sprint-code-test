import React from 'react';
import MaterialTable from 'material-table';
import { Order } from '../page/Dashboard';

interface OverdueOrdersTableProps {
  orders: Order[];
}

const OverdueOrdersTable: React.FC<OverdueOrdersTableProps> = ({ orders }) => {
  return (
    <MaterialTable
      title="Overdue Orders"
      columns={[
        { title: 'MARKETPLACE', field: 'storeMarketplace' },
        { title: 'STORE', field: 'storeShopName' },
        { title: 'ORDER ID', field: 'orderId' },
        { title: 'ORDER VALUE', field: 'orderValue' },
        { title: 'ITEMS', field: 'items', type: 'numeric' },
        { title: 'DESTINATION', field: 'destination' },
        {
          title: 'DAYS OVERDUE',
          field: 'daysOverdue',
          type: 'numeric',
          render: (rowData) => (
            <span style={{ color: rowData.daysOverdue > 20 ? 'red' : 'black' }}>
              {rowData.daysOverdue}
            </span>
          ),
        },
      ]}
      data={orders}
      options={{
        paging: true,
        pageSize: 5,
      }}
    />
  );
};

export default OverdueOrdersTable;
