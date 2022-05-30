import { Schema } from '../materials/interface';

export interface PaginationType {
  pageIndex?: number;
  pageSize?: number;
}

export interface PaginationResult<T> {
  list: T[];
  total: number;
  pageSize: number;
  pageIndex: number;
}

export interface WidgetData {
  id: string;
  name: string;
  schema: Schema;
  displayName?: string;
  desc?: string;
  platform?: string;
  group: string;
  cover?: string;
  code?: string;
  version: string;
  w?: number;
  h?: number;
  user: User;
}

export interface User {
  nickname: string;
  picture: string;
}

export interface WidgetTag {
  id: string;
  name: string;
}
