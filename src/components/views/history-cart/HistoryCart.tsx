// HistoryCart.jsx

import React from 'react';
import { Table } from 'antd';
import 'antd/dist/antd.css';  // Import Ant Design styles
import './HistoryCart.scss';  // Import your custom CSS styles

const HistoryCart = () => {
    // Sample order history data
    const orderHistory = [
        { id: 1, date: '2023-01-01', total: 50.00, items: ['Item 1', 'Item 2'] },
        { id: 2, date: '2023-01-05', total: 30.00, items: ['Item 3', 'Item 4'] },
        // Add more order history data as needed
    ];

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (text:any) => `$${text.toFixed(2)}`,
        },
        {
            title: 'Items',
            dataIndex: 'items',
            key: 'items',
            render: (items:any) => items.join(', '),
        },
    ];

    return (
        <div className="history-cart">
            <h2 className="history-cart-title">Order History</h2>
            <Table dataSource={orderHistory} columns={columns} />
        </div>
    );
};

export default HistoryCart;
