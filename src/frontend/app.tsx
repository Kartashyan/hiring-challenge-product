import 'antd/dist/reset.css'

import { StrictMode } from "react";
import reactDOM from "react-dom/client";

function App() {
  return <h1>Hello world!</h1>
}

reactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
