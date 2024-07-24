import axios from 'axios';

// export const BaseURL = import.meta.env.VITE_API_URL;
export const BaseURL = process.env.NEXT_PUBLIC_API_URL
const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/;
export const axiosBase = axios.create({
  baseURL: BaseURL,
  transformResponse: (data) =>
    JSON.parse(data, (key, value) =>
      isoDateFormat.test(key) ? new Date(value) : value
    ),
});

axios.defaults.baseURL = BaseURL;
axios.defaults.transformResponse = (data) =>
  JSON.parse(data, (key, value) =>
    isoDateFormat.test(value) ? new Date(value) : value
  );

export const getAxiosUrl = () => {
  return axios.defaults.baseURL;
}

axios.interceptors.request.use(async (request) => {
  request.maxContentLength = Infinity;
  request.maxBodyLength = Infinity;
  return request;
}, error => {
  //console.log(`Request Error: ${error}`);
  return Promise.reject(error);
});

axios.interceptors.response.use(response => {
  //console.log(`API Call End: ${response.data.message}`);
  return response?.data;
}, async error => {
  //console.log(`Request Error: ${error.message}`);
  return Promise.reject(error);
});
