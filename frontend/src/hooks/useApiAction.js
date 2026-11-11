import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import { requestError } from "../lib/requestError";
export default function useApiAction() {
  const [state, setState] = useState({ data: null, error: "", pending: false });
  const controller = useRef(null);
  useEffect(() => () => controller.current?.abort(), []);
  const submit = useCallback(async (url, payload) => {
    controller.current?.abort();
    const request = new AbortController();
    controller.current = request;
    setState({ data: null, error: "", pending: true });
    try {
      const { data } = await api.post(url, payload, { signal: request.signal });
      if (!request.signal.aborted)
        setState({ data, error: "", pending: false });
      return request.signal.aborted ? null : data;
    } catch (error) {
      if (!request.signal.aborted)
        setState({ data: null, error: requestError(error), pending: false });
      return null;
    }
  }, []);
  const reset = useCallback(() => {
    controller.current?.abort();
    setState({ data: null, error: "", pending: false });
  }, []);
  return { ...state, submit, reset };
}
