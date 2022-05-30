import { DataSource, DataSourceMethod } from '../core/interface';
import { useState } from 'react';

/**
 * 数据源
 * @param initialValue
 * @returns
 */
const useDataSource = (initialValues?: DataSource[]) => {
  const [dataSources, setDataSources] = useState<DataSource[]>(
    initialValues || [],
  );

  const addDataSource = (data: DataSource) =>
    setDataSources((v) => [...v, data]);
  const removeDataSource = (id: string) =>
    setDataSources((v) => v.filter((item) => item.id !== id));
  const updateDataSource = (id: string, newV: Partial<DataSource>) =>
    setDataSources((v) =>
      v.map((item) => {
        if (item.id === id) return { ...item, ...newV };
        else return item;
      }),
    );
  const addDataSourceMethod = (id: string, method: DataSourceMethod) =>
    setDataSources((v) =>
      v.map((item) => {
        if (item.id === id)
          return { ...item, methods: [...item.methods, method] };
        else return item;
      }),
    );
  const removeDataSourceMethod = (id: string, methodId: string) => {
    setDataSources((v) =>
      v.map((item) => {
        if (item.id === id)
          return {
            ...item,
            methods: item.methods.filter((method) => method.id !== methodId),
          };
        else return item;
      }),
    );
  };
  const updateDataSourceMethod = (
    id: string,
    methodId: string,
    newM: Partial<DataSourceMethod>,
  ) => {
    setDataSources((v) =>
      v.map((item) => {
        if (item.id === id)
          return {
            ...item,
            methods: item.methods.map((method) => {
              if (method.id === methodId) return { ...method, ...newM };
              else return method;
            }),
          };
        else return item;
      }),
    );
  };

  return {
    dataSources,
    setDataSources,
    addDataSource,
    removeDataSource,
    updateDataSource,
    addDataSourceMethod,
    removeDataSourceMethod,
    updateDataSourceMethod,
  };
};

export default useDataSource;
