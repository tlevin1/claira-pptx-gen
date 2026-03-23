import axios from "axios";

export async function authenticate(
  authUrl: string,
  email: string,
  password: string
): Promise<string> {
  const response = await axios.post(`${authUrl}/login/`, {
    email,
    password,
  });

  return response.data.data.access_token;
}