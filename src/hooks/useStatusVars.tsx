import { StatusVar } from '../core/interface';
import { useMemo, useState } from 'react';

/** 状态池 */
const useStatusVars = (initialValues?: StatusVar[]) => {
  const [vars, setVars] = useState<StatusVar[]>(initialValues || []);
  const varsObj = useMemo(() => {
    return vars?.reduce<Record<string, any>>(
      (obj, item) => ({ ...obj, [item.id]: item.value }),
      {},
    );
  }, [vars]);

  const addVar = (payload: StatusVar) => setVars((vars) => [...vars, payload]);
  const removeVar = (id: string) =>
    setVars((vars) => vars.filter((v) => v.id !== id));
  const updateVar = (id: string, payload: StatusVar) =>
    setVars((vars) =>
      vars.map((v) => (v.id === id ? { ...v, ...payload } : v)),
    );

  return { vars, varsObj, setVars, addVar, removeVar, updateVar };
};

export default useStatusVars;
