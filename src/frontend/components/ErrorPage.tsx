import { useRouteError } from "react-router-dom";
import { Button, Result, Typography } from "antd";

const { Paragraph, Text } = Typography;

export function RootErrorBoundary() {
  const error = useRouteError() as Error;

  return (
    <Result
      status="error"
      title="Uh oh, something went wrong 😩"
      subTitle="Please try reloading the app."
    >
      <div style={{ marginBottom: 16 }}>
        <Paragraph>
          <Text type="danger">{error.message || JSON.stringify(error)}</Text>
        </Paragraph>
      </div>
      <Button type="primary" onClick={() => window.location.href = "/"}>
        Reload the app
      </Button>
    </Result>
  );
}
