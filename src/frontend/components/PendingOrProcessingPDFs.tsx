import { Table } from 'antd';
import React from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { DocumentModel } from 'src/backend/pdf-document/application/document.dto';
import { flatDocument } from '../utils';

export async function loader() {
    const response = await fetch('/api/document/pending-or-processing');
    const data = await response.json() as DocumentModel[];
    return data.map(flatDocument);
}

export const PendingPDFs: React.FC = () => {
    const documents = useLoaderData() as DocumentModel[];

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
                <Link to={`/view/${record.id}`}>Edit</Link>
              </span>
            ),
          },
    ];

    return <Table dataSource={documents} columns={columns} rowKey="id" />;
};

