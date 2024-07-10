import React, { useState } from 'react';
import { useLoaderData, useParams, useSubmit, Form, redirect } from 'react-router-dom';
import { Form as AntForm, Input, Button, Select } from 'antd';

export async function loader({ params }: any) {
    const response = await fetch(`/api/document/${params.id}`);
    const data = await response.json();
    return data;
}

export async function action({ request, params }: any) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    await fetch(`/api/document/${params.id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return redirect(`/pending`);
}

export const ViewEditPDF: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const metadata = useLoaderData() as any;
    const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);

      const handleChange = (value: string) => {
    setSelectedValue(value);
  };


    return (
        <div>
            <h1>View and Edit PDF</h1>
            <iframe src={`/uploads/${id}.pdf`} width="100%" height="600px"></iframe>
            <Form
                method="post"
            >
                <AntForm.Item name="name" label="Name">
                    <Input name='name' defaultValue={metadata?.name}/>
                </AntForm.Item>
                <AntForm.Item name="author" label="Author">
                    <Input name="author" defaultValue={metadata?.author}/>
                </AntForm.Item>
                <AntForm.Item name="kind" label="Kind">
                    <Select
                        fieldNames={{ label: 'value', value: 'value' }}
                        defaultValue={metadata?.kind}
                        style={{ width: 200 }}
                        onChange={handleChange}
                        value={selectedValue}
                    >
                        <Select.Option value="ISO norm">ISO norm</Select.Option>
                        <Select.Option value="regulation">regulation</Select.Option>
                        <Select.Option value="internal documentation">internal documentation</Select.Option>
                    </Select>
                    <input type="hidden" name="kind" value={selectedValue} />
                </AntForm.Item>
                <AntForm.Item>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </AntForm.Item>
            </Form>
        </div>
    );
};

