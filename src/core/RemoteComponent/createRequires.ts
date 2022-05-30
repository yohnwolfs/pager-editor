export interface DependencyFunction {
  (): DependencyTable;
}

export interface DependencyTable {
  [props: string]: unknown;
}

export interface CreateRequires {
  (dependencies: DependencyTable | DependencyFunction): (
    module: string,
  ) => unknown;
}

export const sanitizeDependencies = (
  dependencies: DependencyTable | DependencyFunction,
): DependencyTable =>
  typeof dependencies === 'function' ? dependencies() : dependencies || {};

export const createRequires: CreateRequires = (
  dependencies: DependencyTable | DependencyFunction,
) => {
  let isSanitized = false;

  return (name) => {
    if (!isSanitized) {
      dependencies = sanitizeDependencies(dependencies);
      isSanitized = true;
    }

    if (!(name in dependencies)) {
      throw new Error(
        `Could not require '${name}'. '${name}' does not exist in dependencies.`,
      );
    }

    return (dependencies as DependencyTable)[name];
  };
};
