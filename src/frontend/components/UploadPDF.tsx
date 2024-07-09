import React from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export async function action({ request }: any) {
  const formData = await request.formData();
  await fetch('/api/document/upload', {
    method: 'POST',
    body: formData,
  });
  return null;
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

