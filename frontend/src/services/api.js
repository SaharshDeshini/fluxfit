const BASE_URL = "https://fluxfit.onrender.com";

export default async function apiRequest(
  endpoint,
  method = "GET",
  body = null,
  token = null
) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}/api${endpoint}`, options);

  if (!response.ok) {
    throw new Error("API Error");
  }

  return response.json();
}