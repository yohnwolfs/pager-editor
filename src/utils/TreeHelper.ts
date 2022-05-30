// import update from 'immutability-helper';

interface TreeNode<T> {
  id: string;
  children?: T[];
}

/** 树形结构数据 */
export class TreeHelper<T extends TreeNode<T>> {
  data: T[];
  constructor(d: T[]) {
    this.data = d;
  }
  add(payload: T, containerId?: string) {
    if (containerId) return addToTree(containerId, payload, this.data);
    else return [...this.data, payload];
  }
  find(id: string): T | undefined {
    return findTreeNode(id, this.data);
  }
  remove(id: string): T[] {
    return removeTreeNode(id, this.data);
  }
  update(payload: T): T[] {
    return this.map((item) => {
      return item.id === payload.id ? { ...item, ...payload } : item;
    });
  }
  map(fn: (item: T) => any): any[] {
    return mapTree(fn, this.data) || [];
  }
  move(startIndex: number, endIndex: number, containerId?: string): T[] {
    // TODO: 实现移动
    return this.data;
  }
}

/** tree map */
const mapTree = <T extends TreeNode<T>>(
  fn: (item: T) => any,
  data?: T[],
): T[] | undefined => {
  return data?.map((item) => {
    const fns = fn(item);
    return {
      ...fns,
      children: mapTree<T>(fn, item.children),
    };
  });
};
const addToTree = <T extends TreeNode<T>>(
  parentId: string,
  payload: T,
  data: T[],
): T[] => {
  return data?.map((item) => {
    if (item.id === parentId)
      return { ...item, children: [...(item.children || []), payload] };
    else if (item.children)
      return {
        ...item,
        children: addToTree<T>(parentId, payload, item.children),
      };
    else return item;
  });
};
const findTreeNode = <T extends TreeNode<T>>(
  id: string,
  data: T[],
): T | undefined => {
  let res: T | undefined = undefined;
  data?.some((item) => {
    if (item.id === id) {
      res = item;
      return true;
    } else if (item.children) {
      const r = findTreeNode<T>(id, item.children);
      if (r) res = r;
      else return false;
    } else return false;
  });
  return res;
};
const removeTreeNode = <T extends TreeNode<T>>(id: string, data?: T[]): T[] => {
  return data
    ?.map((item) => {
      if (item.id === id) return undefined;
      else if (item.children)
        return { ...item, children: removeTreeNode<T>(id, item.children) };
      else return item;
    })
    .filter(Boolean) as T[];
};
