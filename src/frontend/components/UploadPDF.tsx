import React from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { ActionFunctionArgs, redirect } from 'react-router-dom';

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    try {
      const response = await fetch('/api/document/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      return redirect("/pending");
    } catch (error) {
      if(error instanceof Error) {
        return new Response(error.message, { status: 400 });
      }
      return new Response('An unknown error occurred', { status: 500 });
    }
}

export const UploadPDF: React.FC = () => {
  return (
    <Upload
      action="/api/document/upload"
      method="post"
      name="file"
      showUploadList={false}
    >
      <Button icon={<UploadOutlined />}>Upload PDF</Button>
    </Upload>
  );
};

