import { useEffect, useState } from 'react';
import {
  createLoadRemoteModule,
  CreateLoadRemoteModuleOptions,
} from './createLoadRemoteModule';

export interface UseRemoteComponentHook {
  (url: string): [
    boolean,
    Error | undefined,
    (args: CreateLoadRemoteModuleOptions) => JSX.Element,
  ];
}

export const createUseRemoteComponent = (
  args?: CreateLoadRemoteModuleOptions,
): UseRemoteComponentHook => {
  const loadRemoteModule = createLoadRemoteModule(args);

  const useRemoteComponent: UseRemoteComponentHook = (url) => {
    const [{ loading, err, component }, setState] = useState<{
      loading: boolean;
      err?: Error;
      component?: any;
    }>({
      loading: true,
      err: undefined,
      component: undefined,
    });

    useEffect(() => {
      let update = setState;
      update({ loading: true, err: undefined, component: undefined });
      loadRemoteModule(url)
        .then((exports) => {
          update({
            loading: false,
            err: undefined,
            component: exports?.widget || exports?.default || exports,
          });
        })
        .catch((err) => {
          console.log(err);
          update({ loading: false, err, component: undefined });
        });

      return () => {
        // invalidate update function for stale closures
        update = () => {
          // this function is left intentionally blank
        };
      };
    }, [url]);

    return [loading, err, component];
  };

  return useRemoteComponent;
};
