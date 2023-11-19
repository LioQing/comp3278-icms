import React, { Dispatch, SetStateAction } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useCookies } from 'react-cookie';

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_BASE_URL;

export interface AxiosRequest<
  TData extends object = {},
  TParams extends object = {},
  THeaders extends object = {},
  TBody extends object = {},
> {
  url: string;
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  body?: TBody;
  data?: TData;
  params?: TParams;
  headers?: THeaders;
}

export interface AxiosClient<
  TResponseData extends object = any,
  TData extends object = {},
  TParams extends object = {},
  THeaders extends object = {},
> {
  response: AxiosResponse<TResponseData> | null;
  error: AxiosError | null;
  loading: boolean;
  request: AxiosRequest<TData, TParams, THeaders> | null;
  sendRequest: Dispatch<
    SetStateAction<AxiosRequest<TData, TParams, THeaders> | null>
  >;
}

const useAxios = <
  TResponseData extends object,
  TData extends object = {},
  TParams extends object = {},
  THeaders extends object = {},
>(): AxiosClient<TResponseData, TData, TParams, THeaders> => {
  const [request, setRequest] = React.useState<AxiosRequest<
    TData,
    TParams,
    THeaders
  > | null>(null);
  const [cookies, , removeCookies] = useCookies();
  const [response, setResponse] =
    React.useState<AxiosResponse<TResponseData> | null>(null);
  const [error, setError] = React.useState<AxiosError | null>(null);
  const [loading, setloading] = React.useState(false);

  const fetchData = React.useCallback(() => {
    if (!request) return;

    setloading(true);
    setResponse(null);
    setError(null);
    axios
      .request({
        url: request.url,
        method: request.method,
        data: request.data,
        params: request.params,
        headers: {
          ...request.headers,
          Authorization: cookies['auth-token']
            ? `Token ${cookies['auth-token']}`
            : undefined,
        },
      })
      .then((res) => {
        setResponse(res);
      })
      .catch((err) => {
        setError(err);
        if (err.response?.status === 401) {
          removeCookies('auth-token', { path: '/' });
        }
      })
      .finally(() => {
        setloading(false);
      });
  }, [request, cookies, removeCookies]);

  React.useEffect(() => {
    fetchData();
  }, [request]);

  return {
    response,
    error,
    loading,
    request,
    sendRequest: setRequest,
  };
};

export default useAxios;
