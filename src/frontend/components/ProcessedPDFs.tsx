import { useLoaderData, Link } from 'react-router-dom';
import { Table, Button } from 'antd';

export async function loader() {
  const response = await fetch('/api/document/processed');
  const data = await response.json();
  return data;
}

export const ProcessedPDFs: React.FC = () => {
  const pdfs = useLoaderData() as any[];

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Author', dataIndex: 'author', key: 'author' },
    { title: 'Kind', dataIndex: 'kind', key: 'kind' },
    { title: 'Uploaded At', dataIndex: 'uploadedAt', key: 'uploadedAt' },
    { title: 'Processed At', dataIndex: 'updatedAt', key: 'updatedAt' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: any) => (
        <span>
          <Link to={`/document/${record.id}`}>View</Link>
          <Button type="link" onClick={() => handleDelete(record.id)}>Delete</Button>
        </span>
      ),
    },
  ];

  const handleDelete = async (id: string) => {
    await fetch(`/api/document/${id}`, { method: 'DELETE' });
    // Reload data
    window.location.reload();
  };

  return <Table dataSource={pdfs} columns={columns} rowKey="id" />;
};

