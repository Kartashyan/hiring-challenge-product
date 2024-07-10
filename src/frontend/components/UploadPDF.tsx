import { ActionFunctionArgs, Form, redirect, useNavigation } from 'react-router-dom';

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
        if (error instanceof Error) {
            return new Response(error.message, { status: 400 });
        }
        return new Response('An unknown error occurred', { status: 500 });
    }
}
export function UploadPDF() {
    const navigation = useNavigation();
  
    return (
      <div>
        <h1>Upload PDF</h1>
        <Form method="post" encType="multipart/form-data">
          <input type="file" name="pdf" accept="application/pdf" />
          <button type="submit" disabled={navigation.state === "submitting"}>
            {navigation.state === "submitting" ? "Uploading..." : "Upload"}
          </button>
        </Form>
      </div>
    );
  }

