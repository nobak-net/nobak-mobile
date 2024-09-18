
// import { useState, useEffect } from 'react';

// export const useFetch = (url: string, method: 'POST' | 'GET', body?: any, headers = {}) => {
//   const [response, setResponse] = useState(null);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!url) return;
//       try {
//         const options = {
//           method,
//           headers: { 'Content-Type': 'application/json', ...headers },
//           body: method === 'GET' ? null : JSON.stringify(body),
//         };
//         const res = await fetch(url, options);
//         if (!res.ok) throw new Error(res.statusText);
//         const json = await res.json();
//         setResponse(json);
//       } catch (error) {
//         setError(error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();

//     // Cleanup function
//     return () => {
//       // Cancel fetch operation if required
//     };
//   }, [url, method, body, headers]);

//   return { response, error, isLoading };
// };
