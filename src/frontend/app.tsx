import { Layout, Menu } from 'antd';
import 'antd/dist/reset.css'
import { Content, Header } from 'antd/es/layout/layout';

import { StrictMode } from "react";
import reactDOM from "react-dom/client";
import { createBrowserRouter, Link, Outlet, RouterProvider } from 'react-router-dom';
import { UploadPDF, action as uploadPDFAction} from './components/UploadPDF';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/upload', element: <UploadPDF />, action: uploadPDFAction },
    ],
  },
]);

function App() {
  return (
    <Layout>
      <Header>
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="1">
            <Link to="/">Processed PDFs</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/pending">Pending PDFs</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/upload">Upload PDF</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px', marginTop: '64px' }}>
        <Outlet />
      </Content>
    </Layout>
  )
}

reactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
