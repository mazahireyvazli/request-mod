import { Dispatch, SetStateAction, useCallback, useState } from "react";

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
