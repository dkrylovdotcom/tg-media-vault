import axios, { AxiosInstance } from 'axios';
import { API_URL } from '../../consts';

const configuredAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const useAxios = (): AxiosInstance => {
  return configuredAxios;
};
