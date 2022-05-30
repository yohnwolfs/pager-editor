import axios from 'axios';

const defaultRequires = (name: string) => {
  throw new Error(
    `Could not require '${name}'. The 'requires' function was not provided.`,
  );
};

const memoize = (func: Function): any => {
  const cache: Record<string, unknown> = {};
  return (key: string) => {
    if (key in cache == false) {
      cache[key] = func(key);
    }
    return cache[key];
  };
};

export interface CreateLoadRemoteModuleOptions {
  requires?: any;
  fetcher?: any;
}

interface LoadRemoteModule {
  (url: string): Promise<any>;
}

interface CreateLoadRemoteModule {
  (options?: CreateLoadRemoteModuleOptions): LoadRemoteModule;
}

export const createLoadRemoteModule: CreateLoadRemoteModule = ({
  requires,
  fetcher,
} = {}) => {
  const _requires = requires || defaultRequires;
  //   const _fetcher = fetcher || defaultFetcher;

  return memoize((url: string) =>
    axios.get(url).then((res) => {
      const exports = {};
      const module = { exports };
      const func = new Function('require', 'module', 'exports', res.data);
      func(_requires, module, exports);
      return module.exports;
    }),
  );
};
