import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { AppData } from '../interface';

/**
 * 应用设置的状态
 */
const useAppState = () => {
  const [appData, setAppData] = useState<AppData>();
  const [vars, setVars] = useState<Record<string, any>>([]);

  const setVar = (name: string, value: any) =>
    setVars((vars) => ({ ...vars, [name]: value }));

  return {
    vars,
    setVar,
    setVars,
    appData,
    setAppData,
  };
};

const Container = createContainer<ReturnType<typeof useAppState>>(useAppState);

export default Container;
