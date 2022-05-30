import { MetaData, Schema } from '../materials/interface';

/** 拖拽dnd数据结构 */
export interface DragObject extends MetaData {
  /** 组件配置 */
  config: Record<string, unknown>;
  /** 组件schema */
  schema?: Schema;
}
export type DropResult = void;
export interface CollectedDragProps {
  isDragging: boolean;
}
export interface CollectedDropProps {
  isOver: boolean;
}

/** 交互类型 */
export type ActionType = 'link' | 'vars' | 'request' | 'script';

/** 事件类型 */
export type EventType =
  | 'onClick'
  | 'onMouseDown'
  | 'onMouseUp'
  | 'onTouchStart'
  | 'onTouchEnd'
  | 'onChange';

/** 类型中文映射 */
export const ActionTypeMap: Record<string, string> = {
  link: '跳转链接',
  vars: '改变状态',
  request: '请求接口',
  script: '执行脚本',
};
export const EventTypeMap: Record<string, string> = {
  onClick: 'onClick',
  onMouseDown: 'onMouseDown',
  onMouseUp: 'onMouseUp',
  onTouchStart: 'onTouchStart',
  onTouchEnd: 'onTouchEnd',
  onChange: 'onChange',
};

/** 交互动作 */
export interface Action {
  type: ActionType;
  /**  跳转url, 或者请求url, 请求结果可以通过vars赋值到变量中 */
  url?:
    | string
    | {
        method: string;
        url: string;
        vars?: VarAssign;
        params?: Record<string, string>; // {name: varId}
      };
  vars?: VarAssign[]; // 设置状态变量
  js?: string; // 自定义执行脚本
}

/** 赋值动作 */
export interface VarAssign {
  id: string;
  name: string;
  value: any;
}
/** 变量映射 */
export interface VarMap {
  id: string;
  name: string;
  prop: string;
}
export interface ViewAction extends Action {
  event: EventType;
}

/** 视图数据结构 */
export interface ViewData {
  id: string;
  /** 组件的元数据和配置 */
  item: DragObject;
  /** 组件的gridlayout数据 */
  layout: ReactGridLayout.Layout;
  /** 组件容器样式 */
  style?: React.CSSProperties;
  /** 固定高度 */
  isFixedHeight?: boolean;
  /** 是否绝对定位 */
  isAbsolute?: boolean;
  /** 子节点 */
  children?: ViewData[];
  /** 交互 */
  actions?: ViewAction[];
  /** 状态变量绑定映射, 映射格式 {name, varId} */
  varMaps?: VarMap[];
}

/** 变量类型 */
export type VarType = 'string' | 'number' | 'boolean' | 'object' | 'array';
export const VarTypeMap: Record<string, string> = {
  string: '字符串',
  number: '数值',
  boolean: '布尔值',
  object: '对象',
  array: '数组',
};
/** 状态变量 */
export interface StatusVar {
  id: string;
  name: string;
  displayName?: string;
  type: VarType;
  value: any;
}

/** 应用数据格式，多页面 */
export interface AppData {
  id: string;
  name: string;
  pages: PageData[];
  vars?: StatusVar[]; // 状态变量
  init?: Action[]; // 初始化的时候执行动作，例如请求异步数据
  dataSources?: DataSource[]; // 数据源
}

/** 页面数据格式 */
export interface PageData {
  id: string;
  name: string;
  displayName: string;
  views: ViewData[];
  width: number;
  height?: number;
  style?: React.CSSProperties;
}

/** 动态组件的固定props */
export interface ViewProps {
  superData: ViewData;
  renderer: 'web' | 'editor';
  url?: string;
}

/** 数据源定义 */
export interface DataSource {
  id: string;
  name: string;
  methods: DataSourceMethod[];
}

export interface DataSourceMethod {
  id: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'static'; // static 为静态数据源
  name: string;
  description?: string;
  url?: string;
  data?: any; // request body数据
  staticData?: any; // 静态数据源
  savedToVar?: string; // 将结果存在哪个变量中
}
export const MethodMap: Record<string, string> = {
  get: '获取（get）',
  post: '提交（post）',
  put: '更新（put）',
  delete: '删除（delete）',
  static: '静态数据',
};
