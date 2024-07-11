import { useLoaderData, Link, LoaderFunction, useSubmit, ActionFunction } from 'react-router-dom';
import { Table, Button } from 'antd';
import { flatDocument, FlatDocumentModel } from '../utils';

export const loader: LoaderFunction = async () => {
  const response = await fetch('/api/document/processed');
  const data = await response.json();
  return data.map(flatDocument);
}

export const action: ActionFunction = async ({ params, request }) => {
  const formData = await request.formData();
  const id = formData.get('id') as string;
  const response = await fetch(`/api/document/${id}`, { method: 'DELETE' });
  const data = await response.json();
  return data;
}

export const ProcessedPDFs: React.FC = () => {
  const documents = useLoaderData() as FlatDocumentModel[];
  const submit = useSubmit();

  const handleDelete = async (id: string) => {
    let formData = new FormData();
    formData.append("id", id);
    submit(formData, { method: 'DELETE' });
  };

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
          <Link to={`/view/${record.id}`}>View</Link>
          <Button type="link" onClick={() => handleDelete(record.id)}>Delete</Button>
        </span>
      ),
    },
  ];

  return <Table dataSource={documents} columns={columns} rowKey="id" />;
};

