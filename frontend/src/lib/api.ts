const API_BASE_URL = "http://localhost:3000/api/v1"; // Adjust if your backend runs on a different port

type AuthInput = {
  username: string;
  password: string;
};

const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.msg || data.message || `HTTP error! status: ${response.status}`
    );
  }
  return data;
};

export const signup = async (credentials: AuthInput) => {
  const response = await fetch(`${API_BASE_URL}/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

export const signin = async (credentials: AuthInput) => {
  const response = await fetch(`${API_BASE_URL}/users/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

// Example of a protected API call
export const getContent = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/content`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};
