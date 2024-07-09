import React from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { Button, Table } from 'antd';

export async function loader() {
    const response = await fetch('/api/document/pending');
    const data = await response.json();
    return data;
}

export const PendingPDFs: React.FC = () => {
    const pdfs = useLoaderData() as any[];

    const columns = [
        { title: 'Title', dataIndex: 'name', key: 'name' },
        { title: 'Author', dataIndex: 'author', key: 'author' },
        { title: 'Kind', dataIndex: 'kind', key: 'kind' },
        { title: 'Uploaded At', dataIndex: 'uploadedAt', key: 'uploadedAt' },
        { title: 'Status', dataIndex: 'status', key: 'status' },
        { title: 'Updated At', dataIndex: 'updatedAt', key: 'updatedAt' },
        {
            title: 'Actions',
            key: 'actions',
            render: (text: any, record: any) => (
              <span>
                <Link to={`/document/${record.id}`}>Edit</Link>
              </span>
            ),
          },
    ];

    return <Table dataSource={pdfs} columns={columns} rowKey="id" />;
};

