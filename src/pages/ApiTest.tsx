import { useEffect, useState } from "react";
import { getApiHealth, type HealthResponse } from "../data/api";

export default function ApiTest() {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApiHealth()
      .then(setData)
      .catch((err: unknown) => {
        setError(
          err instanceof Error ? err.message : "Unknown API error",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <main><h1>Checking API...</h1></main>;

  if (error) {
    return (
      <main>
        <h1>API connection failed</h1>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Backend connection successful</h1>
      <p>Status: {data?.status}</p>
      <p>Service: {data?.service}</p>
      <p>Timestamp: {data?.timestamp}</p>
    </main>
  );
}