import {useSelector} from "react-redux";
import {useState} from "react";
import {api} from "../../config/axios.js";
import extractErrorMessages from "../ExtractFetchingErrors/index.jsx";


export default function useGenericFetch(method) {
  const bearerToken = useSelector((state) => state.user.access_token);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const sendRequest = async ({ url, body = {}, config = {} }) => {
    if (!url || !bearerToken) {
      setError("Missing URL or token.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await api({
        method,
        url,
        data: body,
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          ...config.headers,
        },
        ...config,
      });

      setData(response.data);
      return response.data;
    } catch (err) {
      const backendError = err.response?.data || err.message;
      const errorMsg = extractErrorMessages?.(backendError) || backendError;
      setError(errorMsg);
      throw errorMsg;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { data, error, isLoading, sendRequest, reset };
}