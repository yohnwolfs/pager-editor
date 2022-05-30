import { CreateLoadRemoteModuleOptions } from './createLoadRemoteModule';
import { createUseRemoteComponent } from './useRemoteComponent';

export interface RenderFunctionProperties {
  err: Error | undefined;
  Component: (...unknown: any[]) => JSX.Element;
}

export interface RenderFunction {
  (render: RenderFunctionProperties): JSX.Element;
}

export interface RemoteComponentOptions {
  url: string;
  fallback?: JSX.Element;
  render?: RenderFunction;
  [props: string]: unknown;
}

export interface RemoteComponent {
  (options: RemoteComponentOptions): JSX.Element | null;
}

export const createRemoteComponent = (
  props: CreateLoadRemoteModuleOptions,
): RemoteComponent => {
  const useRemoteComponent = createUseRemoteComponent(props);

  const RemoteComponent: RemoteComponent = ({
    url,
    fallback = null,
    render,
    ...props
  }) => {
    const [loading, err, Component] = useRemoteComponent(url);

    if (loading) {
      return fallback;
    }

    if (render) {
      return render({ err, Component });
    }

    if (err || !Component) {
      return <div>Unknown Error: {(err || 'UNKNOWN').toString()}</div>;
    }

    return <Component {...props} />;
  };

  return RemoteComponent;
};
