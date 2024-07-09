import React from 'react';
import { useLoaderData, useParams, useSubmit } from 'react-router-dom';
import { Form, Input, Button } from 'antd';

export async function loader({ params }: any) {
  const response = await fetch(`/api/document/${params.id}`);
  const data = await response.json();
  return data;
}

export async function action({ request, params }: any) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  await fetch(`/api/document/${params.id}/metadata`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return null;
}

export const ViewEditPDF: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const metadata = useLoaderData() as any;
  const submit = useSubmit();

  return (
    <div>
      <h1>View and Edit PDF</h1>
      <iframe src={`/api/document/${id}/resource`} width="100%" height="600px"></iframe>
      {metadata && (
        <Form
          initialValues={metadata}
          onFinish={(values) => {
            submit(new FormData(values as any), { method: 'post' });
          }}
        >
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>
          <Form.Item name="author" label="Author">
            <Input />
          </Form.Item>
          <Form.Item name="kind" label="Kind">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

