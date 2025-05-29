import { useEffect } from 'react';
import useGenericFetch from "./useGenericFetch.jsx";

export default function useFetchGet(url, config = {}) {
  const { data, error, isLoading, sendRequest, reset } = useGenericFetch('get');

  const configString = JSON.stringify(config);
  useEffect(() => {
    if (!url) return;
    sendRequest({ url, config });
  }, [url, configString]);

  return { data, error, isFetching: isLoading, reset };
}