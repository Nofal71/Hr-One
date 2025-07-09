import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://graph.microsoft.com/v1.0',
  headers: {
    Prefer: "HonorNonIndexedQueriesWarningMayFailRandomly"
  }
});
export default axiosInstance;
