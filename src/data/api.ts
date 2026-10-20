const API_BASE_URL = "http://localhost:3000";

export type HealthResponse = {
  status: string;
  service: string;
  timestamp: string;
};

export async function getApiHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/health`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<HealthResponse>;
}