import * as SecureStore from 'expo-secure-store';

export const runFetch = async ({
  url,
  method,
  body,
  auth,
  recovery = false,
}: {
  url: string;
  method: 'GET' | 'POST';
  body?: any;
  auth?: boolean;
  recovery?: boolean;
}): Promise<any> => {
  let headers: any = { 'Content-Type': 'application/json' };
  
  if (auth) {
    const token = await SecureStore.getItemAsync('token');
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (recovery) {
    const recoveryToken = await SecureStore.getItemAsync('recovery-token');
    console.log('recoveryToken', recoveryToken)
    if (recoveryToken) {
      headers['User-Token'] = recoveryToken;
    }
  }

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: method === 'POST' ? JSON.stringify(body) : null,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      throw {
        status: res.status,
        message: data?.message || 'An error occurred',
        error: data?.error || null,
      };
    }

    return data;
  } catch (error) {
    throw error;
  }
};