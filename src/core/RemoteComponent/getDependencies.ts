interface EnsureRemoteComponentConfigOptions {
  resolve: unknown;
}

interface EnsureRemoteComponentConfig {
  (options: EnsureRemoteComponentConfigOptions): { [prop: string]: unknown };
}

interface GetDependencies {
  (): { [prop: string]: unknown };
}

const cannotFindModule = (err: Error) =>
  err &&
  typeof err.message === 'string' &&
  err.message.indexOf('Cannot find module') > -1;

const isConfigInResolve = (config: unknown) =>
  typeof config === 'object' &&
  config !== null &&
  'remote-component.config' in config;

export const ensureRemoteComponentConfig: EnsureRemoteComponentConfig = ({
  resolve,
}) => {
  if (isConfigInResolve(resolve)) {
    return resolve;
  }

  const newResolve = { ...(resolve as any) };
  newResolve['remote-component.config'] = { resolve: newResolve };

  return newResolve;
};

export const getDependencies: GetDependencies = () => {
  try {
    return ensureRemoteComponentConfig(
      require('../../remote-component.config').default,
    );
  } catch (err) {
    if (!cannotFindModule(err as Error)) {
      throw err;
    }

    return {};
  }
};
