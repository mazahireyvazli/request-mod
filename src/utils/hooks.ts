import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { set } from "lodash";

type UpdateStateFn<S> = [
  S,
  (path: string, value: any) => void,
  Dispatch<SetStateAction<S>>,
];

export const useUpdateState = <S extends {} | null>(
  initialState: S,
): UpdateStateFn<S> => {
  const [state, setState] = useState(initialState);

  const updateState = useCallback((path: string, value: any) => {
    setState((s) => ({
      ...set(s!, path, value),
    }));
  }, []);

  return [state, updateState, setState];
};

export const useWithDebounce = () => {
  const timeoutRef = useRef(0);
  useEffect(() => {
    return () => {
      window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const withDebounce = (fn: Function, timeout: number = 300) => {
    window.clearTimeout(timeoutRef.current);

    timeoutRef.current = window.setTimeout(() => {
      fn();
    }, timeout);
  };

  return withDebounce;
};
