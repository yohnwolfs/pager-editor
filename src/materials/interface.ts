import { SelectOption } from '../modules/interface';
import { FormItemType } from './enums';

/** 组件元数据 */
export interface MetaData {
  version: string;
  name: string;
  displayName?: string;
  group: string;
  schema?: Schema;
  w?: number;
  h?: number;
  /** 缩略图 */
  img?: string;
  /** 是否远程组件 */
  remote?: boolean;
  /** 远程组件的url */
  url?: string;
  /** 自定义高度 */
  // customHeight?: number | string;
}

/** 组件Schema */
export interface Schema {
  /** 可编辑的属性 */
  props: PropObject[];
  /** 默认配置 */
  config: Record<string, unknown>;
}

/** 可编辑属性规范 */
export interface PropObject {
  key: string;
  name: string;
  type: FormItemType;
  options?: SelectOption<any>[];
}

/** 物料菜单属性 */
export interface MaterialMenu {
  group: string;
  displayName: string;
  icon: React.ReactElement;
  data: MetaData[];
}
